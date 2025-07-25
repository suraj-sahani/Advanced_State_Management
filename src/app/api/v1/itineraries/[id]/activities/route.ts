import { NextResponse } from 'next/server';
import { db } from '@/db';
import { activities } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/db';

// GET /api/v1/itineraries/[id]/activities
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const allActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.itineraryId, id));

    return NextResponse.json({ activities: allActivities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/v1/itineraries/[id]/activities
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id;
    const body = await request.json();
    const { name, description, startTime, endTime, destinationId } = body;

    if (!name || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newActivity = await db
      .insert(activities)
      .values({
        id: generateId(),
        itineraryId: id,
        destinationId,
        name,
        description,
        startTime,
        endTime,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Activity added successfully',
        activity: newActivity[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding activity:', error);
    return NextResponse.json(
      { error: 'Failed to add activity' },
      { status: 500 }
    );
  }
}
