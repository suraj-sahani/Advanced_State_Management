# Syncing with External Stores

## Core Concepts

### `useSyncExternalStore` for External Data Sources

- **Rule**: Use `useSyncExternalStore` for subscribing to external stores and data sources
- **Anti-pattern**: Using `useEffect` + `useState` for external data synchronization
- **Best practice**: Use `useSyncExternalStore` for atomic updates and hydration safety
- **Benefits**:
  - Eliminates the useEffect + useState dance for external data
  - Handles hydration mismatches between server and client
  - Optimizes performance with built-in subscription management
  - Provides consistency across server-side rendering and client-side hydration

`useSyncExternalStore` is a React hook that lets you subscribe to external stores (data sources outside React's state management system). It can replace the common `useEffect` + `useState` pattern when syncing with external data sources.

**Before (Anti-pattern):**

```tsx
// ❌ Anti-pattern: useEffect + useState for external data
function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Subscribe to online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <div>{isOnline ? '🟢 Online' : '🔴 Offline'}</div>;
}
```

**Problems with this approach:**

- **Race conditions**: Initial status and event updates can get out of sync
- **Hydration mismatches**: Server assumes online, client might be offline
- **Performance**: Extra re-renders during initial setup
- **Complexity**: Manual event listener management and cleanup

**After (Best practice):**

```tsx
// ✅ Best practice: useSyncExternalStore
function NetworkStatus() {
  const isOnline = useSyncExternalStore(
    (callback) => {
      // Subscribe function
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine, // Get current snapshot (client)
    () => true // Get server snapshot (assume online)
  );

  return <div>{isOnline ? '🟢 Online' : '🔴 Offline'}</div>;
}
```

**Benefits:**

- **Atomic updates**: Guarantees consistency between subscription and snapshot
- **Hydration safety**: Handles server/client differences gracefully
- **Automatic cleanup**: No manual event listener management needed
- **Performance optimized**: Minimal re-renders and efficient updates

## When to Use useSyncExternalStore

**Perfect for:**

- **Third-party libraries**: Redux, Zustand, or any external state management
- **Custom hooks**: When building reusable hooks that sync with external data
- **Browser APIs**: Window size, network status, geolocation, etc.
- **Real-time data**: WebSocket connections, server-sent events
- **Global stores**: Any data source that exists outside React's component tree

**Not needed for:**

- Regular React state (`useState`, `useReducer`)
- Context values
- Props or derived data

## Handling Hydration Issues

One of the most powerful features is handling server/client hydration differences:

```tsx
const isOnline = useSyncExternalStore(
  subscribe,
  () => navigator.onLine, // Client snapshot
  () => true // Server snapshot (assume online)
);
```

This prevents hydration mismatches where the server renders one thing and the client shows another.

---

## Exercise: Sync with Browser's Network Status

**Goal**: Replace `useEffect` + `useState` with `useSyncExternalStore` for network status detection

You have a network status indicator that currently uses the manual `useEffect` + `useState` pattern to sync with the browser's online/offline events. This approach has timing issues and doesn't handle hydration properly.

### Your Task:

1. **Refactor from useEffect + useState** to `useSyncExternalStore` in `page.tsx`
2. **Connect to browser's network events** using the proper subscription pattern
3. **Handle real-time updates** when the user goes online/offline
4. **Bonus**: Create additional network-related indicators (connection type, speed, etc.)

### Success Criteria:

- No more manual `useEffect` + `useState` patterns for network status
- Network status updates automatically when browser goes online/offline
- No hydration mismatches between server and client
- Performance is optimized with minimal re-renders
- Code is cleaner and more maintainable
