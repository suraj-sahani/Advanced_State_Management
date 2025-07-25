'use server';

import { db } from '@/db';
import { flightBookings } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export type Flight = {
  id: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  class: string;
};

// Simulated flight data - in a real app, this would come from an API
const AIRLINES = ['Delta', 'United', 'American', 'Southwest', 'JetBlue'];
const FLIGHT_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First'];
const FLIGHT_TIMES = [
  '06:00',
  '07:30',
  '09:00',
  '10:30',
  '12:00',
  '13:30',
  '15:00',
  '16:30',
  '18:00',
  '19:30',
  '21:00',
  '22:30',
];

function generateFlightNumber() {
  return `${Math.floor(Math.random() * 9999)}`;
}

function calculateDuration(from: string, to: string) {
  // Simulate different flight durations based on distance
  const durations = {
    'New York': { 'Los Angeles': '6h 30m', London: '7h 15m', Tokyo: '14h 30m' },
    'Los Angeles': {
      'New York': '6h 30m',
      London: '10h 45m',
      Tokyo: '11h 30m',
    },
    London: {
      'New York': '7h 15m',
      'Los Angeles': '10h 45m',
      Tokyo: '12h 15m',
    },
    Tokyo: {
      'New York': '14h 30m',
      'Los Angeles': '11h 30m',
      London: '12h 15m',
    },
  };
  return (
    durations[from as keyof typeof durations]?.[to as keyof typeof durations] ||
    '5h 00m'
  );
}

function calculatePrice(from: string, to: string, classType: string) {
  // Base prices for different routes
  const basePrices = {
    'New York': { 'Los Angeles': 400, London: 600, Tokyo: 1200 },
    'Los Angeles': { 'New York': 400, London: 800, Tokyo: 900 },
    London: { 'New York': 600, 'Los Angeles': 800, Tokyo: 1000 },
    Tokyo: { 'New York': 1200, 'Los Angeles': 900, London: 1000 },
  } as const;

  const basePrice =
    basePrices[from as keyof typeof basePrices]?.[
      to as keyof (typeof basePrices)[typeof from]
    ] || 500;

  // Class multipliers
  const classMultipliers = {
    Economy: 1,
    'Premium Economy': 1.5,
    Business: 2.5,
    First: 4,
  };

  return Math.round(
    basePrice * classMultipliers[classType as keyof typeof classMultipliers]
  );
}

export async function getFlights(from?: string, to?: string, date?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!from || !to || !date) {
    return [];
  }

  const flights = [];
  const numFlights = Math.floor(Math.random() * 3) + 3; // 3-5 flights

  for (let i = 0; i < numFlights; i++) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const classType =
      FLIGHT_CLASSES[Math.floor(Math.random() * FLIGHT_CLASSES.length)];
    const departureTime =
      FLIGHT_TIMES[Math.floor(Math.random() * FLIGHT_TIMES.length)];

    // Calculate arrival time based on duration
    const duration = calculateDuration(from, to);
    const [hours, minutes] = duration.split('h ').map((num) => parseInt(num));
    const departureDate = new Date(`${date}T${departureTime}`);
    const arrivalDate = new Date(
      departureDate.getTime() + (hours * 60 + minutes) * 60000
    );
    const arrivalTime = arrivalDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    flights.push({
      id: `${airline}-${generateFlightNumber()}`,
      airline,
      class: classType,
      departureTime,
      arrivalTime,
      duration,
      price: calculatePrice(from, to, classType),
    });
  }

  // Sort by price
  return flights.sort((a, b) => a.price - b.price);
}

export async function selectFlight(
  itineraryId: string,
  destinationId: string,
  flightId: string
) {
  const [airline, flightNumber] = flightId.split('-');

  await db.insert(flightBookings).values({
    id: crypto.randomUUID(),
    destinationId,
    airline,
    price: 0, // This would be fetched from the flight data in a real app
    departureTime: new Date().toISOString(), // This would be fetched from the flight data
    arrivalTime: new Date().toISOString(), // This would be fetched from the flight data
  });

  revalidatePath(`/itineraries/${itineraryId}`);
}
