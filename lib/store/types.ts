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
  addDocument(_document: VectorDocument): Promise<void>;
  addDocuments(_documents: VectorDocument[]): Promise<void>;
  
  // Search operations
  similaritySearch(_query: string, _k: number): Promise<SearchResult[]>;
  similaritySearchByVector(_vector: number[], _k: number): Promise<SearchResult[]>;
  
  // Utility operations
  deleteDocument(_id: string): Promise<void>;
  getDocument(_id: string): Promise<VectorDocument | null>;
  listDocuments(_limit?: number, _offset?: number): Promise<VectorDocument[]>;
  
  // Health check
  health(): Promise<boolean>;
}
