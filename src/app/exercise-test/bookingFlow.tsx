// Types
export const enum Step {
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

export const initialState: BookingState = {
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

export function bookingReducer(
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
