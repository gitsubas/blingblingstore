# Implementation Plan - 404 Error Page

The goal is to create a custom 404 error page to handle unknown routes gracefully, improving the user experience when they encounter broken links or invalid URLs.

## Proposed Changes

### Components & Pages

#### [NEW] [NotFound.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/NotFound.tsx)
- Create a new page component `NotFound`.
- **Content**:
    - "404 - Page Not Found" heading.
    - Friendly message (e.g., "Oops! The page you're looking for doesn't exist.").
    - "Go Home" button linking to `/`.
    - "Continue Shopping" button linking to `/shop`.
    - An illustration or icon (using Lucide React).

### Routing

#### [MODIFY] [App.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/App.tsx)
- Add a catch-all route `*` at the end of the routes list.
- Map it to the `NotFound` component.

## Verification Plan

### Manual Verification
1.  **Navigate to Valid Page**: Go to `/` or `/shop`. Verify it loads correctly.
2.  **Navigate to Invalid URL**: Go to `/non-existent-page` or `/random/path`.
3.  **Verify 404 Page**:
    - Check that the `NotFound` component is rendered.
    - Check the message and layout.
4.  **Test Links**:
    - Click "Go Home". Verify redirection to `/`.
    - Click "Continue Shopping". Verify redirection to `/shop`.
