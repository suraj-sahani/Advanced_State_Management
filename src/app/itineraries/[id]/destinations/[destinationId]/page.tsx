import { db } from '@/db';
import { destinations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Settings, Plane, Hotel } from 'lucide-react';

export default async function DestinationPage(props: {
  params: Promise<{ id: string; destinationId: string }>;
}) {
  const params = await props.params;
  const destination = await db.query.destinations.findFirst({
    where: eq(destinations.id, params.destinationId),
    with: {
      flightBookings: true,
      hotelBookings: true,
    },
  });

  if (!destination) {
    notFound();
  }

  console.log(destination);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{destination.name}</h1>
            <p className="text-muted-foreground">📍 {destination.location}</p>
          </div>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
          Edit Destination
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Travel Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Arrival
              </p>
              <p className="font-semibold">
                {new Date(destination.arrivalDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Departure
              </p>
              <p className="font-semibold">
                {new Date(destination.departureDate).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Duration
              </p>
              <p className="font-semibold">
                {Math.ceil(
                  (new Date(destination.departureDate).getTime() -
                    new Date(destination.arrivalDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Transportation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a
                href={`/itineraries/${params.id}/destinations/${params.destinationId}/flight`}
              >
                <Plane className="h-4 w-4" />
                Book Flight
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-primary" />
              Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a
                href={`/itineraries/${params.id}/destinations/${params.destinationId}/hotel`}
              >
                <Hotel className="h-4 w-4" />
                Book Hotel
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
