import { db } from '@/db';
import { destinations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getFlights } from './actions';
import { Plane } from 'lucide-react';
import { FlightSearchForm } from './flight-search-form';
import { FlightResults } from './flight-results';
import { Suspense } from 'react';
import { FlightSkeleton } from './flight-skeleton';

export default async function FlightBookingPage(props: {
  params: Promise<{ id: string; destinationId: string }>;
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const destination = await db.query.destinations.findFirst({
    where: eq(destinations.id, params.destinationId),
  });

  if (!destination) {
    notFound();
  }

  const flights = await getFlights(
    searchParams.from,
    searchParams.to || destination.location,
    searchParams.date || destination.arrivalDate
  );

  console.log(flights);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <Plane className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Book Flight</h1>
          <p className="text-muted-foreground">
            Find flights to {destination.name}
          </p>
        </div>
      </div>

      <FlightSearchForm
        defaultTo={destination.location}
        defaultDate={destination.arrivalDate}
      />

      <Suspense fallback={<FlightSkeleton />}>
        <FlightResults
          flights={flights}
          itineraryId={params.id}
          destinationId={params.destinationId}
        />
      </Suspense>
    </div>
  );
}
