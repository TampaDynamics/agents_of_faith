import { getVectorStore, VectorStore, SearchResult } from './store';
import { getEmbeddingProvider, EmbeddingProvider } from './embeddings';

export interface RetrievalResult {
  document: any;
  score: number;
  retrievalMethod: 'vector' | 'keyword' | 'hybrid';
}

export class HybridRetriever {
  private vectorStore: VectorStore;
  private embeddings: EmbeddingProvider;

  constructor() {
    this.vectorStore = getVectorStore();
    this.embeddings = getEmbeddingProvider();
  }

  async retrieve(query: string, k: number = 5): Promise<RetrievalResult[]> {
    // Get vector search results
    const vectorResults = await this.vectorStore.similaritySearch(query, k);
    
    // Get keyword search results (simple implementation)
    const keywordResults = await this.keywordSearch(query, k);
    
    // Combine and deduplicate results
    const combined = this.combineResults(vectorResults, keywordResults, k);
    
    return combined;
  }

  private async keywordSearch(query: string, k: number): Promise<SearchResult[]> {
    // Simple keyword matching - in production this could use a proper search engine
    const allDocs = await this.vectorStore.listDocuments(1000);
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    const scoredDocs = allDocs
      .map(doc => {
        const contentLower = doc.content.toLowerCase();
        const metadataLower = JSON.stringify(doc.metadata).toLowerCase();
        
        let score = 0;
        keywords.forEach(keyword => {
          if (contentLower.includes(keyword)) score += 2;
          if (metadataLower.includes(keyword)) score += 1;
        });
        
        return { document: doc, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    return scoredDocs;
  }

  private combineResults(
    vectorResults: SearchResult[],
    keywordResults: SearchResult[],
    k: number
  ): RetrievalResult[] {
    const combined = new Map<string, RetrievalResult>();
    
    // Add vector results
    vectorResults.forEach((result) => {
      combined.set(result.document.id, {
        document: result.document,
        score: result.score,
        retrievalMethod: 'vector' as const,
      });
    });
    
    // Add keyword results, potentially boosting scores
    keywordResults.forEach((result) => {
      const existing = combined.get(result.document.id);
      if (existing) {
        // Boost score for hybrid results
        existing.score = Math.max(existing.score, result.score * 0.8);
        existing.retrievalMethod = 'hybrid';
      } else {
        combined.set(result.document.id, {
          document: result.document,
          score: result.score * 0.6, // Slight penalty for keyword-only
          retrievalMethod: 'keyword' as const,
        });
      }
    });
    
    // Sort by score and return top k
    return Array.from(combined.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  async retrieveByVector(vector: number[], k: number = 5): Promise<RetrievalResult[]> {
    const results = await this.vectorStore.similaritySearchByVector(vector, k);
    
    return results.map(result => ({
      document: result.document,
      score: result.score,
      retrievalMethod: 'vector' as const,
    }));
  }
}
