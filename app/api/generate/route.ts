import { NextRequest, NextResponse } from 'next/server';
import { getRAGAnswer } from '@/lib/ragEngine';

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  try {
    const answer = await getRAGAnswer(query);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Error in RAG handler:', err);
    return NextResponse.json({ error: `Failed to generate answer ${err}` }, { status: 500 });
  }
}