const express = require('express');
const { prisma } = require('../lib/prisma');
const { requireAnyAuth } = require('../middleware/auth');
const cache = require('../cache');
const etagMiddleware = require('../middleware/etag-cache');
const deduplicator = require('../request-deduplicator');
const router = express.Router();

// Category Management Routes

// Get all categories
router.get('/categories', etagMiddleware, async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'categories:all';
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('🚀 CACHE HIT! Returning cached categories (instant)');
      return res.json(cached);
    }

    console.log('💾 CACHE MISS - Fetching categories from PostgreSQL (optimized query)...');
    
    // Use deduplication to prevent stampeding herd
    const categories = await deduplicator.deduplicate(cacheKey, async () => {
      const startTime = Date.now();
      const data = await prisma.menuCategory.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          items: {
            select: {
              id: true,
              name: true,
              available: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });
      console.log(`⚡ Query took ${Date.now() - startTime}ms`);
      return data;
    });
    
    // Cache for 5 MINUTES (increased from 30 seconds for better performance)
    cache.set(cacheKey, categories, 300000);
    console.log('✅ Stored categories in cache for 5 minutes');
    
    // Allow some caching on client side (5 seconds)
    res.set('Cache-Control', 'public, max-age=5');
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new category
router.post('/categories', requireAnyAuth(), async (req, res) => {
  try {
    const { name, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const category = await prisma.menuCategory.create({
      data: {
        name,
        image: image || null
      },
      include: {
        items: true
      }
    });
    
    // Clear cache when data changes
    cache.clearPattern('categories:');
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

// Update category
router.put('/categories/:id', requireAnyAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    
    const category = await prisma.menuCategory.update({
      where: { id },
      data: {
        name,
        image: image || null
      },
      include: {
        items: true
      }
    });
    
    // Clear cache when data changes
    cache.clearPattern('categories:');
    cache.clearPattern('menu-items:');
    
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Category not found' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
});

// Delete category
router.delete('/categories/:id', requireAnyAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { force } = req.query; // ?force=true to cascade delete
    
    // Check if category has items
    const categoryWithItems = await prisma.menuCategory.findUnique({
      where: { id },
      include: { 
        items: {
          select: {
            id: true,
            name: true,
            priceCents: true
          }
        }
      }
    });
    
    if (!categoryWithItems) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // If category has items and force delete is not requested
    if (categoryWithItems.items.length > 0 && force !== 'true') {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing menu items',
        details: {
          categoryName: categoryWithItems.name,
          itemCount: categoryWithItems.items.length,
          items: categoryWithItems.items.map(item => ({
            id: item.id,
            name: item.name,
            price: `$${(item.priceCents / 100).toFixed(2)}`
          }))
        }
      });
    }
    
    // If force delete is requested, delete all items first - use transaction for atomicity
    if (force === 'true' && categoryWithItems.items.length > 0) {
      console.log(`🗑️ Cascade deleting ${categoryWithItems.items.length} items from category: ${categoryWithItems.name}`);
      
      try {
        // Execute both deletes in a transaction to ensure atomicity
        await prisma.$transaction([
          prisma.menuItem.deleteMany({
            where: { categoryId: id }
          }),
          prisma.menuCategory.delete({
            where: { id }
          })
        ]);
        
        console.log(`✅ Deleted ${categoryWithItems.items.length} menu items and category in transaction`);
      } catch (transactionError) {
        console.error('❌ Transaction failed - no changes committed:', transactionError);
        throw transactionError;
      }
    } else {
      // No items to delete, just delete the category
      await prisma.menuCategory.delete({
        where: { id }
      });
    }
    
    // Clear cache when data changes
    cache.clearPattern('categories:');
    cache.clearPattern('menu-items:');
    
    console.log(`✅ Category deleted: ${categoryWithItems.name}`);
    
    res.json({ 
      message: 'Category deleted successfully',
      deletedItems: force === 'true' ? categoryWithItems.items.length : 0
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
});

// Get all menu items
router.get('/menu-items', etagMiddleware, async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'menu-items:all';
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('🚀 CACHE HIT! Returning cached menu items (instant)');
      return res.json(cached);
    }

    console.log('💾 CACHE MISS - Fetching from PostgreSQL (optimized query)...');
    
    // Use deduplication to prevent stampeding herd
    const menuItems = await deduplicator.deduplicate(cacheKey, async () => {
      const startTime = Date.now();
      const data = await prisma.menuItem.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          priceCents: true,
          categoryId: true,
          stock: true,
          available: true,
          image: true,
          category: {
            select: {
              name: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });
      console.log(`⚡ PostgreSQL query took ${Date.now() - startTime}ms`);
      return data;
    });
    
    // Transform data to match frontend expectations
    const transformedItems = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      priceCents: item.priceCents,
      price: `$${(item.priceCents / 100).toFixed(2)}`,
      category: { name: item.category?.name || 'Uncategorized' },
      categoryId: item.categoryId,
      stock: item.stock,
      available: item.available,
      availability: item.available ? 'In Stock' : 'Out of Stock',
      image: item.image || '/default-food.png',
      active: item.available
    }));
    
    // Cache for 5 MINUTES (increased from 30 seconds for better performance)
    cache.set(cacheKey, transformedItems, 300000);
    console.log('✅ Stored in cache for 5 minutes');
    
    // Allow some caching on client side (5 seconds)
    res.set('Cache-Control', 'public, max-age=5');
    
    res.json(transformedItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu item by ID
router.get('/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Transform data to match frontend expectations
    const transformedItem = {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description || '',
      priceCents: menuItem.priceCents,
      price: `$${(menuItem.priceCents / 100).toFixed(2)}`,
      category: { name: menuItem.category.name },
      stock: menuItem.stock,
      availability: menuItem.available ? 'In Stock' : 'Out of Stock',
      image: menuItem.image || '/default-food.png',
      active: menuItem.available
    };
    
    res.json(transformedItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Create new menu item
router.post('/menu-items', requireAnyAuth(), async (req, res) => {
  try {
    const { name, description, price, category, stock, availability, image } = req.body;
    
    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    // Find or create category
    let categoryRecord = await prisma.menuCategory.findUnique({
      where: { name: category }
    });
    
    if (!categoryRecord) {
      categoryRecord = await prisma.menuCategory.create({
        data: { name: category }
      });
    }
    
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || '',
        priceCents: Math.round(parseFloat(price) * 100),
        stock: parseInt(stock) || 0,
        available: availability !== 'Out of Stock',
        image: image || null,
        categoryId: categoryRecord.id
      },
      include: {
        category: true
      }
    });
    
    // Clear cache when data changes
    cache.clearPattern('menu-items:');
    cache.clearPattern('categories:');
    
    // Transform response
    const transformedItem = {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description || '',
      priceCents: menuItem.priceCents,
      price: `$${(menuItem.priceCents / 100).toFixed(2)}`,
      category: { name: menuItem.category.name },
      stock: menuItem.stock,
      availability: menuItem.available ? 'In Stock' : 'Out of Stock',
      image: menuItem.image || '/default-food.png',
      active: menuItem.available
    };
    
    res.status(201).json(transformedItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Update menu item
router.put('/menu-items/:id', requireAnyAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, availability, image } = req.body;
    
    console.log('📝 Update menu item request:', { id, name, price, category, stock, availability });
    
    // Validate category is a string
    if (category && typeof category !== 'string') {
      console.error('❌ Invalid category type:', typeof category, category);
      return res.status(400).json({ error: 'Category must be a string' });
    }
    
    // Find or create category if provided
    let categoryId = null;
    if (category) {
      let categoryRecord = await prisma.menuCategory.findUnique({
        where: { name: category }
      });
      
      if (!categoryRecord) {
        console.log('📁 Creating new category:', category);
        categoryRecord = await prisma.menuCategory.create({
          data: { name: category }
        });
      }
      categoryId = categoryRecord.id;
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.priceCents = Math.round(parseFloat(price) * 100);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (availability !== undefined) updateData.available = availability !== 'Out of Stock';
    if (image !== undefined) updateData.image = image;
    if (categoryId) updateData.categoryId = categoryId;
    
    // Check if menu item exists first
    const existingItem = await prisma.menuItem.findUnique({
      where: { id }
    });
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });
    
    // Clear cache when data changes
    cache.clearPattern('menu-items:');
    cache.clearPattern('categories:');
    
    // Transform response
    const transformedItem = {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description || '',
      priceCents: menuItem.priceCents,
      price: `$${(menuItem.priceCents / 100).toFixed(2)}`,
      category: { name: menuItem.category.name },
      stock: menuItem.stock,
      availability: menuItem.available ? 'In Stock' : 'Out of Stock',
      image: menuItem.image || '/default-food.png',
      active: menuItem.available
    };
    
    console.log('✅ Menu item updated successfully:', transformedItem.id);
    res.json(transformedItem);
  } catch (error) {
    console.error('❌ Error updating menu item:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Menu item not found' });
    } else {
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  }
});

// Delete menu item
router.delete('/menu-items/:id', requireAnyAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.menuItem.delete({
      where: { id }
    });
    
    // Clear cache when data changes
    cache.clearPattern('menu-items:');
    cache.clearPattern('categories:');
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Menu item not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  }
});

module.exports = router;

