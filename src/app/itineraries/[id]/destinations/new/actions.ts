'use server';

import { db } from '@/db';
import { destinations } from '@/db/schema';
import { generateId } from '@/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDestination(formData: FormData) {
  const name = formData.get('name') as string;
  const location = formData.get('location') as string;
  const arrivalDate = formData.get('arrivalDate') as string;
  const departureDate = formData.get('departureDate') as string;
  const itineraryId = formData.get('itineraryId') as string;

  if (!name || !location || !arrivalDate || !departureDate || !itineraryId) {
    throw new Error('Missing required fields');
  }

  const id = generateId();

  await db.insert(destinations).values({
    id,
    itineraryId,
    name,
    location,
    arrivalDate,
    departureDate,
  });

  revalidatePath('/itineraries');
  redirect(`/itineraries/${itineraryId}/destinations/${id}/flight`);
}
