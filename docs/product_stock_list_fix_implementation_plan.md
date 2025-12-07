# Fix Admin Product Stock List Display

## Problem Description

The product stock list is not displayed in the admin dashboard when navigating to `/admin/products`. Investigation revealed that the route is incorrectly configured to render the `Dashboard` component instead of a dedicated product stock list page.

## Root Cause

In [App.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/App.tsx#L91), the `/admin/products` route points to the `Dashboard` component:

```tsx
<Route path="products" element={<Dashboard />} />
```

This should instead render a dedicated `ProductManagement` component that displays all products with their stock information in a table format.

## Proposed Changes

### Admin Components

#### [NEW] [ProductManagement.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/admin/ProductManagement.tsx)

Create a new admin page component that:
- Displays all products in a table format
- Shows key product information: name, category, price, stock quantity
- Includes stock status indicators (out of stock, low stock, in stock)
- Provides action buttons to edit or delete products
- Includes a button to add new products
- Uses the existing `useProducts` context to fetch product data

**Table Columns:**
- Product Image (thumbnail)
- Product Name
- Category
- Price
- Stock Quantity with color-coded status badge
- Actions (Edit/Delete buttons)

---

### Routing Configuration

#### [MODIFY] [App.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/App.tsx#L91)

Update the `/admin/products` route to use the new `ProductManagement` component:
- Import the new `ProductManagement` component
- Change route element from `<Dashboard />` to `<ProductManagement />`

---

## Verification Plan

### Manual Verification

1. Start the development server
2. Navigate to admin dashboard at `http://localhost:5174/admin`
3. Click on "Products" in the sidebar navigation
4. Verify that the product stock list is displayed with:
   - All products shown in a table
   - Stock quantities visible for each product
   - Color-coded stock status badges (red for out of stock, orange for low stock, green for in stock)
   - Edit and Delete action buttons
   - "Add New Product" button at the top
5. Test clicking "Edit" button to ensure it navigates to product editor
6. Test clicking "Add New Product" to ensure it navigates to new product form
