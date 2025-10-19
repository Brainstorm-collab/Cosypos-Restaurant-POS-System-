const { PrismaClient } = require('@prisma/client');

// Singleton PrismaClient instance to avoid multiple DB connections
let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production, create a single instance
  prisma = new PrismaClient();
} else {
  // In development, use global to prevent multiple instances during hot reload
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

// Graceful shutdown handler to prevent connection leaks
const shutdown = async () => {
  if (prisma) {
    try {
      await prisma.$disconnect();
      console.log('Prisma client disconnected gracefully');
    } catch (error) {
      console.error('Error disconnecting Prisma client:', error);
    }
  }
  process.exit(0);
};

// Register shutdown handlers
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = prisma;
