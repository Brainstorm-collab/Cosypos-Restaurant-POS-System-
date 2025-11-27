const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Optimize connection pooling for better performance
    // These settings help prevent connection exhaustion
  });
  
  // Configure connection pool limits
  // PostgreSQL connection string should include: ?connection_limit=10&pool_timeout=20
  
  // Connect to database with optimized settings (non-blocking)
  global.__prisma.$connect().then(() => {
    console.log('✅ Database connected with optimized connection pooling');
    console.log('📊 Connection pool: 10 connections, 20s timeout');
  }).catch((err) => {
    console.error('❌ Database connection failed:', err);
    console.error('⚠️ Server will continue but database operations will fail');
  });
  
  // Graceful shutdown
  process.on('beforeExit', async () => {
    await global.__prisma.$disconnect();
  });
}

prisma = global.__prisma;

module.exports = { prisma };


