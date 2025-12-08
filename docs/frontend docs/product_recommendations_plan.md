# Product Recommendations Implementation Plan

## Goal Description
Implement product recommendations to increase user engagement and cross-selling. This includes:
1.  **"You May Also Like"**: Display related products on the product detail page based on category.
2.  **"Recently Viewed"**: Track and display products the user has recently visited.

## User Review Required
- [ ] Confirm logic for "Related Products" (e.g., same category, same tags?).
- [ ] Confirm where "Recently Viewed" should appear (Product page? Home page? Dashboard?).

## Proposed Changes

### [Client]
#### [NEW] [RecentlyViewedContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/RecentlyViewedContext.tsx)
- Create a context to manage recently viewed products.
- Persist to `localStorage` (key: `recentlyViewed`).
- Limit to last 5-10 items.

#### [MODIFY] [App.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/App.tsx)
- Wrap application with `RecentlyViewedProvider`.

#### [MODIFY] [ProductDetails.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/ProductDetails.tsx)
- **"You May Also Like"**:
    - Filter `products` by current product's category.
    - Exclude current product.
    - Limit to 4 items.
    - Display in a grid below reviews.
- **"Recently Viewed"**:
    - Use `RecentlyViewedContext` to add current product on mount.
    - Display list of recently viewed products (excluding current) at the bottom.

#### [NEW] [ProductGrid.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/components/product/ProductGrid.tsx)
- (Optional) Refactor product grid if needed, or just use existing `ProductCard` in a grid layout.

## Verification Plan
### Manual Verification
1.  **"You May Also Like"**:
    - Go to a "Electronics" product.
    - Verify other "Electronics" products appear in the section.
    - Verify current product is NOT in the list.
2.  **"Recently Viewed"**:
    - Visit Product A, then Product B, then Product C.
    - On Product C page, verify A and B are in "Recently Viewed".
    - Reload page -> Verify history persists.

