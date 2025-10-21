// Quick test to verify caching is working
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(`http://localhost:4000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({ duration, size: data.length });
      });
    }).on('error', (err) => {
      console.error('Error:', err.message);
      resolve({ duration: -1, size: 0 });
    });
  });
}

async function test() {
  console.log('\n🧪 Testing cache performance...\n');
  
  // Test 1: /api/menu-items
  console.log('📋 Testing /api/menu-items');
  const r1 = await makeRequest('/api/menu-items');
  console.log(`   Request 1 (cache MISS): ${r1.duration}ms (${r1.size} bytes)`);
  
  const r2 = await makeRequest('/api/menu-items');
  console.log(`   Request 2 (cache HIT):  ${r2.duration}ms (${r2.size} bytes)`);
  console.log(`   💡 Speedup: ${(r1.duration / r2.duration).toFixed(1)}x faster!\n`);
  
  // Test 2: /api/categories
  console.log('📂 Testing /api/categories');
  const c1 = await makeRequest('/api/categories');
  console.log(`   Request 1 (cache MISS): ${c1.duration}ms (${c1.size} bytes)`);
  
  const c2 = await makeRequest('/api/categories');
  console.log(`   Request 2 (cache HIT):  ${c2.duration}ms (${c2.size} bytes)`);
  console.log(`   💡 Speedup: ${(c1.duration / c2.duration).toFixed(1)}x faster!\n`);
  
  // Test 3: /api/orders
  console.log('🛒 Testing /api/orders');
  const o1 = await makeRequest('/api/orders');
  console.log(`   Request 1 (cache MISS): ${o1.duration}ms (${o1.size} bytes)`);
  
  const o2 = await makeRequest('/api/orders');
  console.log(`   Request 2 (cache HIT):  ${o2.duration}ms (${o2.size} bytes)`);
  console.log(`   💡 Speedup: ${(o1.duration / o2.duration).toFixed(1)}x faster!\n`);
  
  console.log('✅ Test complete!');
}

test();

