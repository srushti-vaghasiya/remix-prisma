# 404 Page Handling in Remix

This document explains the different approaches to handle 404 pages and routing errors in Remix.

## Approaches for 404 Handling

### 1. Catch-all Route (Recommended)
**File**: `app/routes/[...404].tsx`

This is the most common and recommended approach. The `[...404]` route catches all unmatched paths and displays a custom 404 page.

```tsx
// app/routes/[...404].tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1>404 - Page Not Found</h1>
    </div>
  );
}
```

### 2. Root Error Boundary
**File**: `app/root.tsx`

The root ErrorBoundary handles all types of errors including 404s that aren't caught by the catch-all route.

```tsx
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }
  
  // Handle other errors...
}
```

### 3. Nested Route Error Boundaries
You can also add ErrorBoundaries to specific route groups for more granular error handling.

## Implementation in This Project

### 1. Catch-all Route
- **File**: `app/routes/[...404].tsx`
- **Features**:
  - Clean, user-friendly design
  - Navigation options (Homepage, Todo List, Back)
  - Responsive layout
  - Helpful messaging

### 2. Enhanced Root Error Boundary
- **File**: `app/root.tsx`
- **Features**:
  - Handles 404 and other HTTP errors
  - Shows error details in development
  - Provides navigation options
  - Maintains consistent styling

## How It Works

### Route Matching Priority
1. **Exact matches** - `/todos`, `/todos/new`
2. **Dynamic routes** - `/todos/:taskId`
3. **Catch-all route** - `[...404]` (last resort)

### Error Handling Flow
1. **Route not found** → `[...404].tsx` route
2. **Server errors** → Root ErrorBoundary
3. **Client errors** → Route-specific ErrorBoundary

## Testing 404 Pages

Try these URLs to test the 404 handling:
- `/nonexistent-page`
- `/todos/invalid-id`
- `/todos/999/edit` (if task 999 doesn't exist)

## Best Practices

1. **User-friendly messaging** - Explain what happened clearly
2. **Navigation options** - Provide ways to get back on track
3. **Consistent styling** - Match your app's design
4. **SEO considerations** - Return proper 404 status codes
5. **Analytics tracking** - Track 404s for broken links

## Customization Options

### Different 404 Pages by Route Group
You can create different 404 pages for different sections:

```tsx
// app/routes/todos/[...404].tsx
// Specific 404 for todo-related routes
```

### API Route 404s
For API routes, return JSON responses:

```tsx
// app/routes/api/[...404].tsx
export function loader() {
  return json({ error: "API endpoint not found" }, { status: 404 });
}
```

## Advanced Features

### Dynamic 404 Content
You can customize the 404 page based on the attempted URL:

```tsx
export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  return { path };
}
```

### 404 Redirects
For moved content, you can implement automatic redirects:

```tsx
export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  
  if (url.pathname === '/old-path') {
    return redirect('/new-path');
  }
  
  throw new Response("Not Found", { status: 404 });
}
```

This comprehensive approach ensures users always have a good experience even when they encounter missing pages or errors.
