/**
 * Add database indexes for faster query performance
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addIndexes() {
  console.log('📊 Adding database indexes for performance...\n');
  
  try {
    // These indexes will dramatically improve query performance
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_menu_items_category ON "MenuItem"("categoryId")`;
    console.log('✅ Added index: MenuItem.categoryId');
    
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_menu_items_available ON "MenuItem"("available")`;
    console.log('✅ Added index: MenuItem.available');
    
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_orders_status ON "Order"("status")`;
    console.log('✅ Added index: Order.status');
    
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_orders_created ON "Order"("createdAt")`;
    console.log('✅ Added index: Order.createdAt');
    
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_order_items_order ON "OrderItem"("orderId")`;
    console.log('✅ Added index: OrderItem.orderId');
    
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_order_items_menu ON "OrderItem"("menuItemId")`;
    console.log('✅ Added index: OrderItem.menuItemId');
    
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_reservations_date ON "Reservation"("reservationDate")`;
    console.log('✅ Added index: Reservation.reservationDate');
    
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_reservations_status ON "Reservation"("status")`;
    console.log('✅ Added index: Reservation.status');
    
    console.log('\n✅ All indexes added successfully!');
    console.log('🚀 Database queries will now be MUCH faster!');
    
  } catch (error) {
    console.error('❌ Error adding indexes:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addIndexes();

