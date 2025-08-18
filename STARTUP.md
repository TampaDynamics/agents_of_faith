# 🚀 Quick Start Guide

## Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
VECTOR_STORE=memory
ADMIN_SECRET=any-random-string-here
```

### 3. Test Your Setup
```bash
npm run test-setup
```

This will verify all files are present and accessible.

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 What You'll See

- **Landing Page**: Beautiful introduction to the app ✅
- **Chat Interface**: Ask theological questions at `/ask` ✅
- **Vector Search**: Memory-based retrieval system working ✅
- **AI Responses**: Ready to work once you add OpenAI API key

## 🔧 Troubleshooting

### If you get LanceDB errors:
- The app defaults to `memory` mode which requires no external dependencies
- Check that `VECTOR_STORE=memory` is set in your `.env.local`

### If you get OpenAI errors:
- Verify your API key is correct
- Check that you have credits in your OpenAI account
- Ensure the base URL is correct (default: `https://api.openai.com/v1`)
- If you get parameter errors, check that your model supports the parameters being used
- The app automatically handles compatibility between different GPT model versions

### If the app won't start:
- Run `npm run test-setup` to check for missing files
- Ensure all dependencies are installed with `npm install`
- Check the console for specific error messages

## 🚀 Next Steps

Once you're running:

1. **✅ Explore the app**: Navigate between landing page and chat interface
2. **✅ Test the system**: Run `npm run test-memory` to verify vector store
3. **🔑 Add OpenAI API key**: Copy `env.example` to `.env.local` and add your key
4. **🧪 Test the API**: Run `npm run test-api` to verify AI responses work
5. **🤖 Start asking questions**: Once API key is added, you can ask theological questions
6. **📚 Customize**: Modify the system prompt in `lib/systemPrompt.ts`

## 💡 Pro Tips

- **Memory Mode**: Perfect for development - no database setup required
- **LanceDB Mode**: For persistent storage, change `VECTOR_STORE=local`
- **Production**: Use `VECTOR_STORE=opensearch` when ready to scale

Happy theologizing! 🎉
