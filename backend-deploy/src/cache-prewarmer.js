/**
 * Cache Pre-Warmer
 * Pre-loads frequently accessed data into cache on server startup
 * This eliminates the "cold start" problem where first requests are slow
 */

const { prisma } = require('./lib/prisma');
const cache = require('./cache');

async function prewarmCache() {
  console.log('\n🔥 PRE-WARMING CACHE...');
  const startTime = Date.now();
  
  try {
    // Pre-load menu items
    console.log('   📋 Loading menu items...');
    const menuItems = await prisma.menuItem.findMany({
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
    
    const transformedItems = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      priceCents: item.priceCents,
      price: `$${(item.priceCents / 100).toFixed(2)}`,
      category: { name: item.category.name },
      categoryId: item.categoryId,
      stock: item.stock,
      available: item.available,
      availability: item.available ? 'In Stock' : 'Out of Stock',
      image: item.image || '/default-food.png',
      active: item.available
    }));
    
    cache.set('menu-items:all', transformedItems, 300000);
    console.log(`   ✅ Cached ${menuItems.length} menu items`);
    
    // Pre-load categories
    console.log('   📂 Loading categories...');
    const categories = await prisma.menuCategory.findMany({
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
    
    cache.set('categories:all', categories, 300000);
    console.log(`   ✅ Cached ${categories.length} categories`);
    
    // Pre-load recent orders
    console.log('   🛒 Loading orders...');
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        table: {
          select: {
            id: true,
            label: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Only cache recent orders
    });
    
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalCents: order.totalCents,
      total: order.totalCents / 100,
      customerName: order.customerName,
      customerContact: order.customerContact,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      userId: order.userId,
      userName: order.user?.name,
      items: order.items.map(item => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        priceCents: item.priceCents,
        price: item.priceCents / 100
      })),
      subtotal: order.totalCents / 100,
      tableLabel: order.table?.label
    }));
    
    cache.set('orders:all', transformedOrders, 120000);
    console.log(`   ✅ Cached ${orders.length} orders`);
    
    const duration = Date.now() - startTime;
    console.log(`\n🚀 CACHE PRE-WARMED in ${duration}ms!`);
    console.log('   💡 First requests will now be INSTANT!\n');
    
  } catch (error) {
    console.error('❌ Error pre-warming cache:', error.message);
  }
}

module.exports = { prewarmCache };

