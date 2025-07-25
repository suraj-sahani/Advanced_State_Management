import { NextResponse } from 'next/server';
import { db } from '@/db';
import { itineraries } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/v1/itineraries/[id]
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
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

    return NextResponse.json({ itinerary: itinerary[0] });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/itineraries/[id]
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const body = await request.json();
    const { title, description, startDate, endDate } = body;

    const updatedItinerary = await db
      .update(itineraries)
      .set({
        title,
        description,
        startDate,
        endDate,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(itineraries.id, id))
      .returning();

    if (!updatedItinerary.length) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Itinerary updated successfully',
      itinerary: updatedItinerary[0],
    });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to update itinerary' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/itineraries/[id]
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const deletedItinerary = await db
      .delete(itineraries)
      .where(eq(itineraries.id, id))
      .returning();

    if (!deletedItinerary.length) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Itinerary deleted successfully',
      itinerary: deletedItinerary[0],
    });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to delete itinerary' },
      { status: 500 }
    );
  }
}
