# Implementation Plan - Product Filtering & Sorting

The goal is to enhance the Shop page with advanced filtering and sorting capabilities, including price range, rating, multiple categories, and sorting options.

## User Review Required

> [!NOTE]
> I will be adding `rating` and `reviews` fields to the `Product` interface and populating them with mock data to enable these features.

## Proposed Changes

### Data & Interfaces

#### [MODIFY] [CartContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/CartContext.tsx)
- Update `Product` interface to include:
    - `rating?: number`
    - `reviews?: number`

#### [MODIFY] [products.ts](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/data/products.ts)
- Add mock `rating` and `reviews` data to existing products.

### Components & Pages

#### [MODIFY] [Shop.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/Shop.tsx)
- **State Management**:
    - Replace single `category` param with multi-select support.
    - Add state for `minPrice`, `maxPrice`, `sortBy`, `minRating`.
- **UI Updates**:
    - **Sidebar**:
        - **Categories**: Change to checkboxes for multiple selection.
        - **Price**: Add min/max inputs or slider.
        - **Rating**: Add star rating filter (e.g., "4 Stars & Up").
    - **Top Bar**:
        - **Sort**: Add dropdown (Price: Low-High, High-Low, Newest, Popular, Rating).
- **Logic**:
    - Implement comprehensive filtering (Category AND Price AND Rating AND Search).
    - Implement sorting logic.

## Verification Plan

### Manual Verification
1.  **Start App**: `npm run dev`.
2.  **Navigate to Shop**: `/shop`.
3.  **Test Filters**:
    -   Select multiple categories (e.g., "Decor" and "Paintings"). Verify products from both appear.
    -   Set Price Range (e.g., $50 - $200). Verify products are within range.
    -   Select Rating (e.g., 4 Stars & Up). Verify products meet criteria.
4.  **Test Sorting**:
    -   Sort by Price Low to High. Verify order.
    -   Sort by Price High to Low. Verify order.
    -   Sort by Rating. Verify order.
5.  **Test Combinations**: Combine filters and sorting.
6.  **Test Clear All**: Verify all filters reset.
