'use client';
import { FlightSearch, FlightOption } from './solution/page';

// Add these API functions before the components
export async function fetchFlights(
  searchParams: FlightSearch
): Promise<FlightOption[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { id: '1', airline: 'Sky Airways', price: 299, duration: '2h 30m' },
    { id: '2', airline: 'Ocean Air', price: 349, duration: '2h 45m' },
    { id: '3', airline: 'Mountain Express', price: 279, duration: '3h 15m' },
  ];
}
