# Verification Walkthrough - Guest Checkout

Guest checkout has been implemented, allowing users to purchase items without creating an account.

## Changes Implemented
- Updated `OrdersContext` to support `"guest"` userId.
- Removed `ProtectedRoute` from `/checkout` route.
- Updated `Checkout` page:
    - Added "Already have an account? Login" banner for guests.
    - Added Email field to shipping form (auto-filled and disabled for logged-in users).

## Verification Steps

### 1. Verify Guest Checkout Access
1.  **Logout**: Ensure you are logged out.
2.  **Add to Cart**: Add items to the cart.
3.  **Proceed to Checkout**: Click "Checkout" in the cart.
4.  **Verify**: You are NOT redirected to login and land on the Checkout page.
5.  **Verify UI**: You see the "Already have an account? Log in" banner.

### 2. Verify Guest Order Placement
1.  **Fill Details**: Enter shipping info, including a valid email.
2.  **Payment**: Select a payment method (e.g., COD).
3.  **Place Order**: Complete the purchase.
4.  **Verify Success**: You are redirected to the Order Confirmation page.

### 3. Verify Admin Visibility
1.  **Login as Admin**: Log in with admin credentials.
2.  **Go to Orders**: Navigate to `/admin/orders`.
3.  **Verify Order**: Find the order you just placed. The User ID should be "guest" (or similar indication if we added UI for it, but internally it is "guest").

### 4. Verify Logged-in User Checkout (Regression Test)
1.  **Login**: Log in as a regular user.
2.  **Add to Cart**: Add items.
3.  **Checkout**: Proceed to checkout.
4.  **Verify UI**: No login banner. Email field is pre-filled and disabled.
5.  **Place Order**: Complete purchase.
6.  **Verify History**: Check `/dashboard/orders`. The order should appear there.
