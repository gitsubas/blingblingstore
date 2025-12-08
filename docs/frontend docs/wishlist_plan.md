# Implementation Plan - Wishlist Feature

The goal is to implement a Wishlist feature where users can save products for later. The wishlist will be persisted in `localStorage` for now, with a future migration to a backend database.

## User Review Required

> [!NOTE]
> Wishlist data will be stored in `localStorage` under the key `wishlist`. This means data is local to the browser and won't sync across devices.
> **Backend Migration**: A reminder comment will be added to the code to migrate this to a backend endpoint later.

## Proposed Changes

### Context

#### [NEW] [WishlistContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/WishlistContext.tsx)
- Create a context to manage the wishlist state.
- `wishlist`: Array of product IDs (or full product objects). Storing full objects avoids looking them up, but IDs are cleaner if we have a reliable product lookup. Given `ProductsContext` loads all products, we can store IDs and derive the list, or just store the minimal product info needed for the card.
- **Decision**: Store `Product` objects to avoid dependency complexity for now, similar to `CartContext`.
- `addToWishlist(product: Product)`
- `removeFromWishlist(productId: string)`
- `isInWishlist(productId: string)`
- Persist to `localStorage`.

### Components

#### [MODIFY] [ProductCard.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/components/ui/ProductCard.tsx)
- Add a heart icon button.
- Toggle wishlist state on click.
- Change icon style (filled vs. outline) based on state.

#### [MODIFY] [ProductDetails.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/ProductDetails.tsx)
- Add "Add to Wishlist" button (or heart icon).

#### [MODIFY] [Navbar.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/components/layout/Navbar.tsx)
- Add a heart icon link to `/dashboard/wishlist` (or just `/wishlist` if public, but user dashboard seems appropriate).
- Show a badge with the number of items in the wishlist.

### Pages

#### [NEW] [Wishlist.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/user/Wishlist.tsx)
- Display a grid of products in the wishlist.
- Allow removing items.
- Allow moving to cart (Add to Cart).

### Routing

#### [MODIFY] [App.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/App.tsx)
- Wrap app in `WishlistProvider`.
- Add route for `Wishlist` page (likely under `dashboard` or as a standalone public page).
- **Decision**: Add as `/wishlist` (publicly accessible for now, as it's localStorage based).

## Verification Plan

### Manual Verification
1.  **Start App**: `npm run dev`.
2.  **Add to Wishlist**:
    -   Go to Shop.
    -   Click heart icon on a product.
    -   Verify icon turns filled/red.
    -   Verify Navbar badge updates.
3.  **View Wishlist**:
    -   Click Navbar wishlist icon.
    -   Verify the product appears in the list.
4.  **Remove from Wishlist**:
    -   Click remove button (or toggle heart) in Wishlist page.
    -   Verify product disappears.
5.  **Persistence**:
    -   Refresh page.
    -   Verify wishlist items remain.
