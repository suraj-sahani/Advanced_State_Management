# Form Handling with FormData and Server Actions

## Core Concepts

### FormData for Web-Standard Form Handling

- **Rule**: Use FormData and server actions instead of managing multiple `useState` hooks
- **Anti-pattern**: Creating individual state variables and change handlers for each form field
- **Best practice**: Let FormData automatically capture form values and use server actions for processing
- **Benefits**:
  - Automatic data collection - no manual state management
  - Web standard - works everywhere, not just React
  - File upload support - handles files naturally
  - Progressive enhancement - works without JavaScript
  - Less boilerplate - no individual change handlers needed

**Before (Anti-pattern):**

```jsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});

// Multiple handlers
const handleFirstNameChange = (e) => setFirstName(e.target.value);
const handleLastNameChange = (e) => setLastName(e.target.value);
// ... more handlers
```

This becomes unwieldy with larger forms and requires careful state synchronization.

**After (Best practice):**

```jsx
function handleSubmit(formData) {
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  // All form data captured automatically
}
```

### Server Actions in Next.js

- **Rule**: Use server actions for form submission and server-side processing
- **Anti-pattern**: Creating separate API routes for every form submission
- **Best practice**: Define server functions that can be called directly from client components
- **Benefits**:
  - Type safety - full TypeScript support
  - No API routes needed - direct function calls
  - Automatic serialization - FormData handled seamlessly
  - Progressive enhancement - works without JavaScript
  - Built-in loading states - framework handles pending states

```jsx
// actions.ts
'use server';

export async function submitForm(formData: FormData) {
  // This runs on the server
  const name = formData.get('name');
  // Validate, save to database, etc.
}

// Component
<form action={submitForm}>
  <input name="name" />
  <button type="submit">Submit</button>
</form>;
```

### useActionState Hook

- **Rule**: Use `useActionState` for React-friendly server action integration
- **Anti-pattern**: Manual handling of form submission state and responses
- **Best practice**: Let `useActionState` manage pending states and responses
- **Benefits**:
  - Pending state - know when action is running
  - State management - handle success/error states
  - Automatic revalidation - UI updates on completion
  - Error boundaries - graceful error handling

```jsx
const [state, submitAction, isPending] = useActionState(
  serverAction,
  initialState
);

return (
  <form action={submitAction}>
    {/* isPending gives you loading state */}
    {/* state contains response/errors */}
  </form>
);
```

### Type-Safe Validation with Zod

- **Rule**: Use Zod for runtime validation and type safety
- **Anti-pattern**: Manual validation logic scattered throughout components
- **Best practice**: Define schemas once and use for both validation and TypeScript types
- **Benefits**:
  - Type safety - automatic TypeScript types from schemas
  - Runtime validation - catches invalid data at runtime
  - Detailed error messages - field-specific validation errors
  - Coercion - automatically converts strings to numbers/dates
  - Reusable schemas - share validation logic between client/server
  - IntelliSense - full autocomplete for validated data

```jsx
// schema.ts
import { z } from 'zod';

export const travelFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().min(18, 'Must be 18 or older'),
});

// actions.ts
('use server');

export async function submitForm(formData: FormData) {
  const rawData = Object.fromEntries(formData);

  // Validate with Zod
  const result = travelFormSchema.safeParse(rawData);

  if (!result.success) {
    return {
      status: 'error',
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Now we have type-safe, validated data
  const validData = result.data;
  // Save to database...
}
```

## When to Use FormData vs useState

### Use FormData when:

- Building traditional forms with submit buttons
- Working with server actions/mutations
- Need progressive enhancement
- Forms have many fields
- File uploads are involved
- Working with Next.js app router

### Use useState when:

- Building real-time/interactive UIs
- Need immediate validation on every keystroke
- Complex client-side logic between fields
- Building search/filter interfaces
- Need granular control over individual field updates
- Working with controlled components that need precise state

---

## Exercise: Convert useState Form to FormData

**Goal**: Refactor a form from multiple `useState` to FormData with server actions

You have a travel booking form that currently uses multiple `useState` and `useEffect` calls to manage form state. This approach creates a lot of boilerplate and complexity.

### Current Issues:

- Individual state for each form field
- Manual change handlers for every input
- Complex validation logic mixed with component logic
- No progressive enhancement
- Difficult to add new fields

### Your Task:

Convert the form to use:

1. **FormData** for automatic form data collection
2. **Server actions** for form submission
3. **useActionState** for handling pending states and responses
4. **Zod** for type-safe validation

### Implementation Steps:

1. **Remove individual useState** for each form field
2. **Create a server action** that accepts FormData
3. **Add Zod schema** for validation
4. **Use useActionState** to handle the server action
5. **Update form to use action** instead of onSubmit handler
6. **Handle validation errors** in the UI

### Success Criteria:

- No individual `useState` for form fields
- Form data automatically collected via FormData
- Server-side validation with Zod
- Loading states managed by `useActionState`
- Progressive enhancement (works without JavaScript)
- Type-safe form handling throughout
- Clean, maintainable code with less boilerplate
