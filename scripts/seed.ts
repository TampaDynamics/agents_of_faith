import { readFileSync } from 'fs';
import { join } from 'path';
import { getVectorStore } from '../lib/store';
import { getEmbeddingProvider } from '../lib/embeddings';
import { VectorDocument } from '../lib/store/types';

interface SeedData {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

async function seedData() {
  console.log('Starting data seeding process...');
  
  try {
    const vectorStore = getVectorStore();
    const embeddings = getEmbeddingProvider();
    
    // Check vector store health
    const isHealthy = await vectorStore.health();
    if (!isHealthy) {
      throw new Error('Vector store is not healthy');
    }
    
    console.log('Vector store is healthy, proceeding with seeding...');
    
    // Seed verses
    await seedFile('verses.jsonl', 'data/seed', vectorStore, embeddings);
    
    // Seed words
    await seedFile('words.jsonl', 'data/seed', vectorStore, embeddings);
    
    // Seed misinterpretations
    await seedFile('misinterp.jsonl', 'data/seed', vectorStore, embeddings);
    
    console.log('Data seeding completed successfully!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

async function seedFile(
  filename: string, 
  directory: string, 
  vectorStore: any, 
  embeddings: any
) {
  console.log(`Seeding ${filename}...`);
  
  const filePath = join(process.cwd(), directory, filename);
  const fileContent = readFileSync(filePath, 'utf-8');
  
  const lines = fileContent.trim().split('\n');
  const documents: SeedData[] = lines.map(line => JSON.parse(line));
  
  console.log(`Found ${documents.length} documents in ${filename}`);
  
  // Generate embeddings and create vector documents
  const vectorDocuments: VectorDocument[] = [];
  
  for (const doc of documents) {
    try {
      const embedding = await embeddings.embed(doc.content);
      
      const vectorDoc: VectorDocument = {
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata,
        embedding,
      };
      
      vectorDocuments.push(vectorDoc);
      
      if (vectorDocuments.length % 10 === 0) {
        console.log(`Processed ${vectorDocuments.length}/${documents.length} documents...`);
      }
      
    } catch (error) {
      console.error(`Error processing document ${doc.id}:`, error);
    }
  }
  
  // Add documents to vector store
  if (vectorDocuments.length > 0) {
    await vectorStore.addDocuments(vectorDocuments);
    console.log(`Successfully added ${vectorDocuments.length} documents from ${filename}`);
  }
}

// Run the seeding process
if (require.main === module) {
  seedData();
}
