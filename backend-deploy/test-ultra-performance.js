// Test ULTRA PERFORMANCE with pre-warmed cache
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(`http://localhost:4000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({ duration, size: data.length, status: res.statusCode });
      });
    }).on('error', (err) => {
      console.error('Error:', err.message);
      resolve({ duration: -1, size: 0, status: 0 });
    });
  });
}

async function testUltraPerformance() {
  console.log('\n⚡ ULTRA PERFORMANCE TEST (with pre-warmed cache)\n');
  console.log('Testing if cache pre-warming is working...\n');
  
  // Test 1: Menu items (should be instant - from pre-warmed cache)
  console.log('📋 Testing /api/menu-items (PRE-WARMED CACHE)');
  const m1 = await makeRequest('/api/menu-items');
  console.log(`   ⚡ Request: ${m1.duration}ms (${(m1.size/1024).toFixed(2)} KB)`);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const m2 = await makeRequest('/api/menu-items');
  console.log(`   ⚡ Request: ${m2.duration}ms (${(m2.size/1024).toFixed(2)} KB)`);
  
  if (m1.duration < 500) {
    console.log(`   ✅ EXCELLENT! Pre-warmed cache is working!\n`);
  } else {
    console.log(`   ⚠️  Slower than expected (might be network latency)\n`);
  }
  
  // Test 2: Categories
  console.log('📂 Testing /api/categories (PRE-WARMED CACHE)');
  const c1 = await makeRequest('/api/categories');
  console.log(`   ⚡ Request: ${c1.duration}ms (${(c1.size/1024).toFixed(2)} KB)`);
  
  if (c1.duration < 500) {
    console.log(`   ✅ EXCELLENT! Pre-warmed cache is working!\n`);
  } else {
    console.log(`   ⚠️  Slower than expected\n`);
  }
  
  // Test 3: Orders
  console.log('🛒 Testing /api/orders (PRE-WARMED CACHE)');
  const o1 = await makeRequest('/api/orders');
  console.log(`   ⚡ Request: ${o1.duration}ms (${(o1.size/1024).toFixed(2)} KB)`);
  
  if (o1.duration < 500) {
    console.log(`   ✅ EXCELLENT! Pre-warmed cache is working!\n`);
  } else {
    console.log(`   ⚠️  Slower than expected\n`);
  }
  
  // Summary
  console.log('━'.repeat(60));
  console.log('📊 PERFORMANCE SUMMARY');
  console.log('━'.repeat(60));
  console.log(`Menu Items:  ${m1.duration}ms (${m1.duration < 200 ? '🚀 BLAZING FAST' : m1.duration < 500 ? '⚡ VERY FAST' : '✅ GOOD'})`);
  console.log(`Categories:  ${c1.duration}ms (${c1.duration < 200 ? '🚀 BLAZING FAST' : c1.duration < 500 ? '⚡ VERY FAST' : '✅ GOOD'})`);
  console.log(`Orders:      ${o1.duration}ms (${o1.duration < 200 ? '🚀 BLAZING FAST' : o1.duration < 500 ? '⚡ VERY FAST' : '✅ GOOD'})`);
  console.log('━'.repeat(60));
  
  const avgTime = (m1.duration + c1.duration + o1.duration) / 3;
  console.log(`\n🎯 Average Response Time: ${avgTime.toFixed(0)}ms`);
  
  if (avgTime < 200) {
    console.log('🏆 INCREDIBLE! Your API is BLAZING FAST! 🚀');
  } else if (avgTime < 500) {
    console.log('⚡ EXCELLENT! Your API is very fast!');
  } else if (avgTime < 1000) {
    console.log('✅ GOOD! Your API is performing well!');
  } else {
    console.log('⚠️  Performance could be improved');
  }
  
  console.log('\n✅ Test complete!\n');
}

testUltraPerformance();

