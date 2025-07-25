import { db } from '@/db';
import { destinations, itineraries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Plus, Settings } from 'lucide-react';

export default async function ItineraryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const itinerary = await db.query.itineraries.findFirst({
    where: eq(itineraries.id, params.id),
  });

  if (!itinerary) {
    notFound();
  }

  const destinationsList = await db.query.destinations.findMany({
    where: eq(destinations.itineraryId, params.id),
    orderBy: (destinations, { asc }) => [asc(destinations.arrivalDate)],
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{itinerary.name}</h1>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
          Edit Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Destinations
            </CardTitle>
            <Button asChild size="sm">
              <a href={`/itineraries/${params.id}/destinations/new`}>
                <Plus className="h-4 w-4" />
                Add Destination
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            {destinationsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium mb-2">No destinations yet</p>
                <p className="text-sm mb-4">
                  Start planning your trip by adding your first destination
                </p>
                <Button asChild>
                  <a href={`/itineraries/${params.id}/destinations/new`}>
                    <Plus className="h-4 w-4" />
                    Add First Destination
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {destinationsList.map((destination) => (
                  <div
                    key={destination.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{destination.name}</h3>
                        <Badge variant={getStatusVariant(destination.status)}>
                          {destination.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        📍 {destination.location}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            destination.arrivalDate
                          ).toLocaleDateString()}
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            destination.departureDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`/itineraries/${params.id}/destinations/${destination.id}`}
                      >
                        View Details
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Trip Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Trip ID
              </p>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {itinerary.id}
              </p>
            </div>

            {itinerary.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm">{itinerary.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Number of Travelers
              </p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-semibold">{itinerary.people}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
