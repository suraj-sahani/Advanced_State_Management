# Data Normalization

## Core Concepts

### Flat vs Nested Data Structures

- **Rule**: Flatten data structures by storing entities in separate collections with ID references
- **Anti-pattern**: Deep nesting creates complex dependencies and update patterns
- **Best practice**: Normalize data to avoid redundancy and ensure consistency
- **Benefits**:
  - Simplified updates with O(1) lookups instead of O(n×m) traversals
  - Better performance with minimal re-renders
  - Cleaner, more maintainable reducer logic
  - Easier implementation of cross-entity operations

### Problems with Nested Data

The current travel itinerary application stores data in a deeply nested structure where each destination contains an array of todos. This creates several problems:

**Deeply Nested Updates**

When updating or deleting a todo item, the reducer must:

1. Find the correct destination by mapping through all destinations
2. Find the correct todo within that destination's todos array
3. Create a new nested structure preserving immutability

```typescript
// ❌ Complex nested update - hard to read and error-prone
destinations: state.destinations.map((dest) =>
  dest.id === action.destinationId
    ? {
        ...dest,
        todos: dest.todos.filter((todo) => todo.id !== action.todoId),
      }
    : dest
);
```

**Performance Issues**

- **O(n×m) complexity**: Every todo operation requires iterating through destinations AND todos
- **Unnecessary re-renders**: Updating one todo causes the entire destinations array to be recreated
- **Memory overhead**: Deeply nested objects are harder for JavaScript engines to optimize

**Code Complexity**

- Reducer logic becomes increasingly complex with more nesting levels
- Difficult to implement features like global todo search or cross-destination operations
- Error-prone when adding new nested relationships

### Benefits of Data Normalization

Normalization flattens the data structure by storing entities in separate collections and using IDs to reference relationships:

**Simplified Updates**

```typescript
// ✅ Normalized - direct and clear
case 'DELETE_TODO':
  return {
    ...state,
    todos: state.todos.filter(todo => todo.id !== action.todoId)
  }
```

**Better Performance**

- **O(1) lookups**: Direct access to entities by ID using objects/Maps
- **Minimal re-renders**: Only affected components re-render
- **Efficient operations**: No need to traverse nested structures

**Code Clarity**

- Each entity type has clear, focused update logic
- Easy to implement complex queries and cross-entity operations
- Reducer actions become more predictable and testable

---

## Exercise: Normalize Travel Itinerary Data

**Goal**: Transform nested data structure into a normalized, flat structure

The current travel itinerary application uses deeply nested data that makes updates complex and inefficient. You'll refactor it to use a normalized structure for better performance and maintainability.

### Current Problem:

The app stores destinations with nested todos:

```typescript
// ❌ Nested structure
interface NestedState {
  destinations: Array<{
    id: string;
    name: string;
    todos: Array<{
      id: string;
      text: string;
    }>;
  }>;
}
```

### Your Task:

Transform the data structure to a normalized format:

```typescript
// ✅ Normalized structure
interface NormalizedState {
  destinations: { [id: string]: { id: string; name: string } };
  todos: { [id: string]: { id: string; text: string; destinationId: string } };
}
```

### Bonus Challenges:

- **Focus the destination input** - When a new destination is added, focus the input
- **Implement undo and redo** - Add history tracking to enable undoing and redoing actions
- **Use a 3rd party library** - Replace useReducer with a state management library like Zustand or Redux Toolkit that provides normalization helpers
- **Bulk operations** - Add ability to select and delete multiple todos

### Success Criteria:

- Data is stored in normalized flat structure
- All CRUD operations are simplified and more efficient
- Components only re-render when their specific data changes
- Code is more maintainable and easier to extend
- Same functionality with better performance
- Foundation for more complex features like search and bulk operations
