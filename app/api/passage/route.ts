import { NextRequest, NextResponse } from 'next/server';
import { getVectorStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const book = searchParams.get('book');
    const chapter = searchParams.get('chapter');
    const verse = searchParams.get('verse');

    if (!book || !chapter) {
      return NextResponse.json(
        { error: 'Book and chapter are required' },
        { status: 400 }
      );
    }

    const vectorStore = getVectorStore();
    
    // Search for passages matching the criteria
    const query = `${book} ${chapter}${verse ? `:${verse}` : ''}`;
    const results = await vectorStore.similaritySearch(query, 10);
    
    // Filter results to match the specific passage
    const matchingPassages = results
      .filter(result => {
        const metadata = result.document.metadata;
        return (
          metadata.book?.toLowerCase() === book.toLowerCase() &&
          metadata.chapter === parseInt(chapter) &&
          (!verse || metadata.verse === parseInt(verse))
        );
      })
      .map(result => ({
        id: result.document.id,
        content: result.document.content,
        metadata: result.document.metadata,
        score: result.score,
      }));

    if (matchingPassages.length === 0) {
      return NextResponse.json(
        { error: 'Passage not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      passages: matchingPassages,
      count: matchingPassages.length,
    });

  } catch (error) {
    console.error('Error in passage endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred while retrieving the passage',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
