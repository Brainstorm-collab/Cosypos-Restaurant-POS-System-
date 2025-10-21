const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupUsers() {
  try {
    console.log('🔄 Starting user cleanup...');

    // Define the 3 core users to keep
    const coreEmails = [
      'admin@cosypos.app',
      'staff@cosypos.app',
      'user@cosypos.app'
    ];

    // Get all users
    const allUsers = await prisma.user.findMany();
    console.log(`📊 Total users in database: ${allUsers.length}`);

    // Find users to delete (not in core emails list)
    const usersToDelete = allUsers.filter(user => !coreEmails.includes(user.email));
    console.log(`🗑️  Users to delete: ${usersToDelete.length}`);

    if (usersToDelete.length === 0) {
      console.log('✅ No users to delete. Database is clean!');
      return;
    }

    // Show users that will be deleted
    console.log('\n📋 Users that will be deleted:');
    usersToDelete.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });

    // Delete related data first, then users
    for (const user of usersToDelete) {
      console.log(`\n🗑️  Deleting user: ${user.name} (${user.email})`);
      
      // Delete related records (in proper order due to foreign keys)
      await prisma.attendance.deleteMany({ where: { userId: user.id } });
      
      // Get user's orders first
      const userOrders = await prisma.order.findMany({ where: { userId: user.id } });
      
      // Delete order items for each order
      for (const order of userOrders) {
        await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
        await prisma.payment.deleteMany({ where: { orderId: order.id } });
      }
      
      // Now delete orders
      await prisma.order.deleteMany({ where: { userId: user.id } });
      
      // Delete reservations
      await prisma.reservation.deleteMany({ where: { customerId: user.id } });
      
      // Delete the user
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`  ✓ Deleted ${user.name}`);
    }

    console.log(`\n✅ Deleted ${usersToDelete.length} users successfully!`);

    // Show remaining users
    const remainingUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    console.log('\n📊 Remaining users:');
    remainingUsers.forEach(user => {
      console.log(`  ✓ ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\n🎉 User cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupUsers();

