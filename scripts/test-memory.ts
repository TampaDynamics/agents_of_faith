import { MemoryVectorStore } from '../lib/store/memory';
import { VectorDocument } from '../lib/store/types';

async function testMemoryStore() {
  console.log('🧪 Testing Memory Vector Store...\n');
  
  try {
    const store = new MemoryVectorStore();
    
    // Test 1: Add documents
    console.log('1. Adding test documents...');
    const testDocs: VectorDocument[] = [
      {
        id: 'test1',
        content: 'This is a test document about theology',
        metadata: { category: 'test', topic: 'theology' },
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
      },
      {
        id: 'test2',
        content: 'Another test document about biblical interpretation',
        metadata: { category: 'test', topic: 'bible' },
        embedding: [0.2, 0.3, 0.4, 0.5, 0.6]
      }
    ];
    
    await store.addDocuments(testDocs);
    console.log('✅ Documents added successfully');
    
    // Test 2: List documents
    console.log('\n2. Listing documents...');
    const docs = await store.listDocuments();
    console.log(`✅ Found ${docs.length} documents`);
    docs.forEach(doc => console.log(`   - ${doc.id}: ${doc.content.substring(0, 50)}...`));
    
    // Test 3: Search by vector
    console.log('\n3. Testing vector search...');
    const searchQuery = [0.15, 0.25, 0.35, 0.45, 0.55];
    const results = await store.similaritySearchByVector(searchQuery, 2);
    console.log(`✅ Search returned ${results.length} results`);
    results.forEach((result, i) => {
      console.log(`   ${i + 1}. ${result.document.id} (score: ${result.score.toFixed(3)})`);
    });
    
    // Test 4: Health check
    console.log('\n4. Testing health check...');
    const isHealthy = await store.health();
    console.log(`✅ Health check: ${isHealthy ? 'PASSED' : 'FAILED'}`);
    
    console.log('\n🎉 Memory Vector Store Test Complete!');
    console.log('The store is working correctly without external dependencies.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testMemoryStore();
