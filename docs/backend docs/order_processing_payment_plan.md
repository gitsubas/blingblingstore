# Order Processing & Payment Implementation Plan (Phase 3)

**Status:** Planning
**Phase:** 3
**Goal:** Implement a robust order management system with lifecycle tracking, stock management, and payment integration foundation.

---

## 1. Database Schema Extensions

We will extend the Prisma schema to support complex order lifecycles and payments.

### 1.1 `Order` Model (Refined)
Stores the high-level details of a purchase.
*   `id`: UUID
*   `userId`: Relation to User
*   `total`: Float (Final amount after discounts/shipping)
*   `status`: Enum (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
*   `paymentStatus`: Enum (`PENDING`, `PAID`, `FAILED`, `REFUNDED`) - **NEW**
*   `paymentMethod`: String (`COD`, `KHALTI`, `ESEWA`) - **NEW**
*   `shippingAddress`: JSON (Snapshot of address at time of order) - **NEW**

### 1.2 `OrderItem` Model
Stores the snapshot of products purchased.
*   `id`: UUID
*   `orderId`: Relation to Order
*   `productId`: Relation to Product
*   `quantity`: Int
*   `price`: Float (Price at the moment of purchase, ignores future price changes)

### 1.3 `OrderTimeline` Model (New)
Tracks the history of an order for transparency.
*   `id`: UUID
*   `orderId`: Relation to Order
*   `status`: String (The status at this point in time)
*   `note`: String (e.g., "Order placed", "Payment received", "Shipped via Courier X")
*   `createdAt`: Timestamp

### 1.4 `Payment` Model (New)
Records transaction details.
*   `id`: UUID
*   `orderId`: Relation to Order
*   `provider`: String (`KHALTI`, `ESEWA`, `COD`)
*   `transactionId`: String (External ID from payment gateway)
*   `amount`: Float
*   `status`: String

---

## 2. API Architecture (`src/modules/order`)

### 2.1 Customer Endpoints
| Method | Endpoint | Description | Logic |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Place Order | 1. Validate Stock<br>2. Calculate Total<br>3. Create Order & Items<br>4. **Deduct Stock**<br>5. Create Initial Timeline<br>6. Trigger "Order Placed" Notification |
| `GET` | `/orders/my-orders` | Order History | List orders for logged-in user (descending date). |
| `GET` | `/orders/:id` | Order Details | Get Order + Items + Timeline. |
| `POST` | `/orders/:id/cancel` | Cancel Order | Only if status is `PENDING` or `PROCESSING`. Restores stock. |

### 2.2 Admin Endpoints
| Method | Endpoint | Description | Logic |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/orders` | All Orders | Filter by status, date. |
| `PATCH` | `/admin/orders/:id/status`| Update Status | 1. Update Order Status<br>2. **Add Timeline Entry**<br>3. Trigger Notification (e.g., "Shipped") |

### 2.3 Payment Webhooks (Future/Placeholder)
*   `POST /orders/webhook/khalti`: Handle payment success callback.
*   `POST /orders/webhook/esewa`: Handle payment success callback.

---

## 3. Business Logic & Services

### 3.1 Stock Management Service
*   **Check Availability:** Before creating an order, ensure `Product.stock >= requested_quantity`.
*   **Deduct Stock:** Atomic decrement of stock upon successful order creation.
*   **Restore Stock:** Atomic increment if order is cancelled.

### 3.2 Notification Service (`src/services/notification.service.ts`)
A centralized service to handle sending alerts.
*   `sendOrderConfirmation(email, orderDetails)`
*   `sendOrderStatusUpdate(email, phone, newStatus)`
*   *Note:* Will use console logs for development (Mock) and can be connected to Resend/Twilio later.

---

## 4. Development Steps
1.  **Schema:** Update `schema.prisma` with new models and fields.
2.  **Migration:** Run `npx prisma db push`.
3.  **Service Layer:** Implement `OrderService` (transactional logic is key here).
4.  **Controller Layer:** Implement `OrderController`.
5.  **Routes:** Define valid routes.
6.  **Testing:** Verify stock updates and timeline creation.
