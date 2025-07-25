'use server';

import { db } from '@/db';
import { destinations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function confirmBooking(
  destinationId: string,
  itineraryId: string
) {
  await db
    .update(destinations)
    .set({ status: 'pending' })
    .where(eq(destinations.id, destinationId));

  revalidatePath(`/itineraries/${itineraryId}`);
  redirect(`/itineraries/${itineraryId}`);
}
