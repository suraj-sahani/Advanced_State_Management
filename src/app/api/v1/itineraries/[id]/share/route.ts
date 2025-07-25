import { NextResponse } from 'next/server';
import { db } from '@/db';
import { itineraries } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/v1/itineraries/[id]/share
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify itinerary exists
    const itinerary = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.id, id))
      .limit(1);

    if (!itinerary.length) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    // TODO: Implement actual sharing logic (e.g., sending email, generating share link)
    // For now, we'll just return a success message
    return NextResponse.json(
      {
        message: 'Itinerary shared successfully',
        shareLink: `/itineraries/${id}/shared`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sharing itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to share itinerary' },
      { status: 500 }
    );
  }
}
