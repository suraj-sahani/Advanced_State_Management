# URL Query State Management

## Core Concepts

### URL State for Shareable Application State

- **Rule**: Store shareable and persistent state in URL query parameters
- **Anti-pattern**: Using `useState` for state that should be bookmarkable or shareable
- **Best practice**: Use query parameters for filters, search terms, pagination, and form data
- **Benefits**:
  - Shareable URLs that preserve application state
  - Browser back/forward navigation works naturally
  - Bookmarkable state for better UX
  - Eliminates "lost state" on page refresh
  - SEO benefits for search and filter states
  - Deep linking to specific application states

**Examples of state that belongs in URL**:

- Search filters and sorting options
- Pagination state
- Form input values
- Active tabs or views
- Selected items or categories
- Modal open/closed state

**When to use query params**: When the state affects what the user sees and should be shareable or persistent

### Type-Safe Query State with nuqs

- **Rule**: Use specialized libraries for type-safe URL state management
- **Anti-pattern**: Manual URL parsing and string manipulation
- **Best practice**: Use nuqs for automatic URL synchronization with type safety
- **Benefits**:
  - Automatic URL synchronization
  - Type-safe parsing and serialization
  - SSR-compatible
  - Optimistic updates
  - Built-in validation
  - Custom parsers for complex types

---

## Exercise: Convert Form State to URL Query Parameters

**Goal**: Transform local component state to persistent URL state

You have a flight booking application that currently uses `useState` for form data. The problem is that users lose their search criteria when they refresh the page or want to share a specific search with someone.

### Current Issues:

- Form data is lost on page refresh
- Users can't bookmark specific searches
- No shareable URLs for search results
- Back button doesn't preserve form state

### Your Task:

Convert the booking form to use `useQueryState` from the `nuqs` library so that:

1. **Form fields persist in URL**: All form inputs (destination, dates, passengers, etc.) should be stored as query parameters
2. **Shareable searches**: Users can copy the URL and share their search criteria
3. **Bookmark-friendly**: Specific searches can be bookmarked and restored
4. **Navigation-aware**: Browser back/forward buttons work naturally with form state

### Success Criteria:

- All form state persists in URL query parameters
- URLs are shareable and bookmarkable
- Browser navigation works correctly
- No hydration mismatches in SSR
- Type safety is maintained throughout
