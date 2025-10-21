const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkAllData() {
  console.log('🔍 CHECKING POSTGRESQL DATABASE DATA\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    // Check Users
    console.log('👥 USERS:');
    const users = await prisma.user.findMany();
    console.log(`   Total Users: ${users.length}`);
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    console.log('');

    // Check Menu Categories
    console.log('📂 MENU CATEGORIES:');
    const categories = await prisma.menuCategory.findMany({
      include: {
        items: true
      }
    });
    console.log(`   Total Categories: ${categories.length}`);
    if (categories.length > 0) {
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.items.length} items) ${cat.image ? '🖼️' : '❌ No image'}`);
      });
    }
    console.log('');

    // Check Menu Items
    console.log('🍽️  MENU ITEMS:');
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      }
    });
    console.log(`   Total Menu Items: ${menuItems.length}`);
    if (menuItems.length > 0) {
      const sample = menuItems.slice(0, 5);
      sample.forEach(item => {
        console.log(`   - ${item.name} - $${(item.priceCents/100).toFixed(2)} (${item.category.name}) Stock: ${item.stock} ${item.available ? '✅' : '❌'}`);
      });
      if (menuItems.length > 5) {
        console.log(`   ... and ${menuItems.length - 5} more items`);
      }
    }
    console.log('');

    // Check Orders
    console.log('📦 ORDERS:');
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });
    console.log(`   Total Orders: ${orders.length}`);
    if (orders.length > 0) {
      const sample = orders.slice(0, 3);
      sample.forEach(order => {
        console.log(`   - Order ${order.id.slice(0, 8)}... - Status: ${order.status} - $${(order.totalCents/100).toFixed(2)} - ${order.items.length} items`);
      });
      if (orders.length > 3) {
        console.log(`   ... and ${orders.length - 3} more orders`);
      }
    }
    console.log('');

    // Check Reservations
    console.log('📅 RESERVATIONS:');
    const reservations = await prisma.reservation.findMany({
      include: {
        customer: true
      }
    });
    console.log(`   Total Reservations: ${reservations.length}`);
    if (reservations.length > 0) {
      const sample = reservations.slice(0, 3);
      sample.forEach(res => {
        console.log(`   - ${res.customer.name} - Table ${res.tableNumber} - ${new Date(res.reservationDate).toLocaleDateString()} ${res.startTime} - Status: ${res.status}`);
      });
      if (reservations.length > 3) {
        console.log(`   ... and ${reservations.length - 3} more reservations`);
      }
    }
    console.log('');

    // Check Inventory
    console.log('📊 INVENTORY:');
    const inventory = await prisma.inventoryItem.findMany();
    console.log(`   Total Inventory Items: ${inventory.length}`);
    if (inventory.length > 0) {
      const sample = inventory.slice(0, 5);
      sample.forEach(item => {
        console.log(`   - ${item.name} - ${item.quantity} ${item.unit} ${item.parLevel && item.quantity < item.parLevel ? '⚠️ LOW' : '✅'}`);
      });
      if (inventory.length > 5) {
        console.log(`   ... and ${inventory.length - 5} more items`);
      }
    }
    console.log('');

    // Check Tables
    console.log('🪑  TABLES:');
    const tables = await prisma.table.findMany();
    console.log(`   Total Tables: ${tables.length}`);
    if (tables.length > 0) {
      const sample = tables.slice(0, 5);
      sample.forEach(table => {
        console.log(`   - ${table.label} - Capacity: ${table.capacity} - Status: ${table.status}`);
      });
      if (tables.length > 5) {
        console.log(`   ... and ${tables.length - 5} more tables`);
      }
    }
    console.log('');

    // Check Attendance
    console.log('⏰ ATTENDANCE:');
    const attendance = await prisma.attendance.findMany({
      include: {
        user: true
      }
    });
    console.log(`   Total Attendance Records: ${attendance.length}`);
    if (attendance.length > 0) {
      const sample = attendance.slice(0, 3);
      sample.forEach(att => {
        console.log(`   - ${att.user.name} - ${new Date(att.date).toLocaleDateString()} - Status: ${att.status}`);
      });
      if (attendance.length > 3) {
        console.log(`   ... and ${attendance.length - 3} more records`);
      }
    }
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY:');
    console.log(`   ✅ Users: ${users.length}`);
    console.log(`   ✅ Categories: ${categories.length}`);
    console.log(`   ✅ Menu Items: ${menuItems.length}`);
    console.log(`   ✅ Orders: ${orders.length}`);
    console.log(`   ✅ Reservations: ${reservations.length}`);
    console.log(`   ✅ Inventory Items: ${inventory.length}`);
    console.log(`   ✅ Tables: ${tables.length}`);
    console.log(`   ✅ Attendance Records: ${attendance.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Database connection info
    console.log('🔌 DATABASE CONNECTION:');
    console.log(`   Provider: PostgreSQL`);
    console.log(`   URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllData();

