'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createContext, use, useReducer, ReactNode } from 'react';

// Types
const enum Step {
  FlightSearch = 'FlightSearch',
  FlightResults = 'FlightResults',
  HotelSearch = 'HotelSearch',
  HotelResults = 'HotelResults',
  Review = 'Review',
  Confirmation = 'Confirmation',
}

interface FlightOption {
  id: string;
  airline: string;
  price: number;
  duration: string;
}

interface HotelOption {
  id: string;
  name: string;
  price: number;
  rating: number;
  amenities: string[];
}

interface BookingState {
  currentStep: Step;
  flightSearch: {
    destination: string;
    departure: string;
    arrival: string;
    passengers: number;
    isOneWay: boolean;
  };
  selectedFlight: FlightOption | null;
  hotelSearch: {
    checkIn: string;
    checkOut: string;
    guests: number;
    roomType: string;
  };
  selectedHotel: HotelOption | null;
}

// Action types
type BookingAction =
  | {
      type: 'flightSearchUpdated';
      payload: Partial<{
        destination: string;
        departure: string;
        arrival: string;
        passengers: number;
        isOneWay: boolean;
      }>;
    }
  | { type: 'searchFlights' }
  | { type: 'flightSelected'; payload: { flight: FlightOption } }
  | { type: 'changeFlight' }
  | {
      type: 'hotelSearchUpdated';
      payload: Partial<{
        checkIn: string;
        checkOut: string;
        guests: number;
        roomType: string;
      }>;
    }
  | { type: 'searchHotels' }
  | { type: 'hotelSelected'; payload: { hotel: HotelOption } }
  | { type: 'changeHotel' }
  | { type: 'book' }
  | { type: 'back' };

const initialState: BookingState = {
  currentStep: Step.FlightSearch,
  flightSearch: {
    destination: '',
    departure: '',
    arrival: '',
    passengers: 1,
    isOneWay: false,
  },
  selectedFlight: null,
  hotelSearch: {
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: 'standard',
  },
  selectedHotel: null,
};

// Reducer
function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case 'flightSearchUpdated':
      return {
        ...state,
        flightSearch: { ...state.flightSearch, ...action.payload },
      };
    case 'searchFlights':
      return {
        ...state,
        currentStep: Step.FlightResults,
      };
    case 'flightSelected':
      return {
        ...state,
        selectedFlight: action.payload.flight,
        currentStep: Step.HotelSearch,
      };
    case 'changeFlight':
      return {
        ...state,
        currentStep: Step.FlightSearch,
      };
    case 'hotelSearchUpdated':
      return {
        ...state,
        hotelSearch: { ...state.hotelSearch, ...action.payload },
      };
    case 'searchHotels':
      return {
        ...state,
        currentStep: Step.HotelResults,
      };
    case 'hotelSelected':
      return {
        ...state,
        selectedHotel: action.payload.hotel,
        currentStep: Step.Review,
      };
    case 'changeHotel':
      return {
        ...state,
        currentStep: Step.HotelSearch,
      };
    case 'book':
      return {
        ...state,
        currentStep: Step.Confirmation,
      };
    case 'back':
      switch (state.currentStep) {
        case Step.FlightResults:
          return {
            ...state,
            currentStep: Step.FlightSearch,
          };
        case Step.HotelSearch:
          return {
            ...state,
            currentStep: Step.FlightResults,
          };
        case Step.HotelResults:
          return {
            ...state,
            currentStep: Step.HotelSearch,
          };
        case Step.Review:
          return {
            ...state,
            currentStep: Step.HotelResults,
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

// Context
interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider
function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

// Hook to use booking context
function useBooking() {
  const context = use(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

function FlightBookingForm() {
  const { state, dispatch } = useBooking();
  const flightSearch = state.flightSearch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({ type: 'searchFlights' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="one-way"
          checked={flightSearch.isOneWay}
          onCheckedChange={(checked) =>
            dispatch({
              type: 'flightSearchUpdated',
              payload: { isOneWay: checked },
            })
          }
        />
        <Label htmlFor="one-way">One-way flight</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          type="text"
          id="destination"
          value={flightSearch.destination}
          onChange={(e) =>
            dispatch({
              type: 'flightSearchUpdated',
              payload: { destination: e.target.value },
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="departure">Departure Date</Label>
        <Input
          type="date"
          id="departure"
          value={flightSearch.departure}
          onChange={(e) =>
            dispatch({
              type: 'flightSearchUpdated',
              payload: { departure: e.target.value },
            })
          }
          required
        />
      </div>

      {!flightSearch.isOneWay && (
        <div className="space-y-2">
          <Label htmlFor="arrival">Return Date</Label>
          <Input
            type="date"
            id="arrival"
            value={flightSearch.arrival}
            onChange={(e) =>
              dispatch({
                type: 'flightSearchUpdated',
                payload: { arrival: e.target.value },
              })
            }
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="passengers">Number of Passengers</Label>
        <Input
          type="number"
          id="passengers"
          value={flightSearch.passengers}
          onChange={(e) =>
            dispatch({
              type: 'flightSearchUpdated',
              payload: { passengers: parseInt(e.target.value) },
            })
          }
          min="1"
          max="9"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Search Flights
      </Button>
    </form>
  );
}

function FlightSearchResults() {
  const { state, dispatch } = useBooking();
  const selectedFlight = state.selectedFlight;

  const mockFlights: FlightOption[] = [
    { id: '1', airline: 'Sky Airways', price: 299, duration: '2h 30m' },
    { id: '2', airline: 'Ocean Air', price: 349, duration: '2h 45m' },
    { id: '3', airline: 'Mountain Express', price: 279, duration: '3h 15m' },
  ];

  const handleSelectFlight = (flight: FlightOption) => {
    dispatch({ type: 'flightSelected', payload: { flight } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Flights</h2>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: 'back' });
          }}
        >
          Back to Search
        </Button>
      </div>

      <div className="space-y-4">
        {mockFlights.map((flight) => (
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
                  className="mt-2"
                  onClick={() => handleSelectFlight(flight)}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelBookingForm() {
  const { state, dispatch } = useBooking();
  const hotelSearch = state.hotelSearch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'searchHotels' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hotel Search</h2>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: 'back' });
          }}
        >
          Back to Flights
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkIn">Check-in Date</Label>
        <Input
          type="date"
          id="checkIn"
          value={hotelSearch.checkIn}
          onChange={(e) =>
            dispatch({
              type: 'hotelSearchUpdated',
              payload: { checkIn: e.target.value },
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkOut">Check-out Date</Label>
        <Input
          type="date"
          id="checkOut"
          value={hotelSearch.checkOut}
          onChange={(e) =>
            dispatch({
              type: 'hotelSearchUpdated',
              payload: { checkOut: e.target.value },
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests">Number of Guests</Label>
        <Input
          type="number"
          id="guests"
          value={hotelSearch.guests}
          onChange={(e) =>
            dispatch({
              type: 'hotelSearchUpdated',
              payload: { guests: parseInt(e.target.value) },
            })
          }
          min="1"
          max="4"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomType">Room Type</Label>
        <select
          id="roomType"
          value={hotelSearch.roomType}
          onChange={(e) =>
            dispatch({
              type: 'hotelSearchUpdated',
              payload: { roomType: e.target.value },
            })
          }
          className="w-full p-2 border rounded"
          required
        >
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Search Hotels
      </Button>
    </form>
  );
}

function HotelSearchResults() {
  const { state, dispatch } = useBooking();
  const selectedHotel = state.selectedHotel;

  const mockHotels: HotelOption[] = [
    {
      id: '1',
      name: 'Grand Hotel',
      price: 199,
      rating: 4.5,
      amenities: ['Pool', 'Spa', 'Restaurant'],
    },
    {
      id: '2',
      name: 'Seaside Resort',
      price: 249,
      rating: 4.8,
      amenities: ['Beach Access', 'Pool', 'Bar'],
    },
    {
      id: '3',
      name: 'City Center Hotel',
      price: 179,
      rating: 4.2,
      amenities: ['Gym', 'Restaurant', 'Business Center'],
    },
  ];

  const handleSelectHotel = (hotel: HotelOption) => {
    dispatch({ type: 'hotelSelected', payload: { hotel } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Hotels</h2>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: 'back' });
          }}
        >
          Back to Search
        </Button>
      </div>

      <div className="space-y-4">
        {mockHotels.map((hotel) => (
          <div
            key={hotel.id}
            className={`p-4 border rounded hover:shadow-md ${
              selectedHotel?.id === hotel.id ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{hotel.name}</h3>
                <p className="text-gray-600">Rating: {hotel.rating}/5</p>
                <p className="text-sm text-gray-500">
                  {hotel.amenities.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${hotel.price}/night</p>
                <Button
                  className="mt-2"
                  onClick={() => handleSelectHotel(hotel)}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingReview() {
  const { state, dispatch } = useBooking();
  const selectedFlight = state.selectedFlight;
  const selectedHotel = state.selectedHotel;
  const flightSearch = state.flightSearch;
  const hotelSearch = state.hotelSearch;

  const handleConfirm = () => {
    dispatch({ type: 'book' });
  };

  const handleBack = () => {
    dispatch({ type: 'back' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Booking</h2>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Flight Details</h3>
          <p>Airline: {selectedFlight?.airline}</p>
          <p>Duration: {selectedFlight?.duration}</p>
          <p>Price: ${selectedFlight?.price}</p>
          <p>Passengers: {flightSearch.passengers}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              dispatch({ type: 'changeFlight' });
            }}
          >
            Change Flight
          </Button>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Hotel Details</h3>
          <p>Hotel: {selectedHotel?.name}</p>
          <p>Rating: {selectedHotel?.rating}/5</p>
          <p>Price: ${selectedHotel?.price}/night</p>
          <p>Room Type: {hotelSearch.roomType}</p>
          <p>Guests: {hotelSearch.guests}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              dispatch({ type: 'changeHotel' });
            }}
          >
            Change Hotel
          </Button>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-bold mb-2">Total Cost</h3>
          <p className="text-xl">
            ${(selectedFlight?.price || 0) + (selectedHotel?.price || 0)}
          </p>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleConfirm}>Confirm Booking</Button>
        </div>
      </div>
    </div>
  );
}

function BookingConfirmation() {
  const { state } = useBooking();
  const selectedFlight = state.selectedFlight;
  const selectedHotel = state.selectedHotel;

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
      <p className="text-gray-600">
        Thank you for booking with us. Your confirmation details have been sent
        to your email.
      </p>
      <div className="p-4 border rounded inline-block text-left">
        <h3 className="font-bold mb-2">Booking Reference</h3>
        <p>Flight: {selectedFlight?.airline}</p>
        <p>Hotel: {selectedHotel?.name}</p>
      </div>
    </div>
  );
}

// Main Component
function BookingApp() {
  const { state } = useBooking();
  const step = state.currentStep;

  const renderStep = () => {
    switch (step) {
      case Step.FlightSearch:
        return <FlightBookingForm />;
      case Step.FlightResults:
        return <FlightSearchResults />;
      case Step.HotelSearch:
        return <HotelBookingForm />;
      case Step.HotelResults:
        return <HotelSearchResults />;
      case Step.Review:
        return <BookingReview />;
      case Step.Confirmation:
        return <BookingConfirmation />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight & Hotel Booking</h1>
      {renderStep()}
    </div>
  );
}

export default function Exercise8() {
  return (
    <BookingProvider>
      <BookingApp />
    </BookingProvider>
  );
}
