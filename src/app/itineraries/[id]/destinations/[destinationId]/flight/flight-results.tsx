'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plane, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface Flight {
  id: string;
  airline: string;
  class: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

interface FlightResultsProps {
  flights: Flight[];
  itineraryId: string;
  destinationId: string;
}

export function FlightResults({
  flights,
  itineraryId,
  destinationId,
}: FlightResultsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleFlightSelection(formData: FormData) {
    const flightId = formData.get('flightId') as string;
    startTransition(async () => {
      const response = await fetch(
        `/api/itineraries/${itineraryId}/destinations/${destinationId}/flight`,
        {
          method: 'POST',
          body: JSON.stringify({ flightId }),
        }
      );

      if (response.ok) {
        router.push(
          `/itineraries/${itineraryId}/destinations/${destinationId}/hotel`
        );
      }
    });
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No flights found. Try different search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
      {flights.map((flight) => (
        <Card key={flight.id} className="hover:shadow-md transition-shadow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Plane className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{flight.airline}</h3>
                    <Badge variant="secondary">{flight.class}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      {flight.departureTime}
                    </p>
                    <p className="text-sm text-muted-foreground">Departure</p>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{flight.duration}</span>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      {flight.arrivalTime}
                    </p>
                    <p className="text-sm text-muted-foreground">Arrival</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    ${flight.price}
                  </span>
                </div>
                <form action={handleFlightSelection}>
                  <input type="hidden" name="flightId" value={flight.id} />
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Selecting...
                      </>
                    ) : (
                      'Select Flight'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
