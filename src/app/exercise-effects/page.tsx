'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Flight {
  id: string;
  price: number;
  airline: string;
  departureTime: string;
  arrivalTime: string;
}

interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
}

export default function TripSearch() {
  // Input states
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Search states
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Trigger flight search when inputs change
  useEffect(() => {
    if (destination && startDate && endDate) {
      setIsSearchingFlights(true);
      setError(null);
    }
  }, [destination, startDate, endDate]);

  // Effect 2: Simulate flight search
  useEffect(() => {
    if (!isSearchingFlights) return;

    const searchFlights = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock flight data
        const flights: Flight[] = [
          {
            id: '1',
            price: 299,
            airline: 'Mock Airlines',
            departureTime: '10:00 AM',
            arrivalTime: '2:00 PM',
          },
          {
            id: '2',
            price: 399,
            airline: 'Demo Airways',
            departureTime: '2:00 PM',
            arrivalTime: '6:00 PM',
          },
        ];

        // Pick the cheapest flight
        const bestFlight = flights.reduce((prev, current) =>
          prev.price < current.price ? prev : current
        );

        setSelectedFlight(bestFlight);
        setIsSearchingFlights(false);
      } catch {
        setError('Failed to search flights');
        setIsSearchingFlights(false);
      }
    };

    searchFlights();
  }, [isSearchingFlights]);

  // Effect 3: Trigger hotel search when flight is selected
  useEffect(() => {
    if (selectedFlight) {
      setIsSearchingHotels(true);
    }
  }, [selectedFlight]);

  // Effect 4: Simulate hotel search
  useEffect(() => {
    if (!isSearchingHotels) return;

    const searchHotels = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock hotel data
        const hotels: Hotel[] = [
          {
            id: '1',
            name: 'Grand Hotel',
            price: 150,
            rating: 4.5,
          },
          {
            id: '2',
            name: 'Budget Inn',
            price: 80,
            rating: 3.8,
          },
        ];

        // Pick the best rated hotel
        const bestHotel = hotels.reduce((prev, current) =>
          prev.rating > current.rating ? prev : current
        );

        setSelectedHotel(bestHotel);
        setIsSearchingHotels(false);
      } catch {
        setError('Failed to search hotels');
        setIsSearchingHotels(false);
      }
    };

    searchHotels();
  }, [isSearchingHotels]);

  return (
    <div className="p-8 w-full max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              onBlur={(e) => setDestination(e.target.value.trim())}
              placeholder="Enter destination"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Card className={isSearchingFlights ? 'opacity-50' : ''}>
          <CardHeader>
            <CardTitle>Flight Search</CardTitle>
          </CardHeader>
          <CardContent>
            {isSearchingFlights ? (
              <p>Searching for flights...</p>
            ) : selectedFlight ? (
              <div className="space-y-2">
                <p className="font-medium">Selected Flight:</p>
                <p>Airline: {selectedFlight.airline}</p>
                <p>Price: ${selectedFlight.price}</p>
                <p>Departure: {selectedFlight.departureTime}</p>
                <p>Arrival: {selectedFlight.arrivalTime}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card
          className={
            isSearchingHotels || isSearchingFlights ? 'opacity-50' : ''
          }
        >
          <CardHeader>
            <CardTitle>Hotel Search</CardTitle>
          </CardHeader>
          <CardContent>
            {isSearchingHotels ? (
              <p>Searching for hotels...</p>
            ) : selectedHotel ? (
              <div className="space-y-2">
                <p className="font-medium">Selected Hotel:</p>
                <p>Name: {selectedHotel.name}</p>
                <p>Price: ${selectedHotel.price}/night</p>
                <p>Rating: {selectedHotel.rating}/5</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
