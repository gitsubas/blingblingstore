# Backend Development Plan - BlingBling Store

## Goal Description
Initialize the backend infrastructure for BlingBling Store to replace the current client-side mock implementations. This involves setting up a Node.js/Express server, connecting to **Supabase (PostgreSQL)**, and defining the API architecture.

## User Review Required
> [!IMPORTANT]
> **Image Hosting Strategy:**
> You mentioned **Google Photos**. I **strongly advise against** using Google Photos for an e-commerce backend.
> *   **Why?** Google Photos does not provide permanent, direct image links (URLs expire) and does not support programmatic uploading/embedding for websites effectively. It violates their terms of service for app hosting.
> *   **Recommendation:** Since you chose **Supabase** for the database, I recommend using **Supabase Storage**. It is built-in, free/cheap, and integrates perfectly with your database. Alternatively, **Cloudinary** is a great free option. **This plan assumes Supabase Storage.**

> [!NOTE]
> **Notification Services:** added as requested.
> *   **Email:** Will use a provider like **Resend** or **Nodemailer** (SMTP).
> *   **SMS:** Will structure the backend to support an SMS gateway (e.g., Twilio or local Nepali providers if available).

## Proposed Changes

### Phase 1: Foundation (Setup & Authentication)
**Goal:** Establish the server, connect to Supabase, and handle user authentication.

#### [NEW] `server/` Directory Structure
- **Init:** `package.json`, `tsconfig.json`.
- **Entry:** `src/index.ts`.
- **Middleware:** error handling, cors, logger.

#### [NEW] Database Schema (`server/prisma/schema.prisma`)
- **Datasource:** Connect to Supabase PostgreSQL.
- **Models:** `User` (id, email, role), `Address`.

#### [NEW] Authentication Module (`server/src/modules/auth/`)
- **Routes:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.
- **Logic:** Generate JWTs.
- **Middleware:** `authenticate` (verify JWT).

---

### Phase 2: Catalog Management (Products & Images)
**Goal:** Migrate product data and implement image uploading.

#### [MODIFY] Database Schema
- **Models:** `Category`, `Product`, `ProductVariant`, `ProductImage`.

#### [NEW] Storage Service (Supabase Storage)
- **Logic:** Utility to upload images to a Supabase Storage Bucket and return the public URL.

#### [NEW] Product Module (`server/src/modules/product/`)
- **Public Routes:** `GET /products`, `GET /products/:id`.
- **Admin Routes:**
    - `POST /products` (supports image upload).
    - `PUT /products/:id`.
    - `DELETE /products/:id`.

---

### Phase 3: Order Processing, Tracking, & Notifications
**Goal:** Handle orders, track their status, and notify users.

#### [MODIFY] Database Schema
- **Models:**
    - `Order` (id, user_id, total, status).
    - `OrderItem` (product details, price).
    - `OrderTimeline` (order_id, status, timestamp, note) - **[ADDED]**.

#### [NEW] Order Module (`server/src/modules/order/`)
- `POST /orders`: Create order, deduct stock.
- `GET /orders/my-orders`: List user orders.
- `GET /orders/:id`: Get detailed order view + Timeline.
- `PUT /admin/orders/:id/status`: Admin updates status (e.g., processing -> shipped). triggers **Notification**.

#### [NEW] Notification Service (`server/src/services/notification.ts`)
- **Architecture:** A service that listens for events (like "Order Created", "Status Changed").
- **Channels:**
    - **Email:** Send confirmation emails (HTML template).
    - **SMS:** Send status updates.

#### [NEW] Payment Webhooks (`server/src/modules/payment/`)
- Endpoints for Khalti/Esewa to mark orders as PAID.

### Phase 4: Frontend Integration (Post-Backend)
**Goal:** Connect the React frontend to the completed API.
- Switch `AuthContext` to use `/auth` endpoints.
- Switch `ProductsContext` to use `/products` endpoints.
- Switch `OrdersContext` to use `/orders` endpoints.

## Verification Plan

### Automated Tests
- **Framework:** `jest` + `supertest`.
- **Integration Tests:**
    - **Auth:** Register/Login flows.
    - **Products:** CRUD operations.
    - **Orders:** Verify stock deduction and **Timeline creation** upon order placement.
    - **Notifications:** Mock the notification service to verify it is *called* when status changes (don't actually send emails in tests).

### Manual Verification
1.  **DB Check:** Log into Supabase Dashboard to verify tables are created.
2.  **Image Upload:** Use Postman to upload an image and verify the returned URL works.
3.  **Order Flow:** Place an order via API, checks if:
    - Stock decreases.
    - "Pending" status added to Timeline.
    - Mock Notification log appears in console.
