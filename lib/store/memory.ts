import { VectorStore, VectorDocument, SearchResult } from './types';

export class MemoryVectorStore implements VectorStore {
  private documents: Map<string, VectorDocument> = new Map();

  async addDocument(document: VectorDocument): Promise<void> {
    this.documents.set(document.id, document);
  }

  async addDocuments(documents: VectorDocument[]): Promise<void> {
    documents.forEach(doc => this.documents.set(doc.id, doc));
  }

  async similaritySearch(query: string, k: number): Promise<SearchResult[]> {
    // For memory store without embeddings, do simple text search
    const results: SearchResult[] = [];
    
    for (const doc of this.documents.values()) {
      const score = this.textSimilarity(query, doc.content);
      if (score > 0) {
        results.push({
          document: doc,
          score,
        });
      }
    }
    
    // Sort by score and return top k
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  async similaritySearchByVector(vector: number[], k: number): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    for (const doc of this.documents.values()) {
      const score = this.cosineSimilarity(vector, doc.embedding);
      results.push({
        document: doc,
        score,
      });
    }
    
    // Sort by score and return top k
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
  }

  async getDocument(id: string): Promise<VectorDocument | null> {
    return this.documents.get(id) || null;
  }

  async listDocuments(limit: number = 100, offset: number = 0): Promise<VectorDocument[]> {
    const docs = Array.from(this.documents.values());
    return docs.slice(offset, offset + limit);
  }

  async health(): Promise<boolean> {
    return true;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private textSimilarity(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const contentWords = content.toLowerCase().split(/\s+/);
    
    let matches = 0;
    queryWords.forEach(word => {
      if (contentWords.includes(word)) {
        matches++;
      }
    });
    
    return matches / queryWords.length;
  }
}
