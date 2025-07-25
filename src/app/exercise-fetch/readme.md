# Server State Management with TanStack Query

## Core Concepts

### Specialized Libraries for Server State

- **Rule**: Use specialized libraries for server state management
- **Anti-pattern**: Using `useEffect` + `useState` for data fetching
- **Best practice**: Use TanStack Query for server state and caching
- **Benefits**:
  - Automatic background refetching
  - Caching and cache invalidation
  - Loading and error states handled automatically
  - Optimistic updates and mutations
  - Request deduplication
  - Offline support

**Problems with useEffect + useState for data fetching**:

- **Boilerplate code**: Every component needs loading, error, and data states
- **Race conditions**: Multiple requests can complete out of order
- **No caching**: Same data fetched multiple times
- **Manual refetching**: No automatic updates when data goes stale
- **Complex error handling**: Need to manually manage error recovery
- **Memory leaks**: Unmounted components can still set state
- **No request deduplication**: Multiple components making same request

**Before (Anti-pattern):**

```tsx
function FlightSearchResults() {
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlights = async () => {
      setIsLoading(true); // ❌ Manual loading state
      setError(null); // ❌ Manual error reset
      try {
        const flightData = await fetchFlights(flightSearch);
        setFlights(flightData); // ❌ Could cause memory leak if unmounted
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch flights'
        ); // ❌ Manual error handling
      } finally {
        setIsLoading(false); // ❌ Manual loading cleanup
      }
    };

    loadFlights(); // ❌ No caching, refetches every time
  }, [flightSearch]); // ❌ Race condition if flightSearch changes rapidly

  // ❌ Lots of conditional rendering boilerplate
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{/* render flights */}</div>;
}
```

**After (Best practice with TanStack Query):**

```tsx
function FlightSearchResults() {
  const {
    data: flights,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['flights', flightSearch], // ✅ Automatic caching by key
    queryFn: () => fetchFlights(flightSearch), // ✅ Simple data fetching
    staleTime: 5 * 60 * 1000, // ✅ Cache for 5 minutes
    retry: 2, // ✅ Automatic retry on failure
  });

  // ✅ Same conditional rendering, but managed automatically
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render flights */}</div>;
}
```

## TanStack Query Key Features

**Caching & Background Updates**:

- Intelligent caching based on query keys
- Automatic background refetching when data becomes stale
- Cache persistence across component mounts/unmounts

**Loading & Error States**:

- Built-in loading, error, and success states
- Automatic error boundaries integration
- Retry logic with exponential backoff

**Performance Optimizations**:

- Request deduplication (same query key = single request)
- Window focus refetching
- Network status awareness
- Infinite queries for pagination

**Developer Experience**:

- DevTools for debugging queries and cache
- TypeScript support with automatic type inference
- Optimistic updates for better UX

## Query Keys Best Practices

Query keys should be **arrays** that uniquely identify the data:

```tsx
// ✅ Good query keys
['flights', { destination: 'NYC', departure: '2024-01-01' }][
  ('hotels', { checkIn: '2024-01-01', checkOut: '2024-01-05' })
][('user', userId)][('posts', { page: 1, limit: 10 })];

// ❌ Bad query keys
'flights'[('flights', flightSearchObject)]; // Not specific enough // Object reference changes
```

## Mutations for Data Updates

Use `useMutation` for creating, updating, or deleting data:

```tsx
const bookingMutation = useMutation({
  mutationFn: (booking: BookingData) => submitBooking(booking),
  onSuccess: () => {
    // ✅ Invalidate and refetch related queries
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  },
  onError: (error) => {
    // ✅ Handle errors gracefully
    toast.error('Booking failed: ' + error.message);
  },
});
```

---

## Exercise: Convert to TanStack Query

**Goal**: Replace `useEffect` + `useState` data fetching with TanStack Query

You have a flight booking application that uses manual data fetching with `useEffect` and `useState`. This approach has several problems including race conditions, no caching, and complex error handling.

### Setup

1. Install TanStack Query: `npm install @tanstack/react-query`
2. Set up QueryClient and provider in your app
3. Add React Query DevTools for debugging

### Part 1: Convert Flight Search Results

**Current code issues in `FlightSearchResults`**:

- Manual loading, error, and data state management
- Potential race conditions with rapid search changes
- No caching - same search refetches data
- Memory leak risk if component unmounts during fetch

**Steps**:

1. Remove `useState` for `flights`, `isLoading`, and `error`
2. Remove the `useEffect` with manual fetch logic
3. Replace with `useQuery` hook
4. Use `flightSearch` object as part of query key
5. Set appropriate `staleTime` for caching flight results

### Part 2: Convert Hotel Search Results

**Current code issues in `HotelSearchResults`**:

- Same problems as flight search
- Duplicate boilerplate code
- No shared caching between different hotel searches

**Steps**:

1. Follow same pattern as flight search conversion
2. Use `hotelSearch` object in query key
3. Consider different `staleTime` for hotel data vs flight data

### Part 3: Add Loading and Error UI Improvements

**Enhancements to add**:

- Better loading states (skeleton components)
- Error boundaries for graceful error handling
- Retry buttons for failed requests
- Background loading indicators for refetching

### Part 4: Optimize Query Keys (Advanced)

**Current issue**: If search objects have the same values but different references, they create separate cache entries

**Solution**: Normalize query keys to ensure consistent caching

```tsx
// Before: Each object reference creates new cache entry
queryKey: ['flights', flightSearch];

// After: Normalize the key structure
queryKey: [
  'flights',
  {
    destination: flightSearch.destination,
    departure: flightSearch.departure,
    // ... other relevant fields
  },
];
```

### Success Criteria:

- All data fetching uses TanStack Query
- Loading and error states are handled automatically
- Caching works correctly with proper query keys
- DevTools show query information
- No more race conditions or memory leaks
- Better user experience with background refetching

### Bonus Challenges

1. **Prefetching**: Prefetch hotel data when flight is selected
2. **Optimistic Updates**: Show selected items immediately before server confirms
3. **Infinite Queries**: Convert to pagination if result sets are large
4. **Mutations**: Add TanStack Query mutations for the booking submission
5. **DevTools**: Use React Query DevTools to inspect cache and query states
