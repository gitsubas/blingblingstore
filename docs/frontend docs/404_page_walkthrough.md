# Verification Walkthrough - 404 Error Page

A custom 404 error page has been implemented to handle invalid URLs gracefully.

## Changes Implemented
- Created `NotFound.tsx` component with a friendly error message and navigation buttons.
- Added a catch-all route `*` in `App.tsx` to render the `NotFound` component for any undefined paths.

## Verification Steps

### 1. Verify Valid Navigation
1.  **Home Page**: Navigate to `/`. **Verify**: Loads correctly.
2.  **Shop Page**: Navigate to `/shop`. **Verify**: Loads correctly.

### 2. Verify 404 Page
1.  **Invalid URL**: Navigate to `/this-page-does-not-exist`.
2.  **Verify UI**:
    - You should see the "404 - Page Not Found" message.
    - You should see the "Go Home" and "Continue Shopping" buttons.
3.  **Another Invalid URL**: Navigate to `/random/nested/path`.
4.  **Verify UI**: Should still show the 404 page.

### 3. Verify Navigation from 404 Page
1.  **Click "Go Home"**: **Verify**: Redirects to `/`.
2.  **Click "Continue Shopping"**: **Verify**: Redirects to `/shop`.
