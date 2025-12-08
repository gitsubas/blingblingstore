# Implementation Plan - Guest Checkout

The goal is to allow users to purchase items without creating an account. This involves updating the routing, order creation logic, and checkout UI.

## User Review Required

> [!NOTE]
> Guest orders will have a `userId` of `"guest"`. They will not appear in any user's order history but will be visible to admins.

## Proposed Changes

### Context & Logic

#### [MODIFY] [OrdersContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/OrdersContext.tsx)
- Update `Order` interface: `userId` can be `"guest"`.
- Update `createOrder`: Remove the mandatory user check. If no user is logged in, use `"guest"` as `userId`.

### Routing

#### [MODIFY] [App.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/App.tsx)
- Remove `ProtectedRoute` wrapper from the `/checkout` route.

### Components & Pages

#### [MODIFY] [Checkout.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/Checkout.tsx)
- Initialize `shippingData.email` to empty string if no user is logged in.
- Add a "Already have an account? Login" link for guest users.
- Ensure the checkout flow works smoothly without a `user` object.

#### [MODIFY] [Cart.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/public/Cart.tsx)
- (Optional) Update empty cart message or buttons if needed (current implementation seems fine).

## Verification Plan

### Manual Verification
1.  **Logout**: Ensure you are logged out.
2.  **Add to Cart**: Add items to the cart.
3.  **Proceed to Checkout**: Click "Checkout" in the cart.
4.  **Verify Access**: You should reach the Checkout page without being redirected to Login.
5.  **Fill Details**: Enter shipping info (including email).
6.  **Place Order**: Complete the purchase.
7.  **Verify Success**: You should see the Order Confirmation page.
8.  **Admin Check**: Login as admin and verify the order exists with "guest" user.
