import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import { HybridRetriever } from '@/lib/retriever';
import { getLLMProvider } from '@/lib/llm';
import { postProcessResponse } from '@/lib/postProcess';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Initialize components
    const retriever = new HybridRetriever();
    const llm = getLLMProvider();

    // Retrieve relevant documents
    const searchResults = await retriever.retrieve(message, 5);
    
    // Build context from retrieved documents
    const context = searchResults
      .map(result => result.document.content)
      .join('\n\n');

    // Build conversation history
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...history.slice(-6), // Keep last 6 messages for context
      { role: 'user' as const, content: message }
    ];

    // Add context to the system message
    if (context) {
      messages[0].content += `\n\nRelevant Context:\n${context}`;
    }

    // Get LLM response
    const response = await llm.chat(messages);
    
    // Post-process the response
    const processed = postProcessResponse(response.content);

    return NextResponse.json({
      response: response.content,
      processed,
      context: searchResults.map(result => ({
        id: result.document.id,
        content: result.document.content.substring(0, 200) + '...',
        score: result.score,
        retrievalMethod: result.retrievalMethod,
      })),
      usage: response.usage,
    });

  } catch (error) {
    console.error('Error in ask endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your question',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
