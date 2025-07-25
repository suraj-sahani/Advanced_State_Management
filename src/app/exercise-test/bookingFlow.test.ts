import { test, expect } from 'vitest';
import { initialState, bookingReducer, Step } from './bookingFlow';

test('should be able to book a flight', () => {
  let state = bookingReducer(initialState, { type: 'searchFlights' });

  expect(state.currentStep).toBe(Step.FlightResults);

  const mockFlight = {
    id: '1',
    airline: 'Mock Airline',
    price: 100,
    duration: '1h',
  };

  state = bookingReducer(state, {
    type: 'flightSelected',
    payload: { flight: mockFlight },
  });

  expect(state.currentStep).toBe(Step.HotelSearch);
  expect(state.selectedFlight).toBe(mockFlight);

  state = bookingReducer(state, { type: 'changeFlight' });

  expect(state.currentStep).toBe(Step.FlightSearch);
  expect(state.selectedFlight).toBe(null);

  state = bookingReducer(state, { type: 'searchHotels' });

  expect(state.currentStep).toBe(Step.HotelResults);
  expect(state.selectedHotel).toBe(null);

  const mockHotel = {
    id: '1',
    name: 'Mock Hotel',
    price: 100,
    rating: 4.5,
    amenities: ['Free Wi-Fi', 'Pool', 'Gym'],
  };

  state = bookingReducer(state, {
    type: 'hotelSelected',
    payload: { hotel: mockHotel },
  });

  expect(state.currentStep).toBe(Step.Review);
  expect(state.selectedFlight).toBe(mockFlight);
  expect(state.selectedHotel).toBe(mockHotel);

  state = bookingReducer(state, { type: 'book' });

  expect(state.currentStep).toBe(Step.Confirmation);
  expect(state.selectedFlight).toBe(mockFlight);
  expect(state.selectedHotel).toBe(mockHotel);
});
