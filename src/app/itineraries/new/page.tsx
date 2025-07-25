import { createItinerary } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react';

export default function NewItineraryPage() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Create New Itinerary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createItinerary} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter trip name (e.g., Summer Vacation 2024)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your trip plans, goals, or any special notes..."
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="people" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of People
              </Label>
              <Input
                id="people"
                name="people"
                type="number"
                min="1"
                placeholder="How many people will be traveling?"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                Create Itinerary
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
