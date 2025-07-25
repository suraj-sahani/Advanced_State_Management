import { NextResponse } from 'next/server';
import { db } from '@/db';
import { itineraries } from '@/db/schema';
import { generateId } from '@/db';

// GET /api/v1/itineraries
export async function GET() {
  try {
    const allItineraries = await db.select().from(itineraries);
    return NextResponse.json({ itineraries: allItineraries });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

// POST /api/v1/itineraries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newItinerary = await db
      .insert(itineraries)
      .values({
        id: generateId(),
        title,
        description,
        startDate,
        endDate,
      })
      .returning();

    return NextResponse.json(
      { message: 'Itinerary created successfully', itinerary: newItinerary[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
}
