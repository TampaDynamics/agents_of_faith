import { NextRequest, NextResponse } from 'next/server';
import { getVectorStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const strongs = searchParams.get('strongs');

    if (!strongs) {
      return NextResponse.json(
        { error: 'Strong\'s number is required' },
        { status: 400 }
      );
    }

    // Validate Strong's number format (G1234 or H1234)
    const strongsPattern = /^[GH]\d+$/;
    if (!strongsPattern.test(strongs)) {
      return NextResponse.json(
        { error: 'Invalid Strong\'s number format. Use G1234 (Greek) or H1234 (Hebrew)' },
        { status: 400 }
      );
    }

    const vectorStore = getVectorStore();
    
    // Search for the specific Strong's number
    const results = await vectorStore.similaritySearch(strongs, 5);
    
    // Filter results to match the exact Strong's number
    const matchingWords = results
      .filter(result => {
        const metadata = result.document.metadata;
        return metadata.strongs === strongs;
      })
      .map(result => ({
        id: result.document.id,
        content: result.document.content,
        metadata: result.document.metadata,
        score: result.score,
      }));

    if (matchingWords.length === 0) {
      return NextResponse.json(
        { error: 'Strong\'s number not found' },
        { status: 404 }
      );
    }

    // Get the best match (highest score)
    const bestMatch = matchingWords[0];
    
    return NextResponse.json({
      word: bestMatch,
      alternatives: matchingWords.slice(1),
      count: matchingWords.length,
    });

  } catch (error) {
    console.error('Error in word endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred while retrieving the word definition',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
