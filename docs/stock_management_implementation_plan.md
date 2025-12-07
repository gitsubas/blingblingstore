# Product Stock Management Implementation

Implement comprehensive stock/inventory management system for the BlingBling e-commerce platform. This feature will track product stock quantities, display stock status to users, prevent out-of-stock purchases, show low stock warnings, and provide admin inventory management capabilities.

## User Review Required

> [!IMPORTANT]
> **Stock Quantity Defaults**: Initial products will be assigned default stock quantities (e.g., 50 units for most items, 10 for limited items). Low stock threshold will be set to 5 units.

> [!NOTE]
> **Cart Behavior Change**: Users will no longer be able to add out-of-stock items to cart. The "Add to Cart" button will be disabled with clear messaging when stock is 0.

> [!WARNING]
> **Order Processing - Backend TODO**: Currently, this implementation will only update stock quantities in the admin interface. **IMPORTANT: When building the backend, implement automatic stock deduction on order placement/completion.** This frontend implementation provides the foundation, but backend integration is required for production use.

## Proposed Changes

### Product Data Model

#### [MODIFY] [CartContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/CartContext.tsx#L3-L13)

Add stock-related fields to the `Product` interface:
- `stock?: number` - Current available quantity
- `lowStockThreshold?: number` - Threshold for low stock warning (default: 5)

These fields are optional to maintain backward compatibility with existing product data.

---

### Initial Product Data

#### [MODIFY] [products.ts](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/data/products.ts)

Add stock quantities to all initial products:
- Most products: 50 units
- Limited edition items (e.g., paintings, sculptures): 10 units
- Popular items (e.g., cosmetics): 100 units
- Set `lowStockThreshold` to 5 for all products

---

### Public-Facing Components

#### [MODIFY] [ProductCard.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/components/ui/ProductCard.tsx)

Add stock status indicators:
- Display "Out of Stock" badge when `stock === 0`
- Display "Low Stock" badge when `stock > 0 && stock <= lowStockThreshold`
- Disable "Add to Cart" button when out of stock
- Show remaining quantity for low stock items
- Update button text to "Out of Stock" when unavailable

#### [MODIFY] [ProductDetails.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/ProductDetails.tsx)

Add detailed stock information:
- Display stock availability status prominently
- Show exact quantity remaining when low stock
- Disable "Add to Cart" button when out of stock
- Add visual indicator (badge/alert) for stock status
- Show "Only X left in stock!" message for low stock items

#### [MODIFY] [CartContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/CartContext.tsx#L54-L71)

Add stock validation in cart operations:
- Prevent adding out-of-stock items to cart
- Check available stock before increasing quantity
- Show warning when trying to add more than available stock
- Limit cart quantity to available stock

#### [MODIFY] [Cart.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/Cart.tsx)

Add stock validation for quantity updates:
- Disable increment button when cart quantity equals available stock
- Show warning message if stock becomes unavailable after adding to cart
- Display stock availability for each cart item

---

### Admin Components

#### [MODIFY] [ProductEditor.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/admin/ProductEditor.tsx)

Add inventory management fields:
- Stock quantity input field (number input)
- Low stock threshold input field (number input, default: 5)
- Display current stock status (In Stock / Low Stock / Out of Stock)
- Validation to prevent negative stock values
- Update form submission to include stock fields

#### [MODIFY] [ProductsContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/ProductsContext.tsx)

Add stock management methods:
- `updateStock(productId: string, quantity: number)` - Update stock quantity
- Ensure stock fields are preserved during product updates
- Validate stock values (non-negative integers)

---

## Verification Plan

### Manual Verification

Since there are no existing automated tests in the project, verification will be done through manual testing:

#### Test 1: Stock Display on Product Cards
1. Navigate to the shop page at `http://localhost:5173/shop`
2. Verify that products display appropriate stock badges:
   - Products with stock > 5: No badge
   - Products with stock ≤ 5 and > 0: "Low Stock" badge
   - Products with stock = 0: "Out of Stock" badge
3. Verify "Add to Cart" button is disabled for out-of-stock items

#### Test 2: Stock Display on Product Details
1. Navigate to a product detail page (e.g., `http://localhost:5173/product/1`)
2. Verify stock status is clearly displayed
3. For low stock items, verify "Only X left in stock!" message appears
4. For out-of-stock items, verify "Add to Cart" button is disabled

#### Test 3: Cart Stock Validation
1. Add a product to cart
2. Try to increase quantity beyond available stock
3. Verify increment button is disabled when cart quantity equals stock
4. Verify appropriate warning message is shown

#### Test 4: Admin Stock Management
1. Navigate to admin panel at `http://localhost:5173/admin`
2. Click "Add Product" or edit an existing product
3. Verify stock quantity and low stock threshold fields are present
4. Create/update a product with specific stock values
5. Verify stock values are saved and displayed correctly
6. Try to enter negative stock values and verify validation prevents it

#### Test 5: Out-of-Stock Prevention
1. Find a product with low stock (or set one to stock = 2 via admin)
2. Add 2 items to cart
3. Verify you cannot add more items
4. Verify product shows as "Out of Stock" on shop page
5. Verify "Add to Cart" is disabled on product detail page

#### Test 6: Low Stock Warnings
1. Set a product to stock = 3 (below threshold of 5)
2. Verify "Low Stock" badge appears on product card
3. Verify "Only 3 left in stock!" message appears on product details
4. Add items to cart and verify stock warnings update accordingly

### Browser Testing

Run the development server and perform the manual tests above:
```bash
cd client
npm run dev
```

Then open browser to `http://localhost:5173` and follow the test scenarios.
