# State Management with Context and Finite State Machines

## Core Concepts

### React Context for State Sharing

- **Rule**: Use React Context to share state between components without prop drilling
- **Anti-pattern**: Passing state through multiple component layers as props
- **Best practice**: Create context providers for state that needs to be shared across component trees
- **Benefits**:
  - Eliminates prop drilling through intermediate components
  - Centralized state management for related functionality
  - Cleaner component interfaces with less props
  - Better separation of concerns between UI and state logic

**Before (Anti-pattern):**

```jsx
// Prop drilling through multiple levels
function App() {
  const [bookingState, setBookingState] = useState(initialState);
  return (
    <BookingPage
      bookingState={bookingState}
      setBookingState={setBookingState}
    />
  );
}

function BookingPage({ bookingState, setBookingState }) {
  return (
    <FlightForm bookingState={bookingState} setBookingState={setBookingState} />
  );
}

function FlightForm({ bookingState, setBookingState }) {
  // Finally use the state here
}
```

**After (Best practice):**

```jsx
// Context eliminates prop drilling
const BookingContext = createContext();

function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

function FlightForm() {
  const { state, dispatch } = useBooking(); // Direct access to state
}
```

### Finite State Machines

- **Rule**: Replace boolean flags with explicit state machines to make impossible states impossible
- **Anti-pattern**: Using multiple boolean flags that can create invalid combinations
- **Best practice**: Use discriminated unions to define valid states and transitions
- **Benefits**:
  - Prevents impossible states at compile time
  - Makes state transitions clear and predictable
  - Better error handling and edge case management
  - Self-documenting state logic
  - Each state contains exactly the data it needs

**Before (Anti-pattern):**

```jsx
// Boolean flags can create impossible states
const [isSubmitting, setIsSubmitting] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [flightOptions, setFlightOptions] = useState([]);

// What if both isError and isSuccess are true? 🤔
```

**After (Best practice):**

```tsx
// Discriminated union prevents impossible states
type State =
  | { status: 'idle'; formData: FormData }
  | { status: 'searching'; formData: FormData }
  | { status: 'error'; formData: FormData; error: string }
  | { status: 'results'; formData: FormData; flightOptions: FlightOption[] };

// Only valid states are possible
const [state, setState] = useState<State>({ status: 'idle', formData: {} });
```

### `useReducer` for Complex State

- **Rule**: Use `useReducer` for complex state logic with clear actions and transitions
- **Anti-pattern**: Managing complex state with multiple `useState` calls and side effects
- **Best practice**: Define actions that represent user intent and use a reducer for predictable state updates
- **Benefits**:
  - Centralized state logic in pure functions
  - Predictable state transitions based on actions
  - Easier to test state logic in isolation
  - Better debugging with clear action history
  - Type-safe state transitions with TypeScript

### Custom Context Hooks

- **Rule**: Create custom hooks to encapsulate context usage and provide better developer experience
- **Anti-pattern**: Using `useContext` directly throughout components
- **Best practice**: Create a custom hook that handles context access and provides useful abstractions
- **Benefits**:
  - Better error messages when context is used outside provider
  - Centralized context logic and validation
  - Cleaner component code with focused APIs
  - Easy to add derived state or computed values
  - TypeScript support with proper inference

```tsx
// Custom hook with validation
function useBooking() {
  const context = use(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
```

### Type Safety with Discriminated Unions

- **Rule**: Use TypeScript discriminated unions for state to ensure type-safe state transitions
- **Anti-pattern**: Using generic objects or any types for complex state
- **Best practice**: Define explicit state shapes with discriminated unions
- **Benefits**:
  - Compile-time prevention of impossible states
  - Better autocomplete and IntelliSense
  - Clear documentation of what data is available in each state
  - Easier refactoring with type safety
  - Better error messages during development

---

## Exercise: Refactor to Context and State Machine

**Goal**: Refactor a flight booking application to use React Context for state management and implement a finite state machine pattern

Convert the application to use:

1. **React Context** for shared state management
2. **useReducer** with clear actions and state transitions
3. **Discriminated unions** for type-safe state modeling
4. **Custom hooks** for clean context access
5. **Finite state machine** patterns for predictable state flow

### Success Criteria:

- No boolean flags for state management
- All state managed through context and reducer
- Type-safe state transitions with discriminated unions
- Custom hook provides clean API for state access
- Components use state guards for conditional rendering
- State logic is testable in isolation from components
- Clear action-based state transitions
- Impossible states are prevented by TypeScript
