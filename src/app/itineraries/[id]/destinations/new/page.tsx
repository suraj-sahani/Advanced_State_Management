import { createDestination } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar } from 'lucide-react';

export default async function NewDestinationPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Add New Destination</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createDestination} className="space-y-6">
            <input type="hidden" name="itineraryId" value={params.id} />

            <div className="space-y-2">
              <Label htmlFor="name">Destination Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter destination name (e.g., Paris, Tokyo)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter specific location or address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="arrivalDate"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Arrival Date
                </Label>
                <Input
                  id="arrivalDate"
                  name="arrivalDate"
                  type="date"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="departureDate"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Departure Date
                </Label>
                <Input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                <MapPin className="h-4 w-4" />
                Add Destination
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
