'use client';
import { HotelSearch, HotelOption } from './solution/page';

export async function fetchHotels(
  searchParams: HotelSearch
): Promise<HotelOption[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: '1',
      name: 'Grand Hotel',
      price: 199,
      rating: 4.5,
      amenities: ['Pool', 'Spa', 'Restaurant'],
    },
    {
      id: '2',
      name: 'Seaside Resort',
      price: 249,
      rating: 4.8,
      amenities: ['Beach Access', 'Pool', 'Bar'],
    },
    {
      id: '3',
      name: 'City Center Hotel',
      price: 179,
      rating: 4.2,
      amenities: ['Gym', 'Restaurant', 'Business Center'],
    },
  ];
}
