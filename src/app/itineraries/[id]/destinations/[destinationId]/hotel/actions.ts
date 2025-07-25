'use server';

import { db } from '@/db';
import { hotelBookings } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function selectHotel(
  itineraryId: string,
  destinationId: string,
  hotelData: {
    name: string;
    price: number;
    checkIn: string;
    checkOut: string;
  }
) {
  await db.insert(hotelBookings).values({
    id: crypto.randomUUID(),
    destinationId,
    name: hotelData.name,
    price: hotelData.price,
    checkIn: hotelData.checkIn,
    checkOut: hotelData.checkOut,
  });

  revalidatePath(
    `/itineraries/${itineraryId}/destinations/${destinationId}/hotel`
  );
  redirect(`/itineraries/${itineraryId}/destinations/${destinationId}/review`);
}
