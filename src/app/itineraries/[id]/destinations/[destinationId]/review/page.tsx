import { db } from '@/db';
import { destinations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { confirmBooking } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plane,
  Hotel,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

type Flight = {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  price?: number;
};

type HotelBooking = {
  name: string;
  checkIn: string;
  checkOut: string;
  price?: number;
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string; destinationId: string }>;
}) {
  const { id, destinationId } = await params;
  const destination = await db.query.destinations.findFirst({
    where: eq(destinations.id, destinationId),
    with: {
      flightBookings: true,
      hotelBookings: true,
    },
  });

  if (!destination) {
    notFound();
  }

  const flight = destination.flightBookings[0] as Flight | undefined;
  const hotel = destination.hotelBookings[0] as HotelBooking | undefined;

  async function handleConfirmBooking() {
    'use server';
    await confirmBooking(destinationId, id);
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <a
          href={`/itineraries/${id}`}
          className="hover:text-foreground transition-colors"
        >
          Your Trip
        </a>
        <span>/</span>
        <span className="text-foreground font-medium">Review and Book</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <CheckCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Review and Book</h1>
          <p className="text-muted-foreground">
            Review your selections for {destination.name}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Flight Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Flight Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flight ? (
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Round Trip</Badge>
                    <h3 className="font-semibold">{flight.airline}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {flight.departureTime} - {flight.arrivalTime}
                    </span>
                  </div>
                  {flight.price && (
                    <p className="text-lg font-semibold text-green-600">
                      ${flight.price}
                    </p>
                  )}
                </div>
                <div className="w-32 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Plane className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">No flight selected</p>
                  <p className="text-sm">
                    You haven&apos;t selected a flight yet
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hotel Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-primary" />
              Hotel Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotel ? (
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold">{hotel.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Check-in: {new Date(hotel.checkIn).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Check-out: {new Date(hotel.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                  {hotel.price && (
                    <p className="text-lg font-semibold text-green-600">
                      ${hotel.price}
                    </p>
                  )}
                </div>
                <div className="w-32 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <Hotel className="h-8 w-8 text-green-600" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">No hotel selected</p>
                  <p className="text-sm">
                    You haven&apos;t selected a hotel yet
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Destination Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Destination Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">{destination.name}</h3>
              <p className="text-muted-foreground">📍 {destination.location}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(
                    destination.arrivalDate
                  ).toLocaleDateString()} -{' '}
                  {new Date(destination.departureDate).toLocaleDateString()}
                </span>
                <Badge variant="outline">
                  {Math.ceil(
                    (new Date(destination.departureDate).getTime() -
                      new Date(destination.arrivalDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Actions */}
        <div className="flex justify-end pt-4">
          <form action={handleConfirmBooking}>
            <Button
              type="submit"
              size="lg"
              className="min-w-32"
              disabled={!flight && !hotel}
            >
              <CheckCircle className="h-4 w-4" />
              Confirm Booking
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
