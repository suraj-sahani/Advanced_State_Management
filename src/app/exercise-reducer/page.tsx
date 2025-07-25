'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { FlightOption, getFlightOptions } from '@/app/exerciseUtils';

interface SearchResultsProps {
  flightOptions: FlightOption[];
  passengers: number;
  onBack: () => void;
}

function SearchResults({
  flightOptions,
  passengers,
  onBack,
}: SearchResultsProps) {
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(
    null
  );
  const totalPrice = selectedFlight ? selectedFlight.price * passengers : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Search
        </Button>
      </div>

      <div className="space-y-4">
        {flightOptions.map((flight) => (
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
  onSubmit: (formData: {
    destination: string;
    departure: string;
    arrival: string;
    passengers: number;
    isOneWay: boolean;
  }) => void;
  isSubmitting: boolean;
}) {
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [isOneWay, setIsOneWay] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      departure,
      arrival,
      passengers,
      isOneWay,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Switch id="one-way" checked={isOneWay} onCheckedChange={setIsOneWay} />
        <Label htmlFor="one-way">One-way flight</Label>
      </div>

      <div>
        <Label htmlFor="destination" className="block mb-1">
          Destination
        </Label>
        <Input
          type="text"
          id="destination"
          value={destination}
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
          value={departure}
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
            value={arrival}
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
          value={passengers}
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
  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    destination: string;
    departure: string;
    arrival: string;
    passengers: number;
    isOneWay: boolean;
  } | null>(null);

  const handleSubmit = async (formData: {
    destination: string;
    departure: string;
    arrival: string;
    passengers: number;
    isOneWay: boolean;
  }) => {
    setIsSubmitting(true);
    setIsError(false);
    setSearchParams(formData);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockFlights = await getFlightOptions(formData);
      setFlightOptions(mockFlights);
      setShowResults(true);
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight Booking</h1>

      {!showResults ? (
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
          passengers={searchParams?.passengers || 1}
          onBack={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
