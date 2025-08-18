# Agents of Faith - Theological AI Assistant

A Next.js 15 application that provides comprehensive theological insights using AI-powered retrieval augmented generation (RAG). Built with TypeScript, featuring a hybrid vector + keyword search system and structured responses grounded in Scripture.

## Features

- **AI-Powered Theology**: Get comprehensive answers to theological questions using GPT-5
- **Hybrid Retrieval**: Combines vector similarity search with keyword matching for better results
- **Structured Responses**: All answers follow a consistent 6-section format with biblical citations
- **Strong's Integration**: Hover tooltips for Hebrew and Greek word definitions
- **Multiple Data Sources**: Includes Bible verses, Strong's definitions, and common misinterpretations
- **Local Development**: Uses LanceDB for local vector storage (no cloud dependencies)
- **Production Ready**: Skeleton for OpenSearch integration when scaling

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, CSS Modules
- **AI**: OpenAI GPT-5, OpenAI Embeddings
- **Vector Store**: LanceDB (local), OpenSearch (production stub)
- **Language**: TypeScript with strict mode
- **Styling**: CSS Modules with modern design
- **Linting**: ESLint + Prettier

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agents-of-faith
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your OpenAI API credentials:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
VECTOR_STORE=local
ADMIN_SECRET=your_admin_secret_here
```

4. Test your setup:
```bash
npm run test-setup
```

5. Seed the vector database (optional - only needed for LanceDB):
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run seed` - Seed the vector database with sample data (LanceDB only)
- `npm run test-setup` - Test if all files are present and accessible

## Project Structure

```
agents-of-faith/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── ask/               # Chat interface
│   ├── api/               # API routes
│   │   ├── ask/           # Main chat endpoint
│   │   ├── passage/       # Bible passage lookup
│   │   ├── word/          # Strong's word lookup
│   │   └── admin/         # Admin endpoints
│   └── layout.tsx         # Root layout
├── lib/                    # Core library functions
│   ├── systemPrompt.ts    # Theology system prompt
│   ├── retriever.ts       # Hybrid retrieval system
│   ├── embeddings.ts      # Embedding provider
│   ├── llm.ts            # LLM client
│   ├── postProcess.ts     # Response validation
│   └── store/             # Vector store implementations
├── data/                   # Seed data
│   └── seed/              # JSONL files
├── scripts/                # Utility scripts
│   └── seed.ts            # Database seeding
└── public/                 # Static assets
```

## API Endpoints

### POST /api/ask
Main chat endpoint for theological questions.

**Request:**
```json
{
  "message": "What does it mean to be created in God's image?",
  "history": []
}
```

**Response:**
```json
{
  "response": "Comprehensive theological answer...",
  "processed": { /* post-processed response data */ },
  "context": [ /* retrieved documents */ ],
  "usage": { /* token usage */ }
}
```

### GET /api/passage?book=Genesis&chapter=1&verse=26
Lookup specific Bible passages.

### GET /api/word?strongs=G2316
Lookup Strong's word definitions.

### POST /api/admin/reindex
Protected admin endpoint for reindexing (requires Bearer token).

## Data Schemas

### Verses (verses.jsonl)
```json
{
  "id": "gen_1_1",
  "content": "In the beginning God created the heavens and the earth.",
  "metadata": {
    "book": "Genesis",
    "chapter": 1,
    "verse": 1,
    "translation": "NIV",
    "category": "creation",
    "strongs": ["H430", "H1254"]
  }
}
```

### Words (words.jsonl)
```json
{
  "id": "G2316",
  "content": "θεός (theos) - God, deity, divine being...",
  "metadata": {
    "strongs": "G2316",
    "greek": "θεός",
    "transliteration": "theos",
    "definition": "God, deity, divine being",
    "usage": "divine nature, Godhead",
    "references": ["John 1:1", "Romans 1:20"]
  }
}
```

### Misinterpretations (misinterp.jsonl)
```json
{
  "id": "misinterp_1",
  "content": "The prosperity gospel teaches...",
  "metadata": {
    "category": "prosperity_gospel",
    "incorrect_verses": ["3 John 1:2"],
    "correct_verses": ["Matthew 6:33"],
    "strongs": ["G2132", "G5198"]
  }
}
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_BASE_URL` - OpenAI API base URL (for self-hosted gateways)
- `VECTOR_STORE` - Vector store type (`local` or `opensearch`)
- `ADMIN_SECRET` - Secret for admin endpoints

### Vector Store Options

**Memory (Default Development)**
- In-memory storage with no persistence
- No external dependencies
- Perfect for quick testing and development
- Data is lost on restart

**Local (Development)**
- Uses LanceDB with file-based storage
- Persistent storage between sessions
- Requires LanceDB installation

**OpenSearch (Production)**
- Scalable cloud-based vector search
- Requires AWS/cloud infrastructure
- Currently implemented as a stub

## Development

### Adding New Data Sources

1. Create new JSONL files in `data/seed/`
2. Update the seed script in `scripts/seed.ts`
3. Run `npm run seed` to populate the vector store

### Extending the System Prompt

Edit `lib/systemPrompt.ts` to modify the AI's theological framework and response format.

### Customizing Retrieval

Modify `lib/retriever.ts` to adjust the hybrid search algorithm or add new retrieval methods.

## Production Deployment

1. Set `VECTOR_STORE=opensearch` in production environment
2. Configure OpenSearch connection details
3. Implement the OpenSearch vector store in `lib/store/opensearch.ts`
4. Set appropriate `ADMIN_SECRET` for production
5. Deploy using your preferred hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the repository.

---

**Note**: This application is designed for educational and research purposes. Always consult with qualified theologians and biblical scholars for authoritative theological guidance.
