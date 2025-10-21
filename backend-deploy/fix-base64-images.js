/**
 * Convert all base64-encoded images in the database to actual files
 * This will dramatically improve API performance
 */

const { prisma } = require('./src/lib/prisma');
const fs = require('fs');
const path = require('path');

async function fixImages() {
  console.log('🔍 Finding menu items with base64 images...\n');
  
  const menuItems = await prisma.menuItem.findMany();
  let fixed = 0;
  let skipped = 0;
  
  for (const item of menuItems) {
    if (!item.image || !item.image.startsWith('data:image')) {
      skipped++;
      continue;
    }
    
    try {
      // Extract base64 data
      const matches = item.image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        console.log(`⚠️  Skipping ${item.name} - invalid base64 format`);
        continue;
      }
      
      const [, ext, base64Data] = matches;
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate filename
      const filename = `menu-item-${Date.now()}-${Math.floor(Math.random() * 1000000000)}.${ext}`;
      const filepath = path.join(__dirname, 'uploads', 'menu-items', filename);
      
      // Ensure directory exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write file
      fs.writeFileSync(filepath, buffer);
      
      // Update database
      const urlPath = `/uploads/menu-items/${filename}`;
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { image: urlPath }
      });
      
      console.log(`✅ ${item.name}: ${(buffer.length / 1024).toFixed(0)}KB → ${urlPath}`);
      fixed++;
      
    } catch (error) {
      console.error(`❌ Error processing ${item.name}:`, error.message);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Fixed: ${fixed} items`);
  console.log(`   Skipped: ${skipped} items (already using URLs)`);
  console.log(`\n✅ Done! Restart the backend to see the improvements.`);
  
  await prisma.$disconnect();
}

fixImages().catch(console.error);

