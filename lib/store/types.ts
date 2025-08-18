export interface VectorDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding: number[];
}

export interface SearchResult {
  document: VectorDocument;
  score: number;
}

export interface VectorStore {
  // Core operations
  addDocument(document: VectorDocument): Promise<void>;
  addDocuments(documents: VectorDocument[]): Promise<void>;
  
  // Search operations
  similaritySearch(query: string, k: number): Promise<SearchResult[]>;
  similaritySearchByVector(vector: number[], k: number): Promise<SearchResult[]>;
  
  // Utility operations
  deleteDocument(id: string): Promise<void>;
  getDocument(id: string): Promise<VectorDocument | null>;
  listDocuments(limit?: number, offset?: number): Promise<VectorDocument[]>;
  
  // Health check
  health(): Promise<boolean>;
}
