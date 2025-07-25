'use server';

import { db } from '@/db';
import { itineraries } from '@/db/schema';
import { generateId } from '@/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createItinerary(formData: FormData) {
  const name = formData.get('name') as string;
  const people = formData.get('people') as string;
  const description = formData.get('description') as string;

  if (!name || !people) {
    throw new Error('Missing required fields');
  }

  const id = generateId();

  await db.insert(itineraries).values({
    id,
    name,
    description,
    people: parseInt(people),
  });

  revalidatePath('/itineraries');
  redirect(`/itineraries/${id}`);
}
