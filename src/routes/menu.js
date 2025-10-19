const express = require('express');
const { prisma } = require('../lib/prisma');
const { requireAnyAuth } = require('../middleware/auth');
const router = express.Router();

// Category Management Routes

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      include: {
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
    
    // Cache static menu data for 5 minutes with ETag for conditional requests
    const crypto = require('crypto');
    const etag = `"${crypto.createHash('md5').update(JSON.stringify(categories)).digest('hex')}"`;
    res.set('Cache-Control', 'public, max-age=300');
    res.set('ETag', etag);
    
    // Check if client has cached version
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }    
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
    
    // Clear cache for category mutations
    res.set('Clear-Site-Data', 'cache');
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
    
    // Clear cache for category mutations
    res.set('Clear-Site-Data', 'cache');
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
    
    // Check if category has items
    const categoryWithItems = await prisma.menuCategory.findUnique({
      where: { id },
      include: { items: true }
    });
    
    if (!categoryWithItems) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    if (categoryWithItems.items.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing menu items' 
      });
    }    
    await prisma.menuCategory.delete({
      where: { id }
    });
    
    // Clear cache for category mutations
    res.set('Clear-Site-Data', 'cache');
    res.json({ message: 'Category deleted successfully' });
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
router.get('/menu-items', async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });
    
    // Transform data to match frontend expectations
    const transformedItems = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      priceCents: item.priceCents,
      price: `$${(item.priceCents / 100).toFixed(2)}`,
      category: { name: item.category.name },
      stock: item.stock,
      availability: item.available ? 'In Stock' : 'Out of Stock',
      image: item.image || '/default-food.png',
      active: item.available
    }));
    
    // Cache static menu data for 5 minutes with ETag for conditional requests
    const crypto = require('crypto');
    const etag = `"${crypto.createHash('md5').update(JSON.stringify(transformedItems)).digest('hex')}"`;
    res.set('Cache-Control', 'public, max-age=300');
    res.set('ETag', etag);
    
    // Check if client has cached version
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }
    
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
    
    // Clear cache for menu item mutations
    res.set('Clear-Site-Data', 'cache');
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
    
    // Find or create category if provided
    let categoryId = null;
    if (category) {
      let categoryRecord = await prisma.menuCategory.findUnique({
        where: { name: category }
      });
      
      if (!categoryRecord) {
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
    
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });
    
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
    
    // Clear cache for menu item mutations
    res.set('Clear-Site-Data', 'cache');
    res.json(transformedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
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
    
    // Clear cache for menu item mutations
    res.set('Clear-Site-Data', 'cache');
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

