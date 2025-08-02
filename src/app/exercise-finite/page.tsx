"use client";

import { getFlightOptions } from "@/app/exerciseUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface FlightOption {
  id: string;
  airline: string;
  price: number;
  duration: string;
}

interface FlightData {
  destination: string;
  departure: string;
  arrival: string;
  passengers: number;
  isRoundtrip: boolean;
  selectedFlightId: string | null;
}

type FlightState = FlightData &
  (
    | {
        status: "idle";
      }
    | {
        status: "submitting";
        selectedFlightId: null;
      }
    | {
        status: "error";
      }
    | {
        status: "success";
        flights: FlightOption[];
      }
  );

function FlightBooking() {
  const [flightData, setFlightData] = useState<FlightState>({
    status: "idle",
    destination: "",
    departure: "",
    arrival: "",
    passengers: 1,
    isRoundtrip: false,
    selectedFlightId: null,
  });

  const {
    status,
    destination,
    departure,
    arrival,
    passengers,
    isRoundtrip,
    selectedFlightId,
  } = flightData;

  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);

  const selectedFlight =
    status === "success" && selectedFlightId
      ? flightOptions.find((f) => f.id === selectedFlightId)
      : null;

  const totalPrice = selectedFlight ? selectedFlight.price * passengers : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFlightData((prev) => ({
      ...prev,
      status: "submitting",
      selectedFlightId: null,
    }));

    try {
      const flights = await getFlightOptions(flightData);

      setFlightOptions(flights);
      setFlightData((prev) => ({ ...prev, status: "success", flights }));
    } catch {
      setFlightData((prev) => ({ ...prev, status: "error" }));
    }
  };

  const handleFlightSelect = (flight: FlightOption) => {
    setFlightData((prev) =>
      prev.status === "success"
        ? {
            ...prev,
            selectedFlightId: flight.id,
          }
        : prev
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight Booking</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="roundtrip"
            checked={isRoundtrip}
            onCheckedChange={(checked) =>
              setFlightData((prev) => ({ ...prev, isRoundtrip: checked }))
            }
          />
          <Label htmlFor="roundtrip">Roundtrip flight</Label>
        </div>

        <div>
          <Label htmlFor="destination" className="block mb-1">
            Destination
          </Label>
          <Input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) =>
              setFlightData((prev) => ({
                ...prev,
                destination: e.target.value,
              }))
            }
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
            onChange={(e) =>
              setFlightData((prev) => ({ ...prev, departure: e.target.value }))
            }
            required
          />
        </div>

        {isRoundtrip && (
          <div>
            <Label htmlFor="arrival" className="block mb-1">
              Return Date
            </Label>
            <Input
              type="date"
              id="arrival"
              value={arrival}
              onChange={(e) =>
                setFlightData((prev) => ({ ...prev, arrival: e.target.value }))
              }
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
            onChange={(e) =>
              setFlightData((prev) => ({
                ...prev,
                passengers: e.target.valueAsNumber,
              }))
            }
            min="1"
            max="9"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full"
        >
          {status === "submitting" ? "Searching..." : "Search Flights"}
        </Button>
      </form>

      {status === "error" && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          An error occurred while searching for flights. Please try again.
        </div>
      )}

      {status === "success" && flightOptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Available Flights</h2>
          <div className="space-y-4">
            {flightOptions.map((flight) => (
              <div
                key={flight.id}
                className={`p-4 border rounded hover:shadow-md ${
                  selectedFlight?.id === flight.id
                    ? "border-blue-500 bg-blue-50"
                    : ""
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
                      onClick={() => handleFlightSelect(flight)}
                    >
                      {selectedFlight?.id === flight.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

export default function Page() {
  return <FlightBooking />;
}
