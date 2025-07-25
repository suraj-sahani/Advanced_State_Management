import { db } from '@/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function ItineraryPage() {
  const allItineraries = await db.query.itineraries.findMany({
    with: {
      destinations: true,
    },
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Itineraries</h1>
        <Link
          href="/itineraries/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Create New Itinerary
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allItineraries.map((itinerary) => (
          <Link href={`/itineraries/${itinerary.id}`} key={itinerary.id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{itinerary.name}</CardTitle>
                <CardDescription>
                  {itinerary.people}{' '}
                  {itinerary.people === 1 ? 'person' : 'people'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itinerary.destinations.map((destination) => (
                    <div key={destination.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{destination.name}</span>
                        <Badge variant="outline">{destination.location}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(destination.arrivalDate), 'MMM d')} -{' '}
                        {format(
                          new Date(destination.departureDate),
                          'MMM d, yyyy'
                        )}
                      </div>
                    </div>
                  ))}
                  {itinerary.destinations.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No destinations added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
