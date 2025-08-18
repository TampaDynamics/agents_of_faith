import { VectorStore } from './types';
import { OpenSearchVectorStore } from './opensearch';
import { MemoryVectorStore } from './memory';

export function getVectorStore(): VectorStore {
  const storeType = process.env.VECTOR_STORE || 'memory';
  
  try {
    switch (storeType) {
      case 'local':
        console.warn('LanceDB not available, falling back to memory store');
        return new MemoryVectorStore();
      case 'opensearch':
        return new OpenSearchVectorStore();
      case 'memory':
        return new MemoryVectorStore();
      default:
        console.warn(`Unknown vector store type: ${storeType}, falling back to memory`);
        return new MemoryVectorStore();
    }
  } catch (error) {
    console.warn('Error initializing vector store, falling back to memory:', error);
    return new MemoryVectorStore();
  }
}

export * from './types';
export * from './opensearch';
export * from './memory';
