'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { Combobox } from '@/components/combobox';
import { locations } from '@/app/locations';
import { useTransition } from 'react';

interface FlightSearchFormProps {
  defaultTo: string;
  defaultDate: string;
}

export function FlightSearchForm({
  defaultTo,
  defaultDate,
}: FlightSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (formData: FormData) => {
    const date = formData.get('departure') as string;
    const from = formData.get('from') as string;
    const to = formData.get('to') as string;

    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', date);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Flights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Combobox
                options={locations}
                name="from"
                placeholder="Departure city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Combobox
                options={locations}
                name="to"
                placeholder="Destination city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departure">Departure</Label>
              <Input
                id="departure"
                name="departure"
                type="date"
                defaultValue={searchParams.get('date') || defaultDate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <Input id="passengers" type="number" defaultValue="1" min="1" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Flights
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
