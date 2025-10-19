const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all orders
router.get('/', async (req, res) => {
  try {
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match frontend format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.id.slice(-4), // Use last 4 chars of ID as order number
      customerName: order.user?.name || 'Guest',
      customerId: order.userId,
      customerEmail: order.user?.email,
      date: order.createdAt.toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: order.createdAt.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      status: order.status,
      statusColor: getStatusColor(order.status),
      statusDot: getStatusDot(order.status),
      items: order.items.map(item => ({
        name: item.menuItem.name,
        quantity: item.qty,
        price: item.priceCents / 100 // Convert from cents to dollars
      })),
      subtotal: order.totalCents / 100, // Convert from cents to dollars
      tableLabel: order.table?.label
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, userId, tableId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Calculate total
    const totalCents = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity * 100); // Convert to cents
    }, 0);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        tableId: tableId || null,
        totalCents,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            menuItemId: item.menuItemId, // Assuming frontend sends menuItemId
            qty: item.quantity,
            priceCents: Math.round(item.price * 100) // Convert to cents
          }))
        }
      },
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
      }
    });

    // Transform the response
    const transformedOrder = {
      id: order.id,
      orderNumber: order.id.slice(-4),
      customerName: order.user?.name || 'Guest',
      customerId: order.userId,
      customerEmail: order.user?.email,
      date: order.createdAt.toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: order.createdAt.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      status: order.status,
      statusColor: getStatusColor(order.status),
      statusDot: getStatusDot(order.status),
      items: order.items.map(item => ({
        name: item.menuItem.name,
        quantity: item.qty,
        price: item.priceCents / 100
      })),
      subtotal: order.totalCents / 100,
      tableLabel: order.table?.label
    };

    res.status(201).json(transformedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { items, status, userId, tableId } = req.body;

    // Calculate new total if items are provided
    let totalCents;
    if (items && items.length > 0) {
      totalCents = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity * 100);
      }, 0);
    }

    const updateData = {
      ...(status && { status }),
      ...(userId && { userId }),
      ...(tableId && { tableId }),
      ...(totalCents !== undefined && { totalCents })
    };

    // If updating items, delete existing items and create new ones
    if (items && items.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        ...(items && items.length > 0 && {
          items: {
            create: items.map(item => ({
              menuItemId: item.menuItemId,
              qty: item.quantity,
              priceCents: Math.round(item.price * 100)
            }))
          }
        })
      },
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
      }
    });

    // Transform the response
    const transformedOrder = {
      id: order.id,
      orderNumber: order.id.slice(-4),
      customerName: order.user?.name || 'Guest',
      customerId: order.userId,
      customerEmail: order.user?.email,
      date: order.createdAt.toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: order.createdAt.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      status: order.status,
      statusColor: getStatusColor(order.status),
      statusDot: getStatusDot(order.status),
      items: order.items.map(item => ({
        name: item.menuItem.name,
        quantity: item.qty,
        price: item.priceCents / 100
      })),
      subtotal: order.totalCents / 100,
      tableLabel: order.table?.label
    };

    res.json(transformedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete order items first (due to foreign key constraint)
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });

    // Delete the order
    await prisma.order.delete({
      where: { id }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Get menu items for order creation
router.get('/menu-items', async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      },
      where: {
        available: true
      }
    });

    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Helper functions
function getStatusColor(status) {
  switch (status) {
    case 'PENDING':
      return '#FF9800'; // Orange for pending
    case 'IN_PROGRESS':
      return '#FAC1D9'; // Pink for in progress
    case 'SERVED':
      return '#4CAF50'; // Green for ready
    case 'PAID':
      return '#2196F3'; // Blue for completed
    case 'CANCELLED':
      return '#F44336'; // Red for cancelled
    default:
      return '#FAC1D9';
  }
}

function getStatusDot(status) {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'IN_PROGRESS':
      return 'Cooking Now';
    case 'SERVED':
      return 'Ready to serve';
    case 'PAID':
      return 'Paid';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

module.exports = router;