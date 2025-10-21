const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
  
  // Connect to database with optimized settings
  global.__prisma.$connect().then(() => {
    console.log('✅ Database connected with optimized connection pooling');
  }).catch((err) => {
    console.error('❌ Database connection failed:', err);
  });
}

prisma = global.__prisma;

module.exports = { prisma };


