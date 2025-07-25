import { NextResponse } from 'next/server';
import { db } from '@/db';
import { comments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/db';

// GET /api/v1/itineraries/[id]/comments
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const allComments = await db
      .select()
      .from(comments)
      .where(eq(comments.itineraryId, id));

    return NextResponse.json({ comments: allComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/v1/itineraries/[id]/comments
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const newComment = await db
      .insert(comments)
      .values({
        id: generateId(),
        itineraryId: id,
        content,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Comment added successfully',
        comment: newComment[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
