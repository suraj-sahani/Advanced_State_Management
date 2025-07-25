'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
} from 'nuqs';

interface Layover {
  city: string;
  duration: string;
}

interface FlightOption {
  id: string;
  airline: string;
  price: number;
  duration: string;
  layovers: Layover[];
}

interface SearchResultsProps {
  flightOptions: FlightOption[];
  passengers: number;
  onBack: () => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="text-right space-y-2">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchResults({
  flightOptions,
  passengers,
  onBack,
  isLoading,
}: SearchResultsProps & { isLoading: boolean }) {
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(
    null
  );
  const [showDirectOnly, setShowDirectOnly] = useQueryState(
    'directOnly',
    parseAsBoolean.withDefault(false)
  );
  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsStringEnum(['price', 'duration']).withDefault('price')
  );
  const [sortOrder, setSortOrder] = useQueryState(
    'sortOrder',
    parseAsStringEnum(['asc', 'desc']).withDefault('asc')
  );
  const totalPrice = selectedFlight ? selectedFlight.price * passengers : 0;

  const filteredFlights = flightOptions
    .filter((flight) => !showDirectOnly || flight.layovers.length === 0)
    .sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        // Convert duration strings to minutes for comparison
        const getDurationInMinutes = (duration: string) => {
          // Parse duration like "2h 30m" or "2h 15m"
          const hoursMatch = duration.match(/(\d+)h/);
          const minutesMatch = duration.match(/(\d+)m/);

          const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
          const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

          return hours * 60 + minutes;
        };
        return sortOrder === 'asc'
          ? getDurationInMinutes(a.duration) - getDurationInMinutes(b.duration)
          : getDurationInMinutes(b.duration) - getDurationInMinutes(a.duration);
      }
    });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Search
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="direct-only"
            checked={showDirectOnly || false}
            onCheckedChange={(checked) => setShowDirectOnly(checked)}
          />
          <Label htmlFor="direct-only">Direct flights only</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Label>Sort by:</Label>
          <select
            value={sortBy || 'price'}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'duration')}
            className="border rounded p-1"
          >
            <option value="price">Price</option>
            <option value="duration">Duration</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFlights.map((flight) => (
          <div
            key={flight.id}
            className={`p-4 border rounded hover:shadow-md ${
              selectedFlight?.id === flight.id
                ? 'border-blue-500 bg-blue-50'
                : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{flight.airline}</h3>
                <p className="text-gray-600">Duration: {flight.duration}</p>
                {flight.layovers.length > 0 && (
                  <div className="text-sm text-gray-500">
                    <p>Layovers:</p>
                    <ul className="list-disc list-inside">
                      {flight.layovers.map((layover, index) => (
                        <li key={index}>
                          {layover.city} ({layover.duration})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${flight.price}</p>
                <Button
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  onClick={() => setSelectedFlight(flight)}
                >
                  {selectedFlight?.id === flight.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFlight && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
          <div className="space-y-2">
            <p>Flight: {selectedFlight.airline}</p>
            <p>Duration: {selectedFlight.duration}</p>
            <p>Passengers: {passengers}</p>
            <p className="text-xl font-bold mt-4">Total: ${totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const [destination, setDestination] = useQueryState('destination');
  const [departure, setDeparture] = useQueryState('departure');
  const [arrival, setArrival] = useQueryState('arrival');
  const [passengers, setPassengers] = useQueryState(
    'passengers',
    parseAsInteger.withDefault(1)
  );
  const [isOneWay, setIsOneWay] = useQueryState(
    'isOneWay',
    parseAsBoolean.withDefault(false)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="one-way"
          checked={isOneWay || false}
          onCheckedChange={(checked) => setIsOneWay(checked)}
        />
        <Label htmlFor="one-way">One-way flight</Label>
      </div>

      <div>
        <Label htmlFor="destination" className="block mb-1">
          Destination
        </Label>
        <Input
          type="text"
          id="destination"
          value={destination || ''}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="departure" className="block mb-1">
          Departure Date
        </Label>
        <Input
          type="date"
          id="departure"
          value={departure || ''}
          onChange={(e) => setDeparture(e.target.value)}
          required
        />
      </div>

      {!isOneWay && (
        <div>
          <Label htmlFor="arrival" className="block mb-1">
            Return Date
          </Label>
          <Input
            type="date"
            id="arrival"
            value={arrival || ''}
            onChange={(e) => setArrival(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="passengers" className="block mb-1">
          Number of Passengers
        </Label>
        <Input
          type="number"
          id="passengers"
          value={passengers || 1}
          onChange={(e) => setPassengers(parseInt(e.target.value))}
          min="1"
          max="9"
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Searching...' : 'Search Flights'}
      </Button>
    </form>
  );
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [view, setView] = useQueryState('view', {
    parse: (value) => (value === 'results' ? 'results' : 'search'),
    serialize: (value) => value,
    defaultValue: 'search',
  });

  // Get the search parameters from nuqs hooks
  const [destination] = useQueryState('destination');
  const [departure] = useQueryState('departure');
  const [passengers] = useQueryState('passengers', {
    parse: (value) => parseInt(value) || 1,
    serialize: (value) => value.toString(),
  });

  // Add effect to load search results when URL has search params
  useEffect(() => {
    const loadSearchResults = async () => {
      const hasSearchParams = destination && departure;

      if (hasSearchParams && view === 'results') {
        setIsSubmitting(true);
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock flight options with layovers
          const mockFlights: FlightOption[] = [
            {
              id: '1',
              airline: 'Sky Airways',
              price: 299,
              duration: '2h 30m',
              layovers: [],
            },
            {
              id: '2',
              airline: 'Ocean Air',
              price: 349,
              duration: '2h 45m',
              layovers: [
                { city: 'Chicago', duration: '1h 15m' },
                { city: 'Denver', duration: '45m' },
              ],
            },
            {
              id: '3',
              airline: 'Mountain Express',
              price: 279,
              duration: '3h 15m',
              layovers: [{ city: 'Phoenix', duration: '1h 30m' }],
            },
            {
              id: '4',
              airline: 'Pacific Airlines',
              price: 329,
              duration: '2h 15m',
              layovers: [],
            },
          ];

          setFlightOptions(mockFlights);
        } catch {
          setIsError(true);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    loadSearchResults();
  }, [view, destination, departure]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsError(false);
    setView('results');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock flight options with layovers
      const mockFlights: FlightOption[] = [
        {
          id: '1',
          airline: 'Sky Airways',
          price: 299,
          duration: '2h 30m',
          layovers: [],
        },
        {
          id: '2',
          airline: 'Ocean Air',
          price: 349,
          duration: '2h 45m',
          layovers: [
            { city: 'Chicago', duration: '1h 15m' },
            { city: 'Denver', duration: '45m' },
          ],
        },
        {
          id: '3',
          airline: 'Mountain Express',
          price: 279,
          duration: '3h 15m',
          layovers: [{ city: 'Phoenix', duration: '1h 30m' }],
        },
        {
          id: '4',
          airline: 'Pacific Airlines',
          price: 329,
          duration: '2h 15m',
          layovers: [],
        },
      ];

      setFlightOptions(mockFlights);
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight Booking</h1>

      {view === 'search' ? (
        <>
          <BookingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          {isError && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              An error occurred while searching for flights. Please try again.
            </div>
          )}
        </>
      ) : (
        <SearchResults
          flightOptions={flightOptions}
          passengers={passengers ?? 1}
          onBack={() => setView('search')}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
