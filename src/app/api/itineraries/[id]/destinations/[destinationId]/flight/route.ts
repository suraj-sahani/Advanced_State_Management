import { db } from '@/db';
import { flightBookings } from '@/db/schema';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: Request,
  { params }: { params: { id: string; destinationId: string } }
) {
  try {
    const { flightId } = await request.json();
    const [airline, flightNumber] = flightId.split('-');

    await db.insert(flightBookings).values({
      id: crypto.randomUUID(),
      destinationId: params.destinationId,
      airline,
      price: 0, // This would be fetched from the flight data in a real app
      departureTime: new Date().toISOString(), // This would be fetched from the flight data
      arrivalTime: new Date().toISOString(), // This would be fetched from the flight data
    });

    revalidatePath(`/itineraries/${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error selecting flight:', error);
    return NextResponse.json(
      { error: 'Failed to select flight' },
      { status: 500 }
    );
  }
}
