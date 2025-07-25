import { NextResponse } from 'next/server';
import { db } from '@/db';
import { destinations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/db';

// GET /api/v1/itineraries/[id]/destinations
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const allDestinations = await db
      .select()
      .from(destinations)
      .where(eq(destinations.itineraryId, id));

    return NextResponse.json({ destinations: allDestinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

// POST /api/v1/itineraries/[id]/destinations
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const body = await request.json();
    const { name, location, arrivalDate, departureDate } = body;

    if (!name || !location || !arrivalDate || !departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newDestination = await db
      .insert(destinations)
      .values({
        id: generateId(),
        itineraryId: id,
        name,
        location,
        arrivalDate,
        departureDate,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Destination added successfully',
        destination: newDestination[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding destination:', error);
    return NextResponse.json(
      { error: 'Failed to add destination' },
      { status: 500 }
    );
  }
}
