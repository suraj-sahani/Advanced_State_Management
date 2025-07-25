# Testing App Logic

## Why explicit state modeling makes testing easier

- **Rule**: Test your business logic, not your UI implementation
- **Anti-pattern**: Testing components that mix UI concerns with business logic
- **Best practice**: Extract business logic into pure functions (reducers) that can be tested in isolation
- **Benefits**:
  - Deterministic behavior - same input always produces same output
  - No need to mock React hooks or DOM interactions
  - Faster test execution without rendering components
  - Clear separation between "what" (business logic) and "how" (UI)

## Testing reducers vs testing components

When your state logic is mixed in with UI components, testing becomes complex and brittle. You have to render components, simulate user interactions, and make assertions about DOM state.

With explicit state modeling using reducers, you can test the core business logic as pure functions:

**Anti-pattern (Testing mixed UI/logic):**

```tsx
// Hard to test - UI and logic are mixed
function BookingForm() {
  const [step, setStep] = useState('search');
  const [flight, setFlight] = useState(null);
  const [hotel, setHotel] = useState(null);

  const handleFlightSelect = (selectedFlight) => {
    setFlight(selectedFlight);
    setStep('hotel');
  };

  // Complex component with business logic embedded
}

// Test has to render component and simulate interactions
test('should move to hotel step after flight selection', () => {
  render(<BookingForm />);
  // Complex DOM interactions and assertions...
});
```

**Best practice (Testing pure business logic):**

```tsx
// Pure reducer - easy to test
function bookingReducer(state, action) {
  switch (action.type) {
    case 'flightSelected':
      return {
        ...state,
        selectedFlight: action.flight,
        currentStep: 'hotel',
      };
    // ... other cases
  }
}

// Simple, fast test of business logic
test('should move to hotel step after flight selection', () => {
  const initialState = { currentStep: 'search', selectedFlight: null };
  const action = { type: 'flightSelected', flight: mockFlight };

  const newState = bookingReducer(initialState, action);

  expect(newState.currentStep).toBe('hotel');
  expect(newState.selectedFlight).toBe(mockFlight);
});
```

## What to test in business logic

### Happy paths

Test the main user flows and expected behaviors:

- **State transitions**: Does selecting a flight move to the hotel step?
- **Data updates**: Is the selected flight stored correctly?
- **Derived values**: Are totals calculated correctly from selected items?
- **Form validation**: Are required fields validated properly?

### Edge cases

Test boundary conditions and error scenarios:

- **Invalid inputs**: What happens with empty or malformed data?
- **State consistency**: Can you get into impossible states?
- **Missing data**: How does the system handle null/undefined values?
- **Business rules**: Are booking constraints enforced correctly?

### State machine transitions

When using state machines, test all possible transitions:

- **Valid transitions**: Can you move from search → results → selection?
- **Invalid transitions**: Can you book without selecting a flight?
- **Conditional transitions**: Are conditional transitions working correctly?
- **Contextual data updates**: Does state data update properly during transitions?

## Testing patterns for booking flow

### Testing reducers

```tsx
describe('booking reducer', () => {
  test('should update flight search inputs', () => {
    const state = { flightSearch: { destination: '' } };
    const action = {
      type: 'flightSearchUpdated',
      payload: { destination: 'Paris' },
    };

    const result = bookingReducer(state, action);

    expect(result.flightSearch.destination).toBe('Paris');
  });

  test('should sync hotel dates with flight dates on submission', () => {
    const state = {
      flightSearch: { departure: '2024-06-01', arrival: '2024-06-10' },
      hotelSearch: { checkIn: '', checkOut: '' },
    };

    const result = bookingReducer(state, { type: 'flightSearchSubmitted' });

    expect(result.hotelSearch.checkIn).toBe('2024-06-01');
    expect(result.hotelSearch.checkOut).toBe('2024-06-10');
  });
});
```

### Testing derived state

```tsx
describe('booking calculations', () => {
  test('should calculate total cost correctly', () => {
    const flight = { price: 500 };
    const hotel = { price: 200 };

    const total = calculateTotalCost(flight, hotel);

    expect(total).toBe(700);
  });

  test('should handle missing selections gracefully', () => {
    const total = calculateTotalCost(null, null);

    expect(total).toBe(0);
  });
});
```

### Testing business rules

```tsx
describe('booking validation', () => {
  test('should prevent booking without flight selection', () => {
    const state = { selectedFlight: null, selectedHotel: mockHotel };

    const result = canProceedToBooking(state);

    expect(result).toBe(false);
  });

  test('should validate date ranges', () => {
    const search = { departure: '2024-06-10', arrival: '2024-06-01' };

    const result = isValidDateRange(search);

    expect(result).toBe(false);
  });
});
```

### Testing state transitions

```tsx
describe('booking flow transitions', () => {
  test('should allow going back from results to search', () => {
    const state = { currentStep: 'flight-results' };

    const result = bookingReducer(state, { type: 'back' });

    expect(result.currentStep).toBe('flight-search');
  });

  test('should not allow invalid step transitions', () => {
    const state = { currentStep: 'search' };

    const result = bookingReducer(state, { type: 'bookingConfirmed' });

    // Should remain in search step without required selections
    expect(result.currentStep).toBe('search');
  });
});
```

## Benefits of this approach

- **Fast feedback**: Tests run in milliseconds without DOM rendering
- **Reliable**: Pure functions are deterministic and don't depend on timing
- **Comprehensive**: Easy to test all edge cases and state combinations
- **Maintainable**: Business logic changes don't break unrelated UI tests
- **Debuggable**: Clear separation makes issues easier to isolate and fix

## Testing tools and setup

For this exercise, you'll use:

- **Vitest**: Fast test runner with great TypeScript support
- **Pure functions**: Test reducers and business logic directly
- **Mock data**: Use consistent test fixtures for predictable results
- **Type safety**: Leverage TypeScript to catch errors at compile time

---

## Exercise: Test the Booking Flow

**Goal**: Write comprehensive tests for the booking flow business logic

The booking flow has several key pieces of logic that need testing:

1. Flight search form updates
2. Flight selection and step transitions
3. Hotel search synchronization with flight dates
4. Hotel selection and booking review
5. Back navigation between steps
6. Total cost calculations
7. Booking validation rules

### Steps:

1. **Extract the reducer logic** from the booking flow into a separate file
2. **Write happy path tests** for each action type
3. **Add edge case tests** for invalid inputs and missing data
4. **Test state transitions** to ensure proper flow between steps
5. **Test business rules** like date validation and required selections
6. **Add integration tests** that combine multiple actions

### Success criteria:

- All reducer actions have corresponding tests
- Edge cases are covered (null values, invalid dates, etc.)
- State transitions are validated
- Business rules are enforced
- Tests run fast and are reliable
- Test coverage is comprehensive but focused on business logic

### Bonus challenges:

- Test the booking flow as a state machine
- Add property-based testing for complex validation rules
- Test async operations like API calls with proper mocking
- Create test utilities for common booking scenarios
