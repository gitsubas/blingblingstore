# BlingBling Store: Frontend Master Implementation Guide

**Date:** December 6, 2025
**Version:** 1.0.0
**Status:** Feature Complete (MVP)
**Tech Stack:** React (Vite), TypeScript, Tailwind CSS

---

## 1. Project Overview & Philosophy

The **BlingBling Store** frontend is designed as a high-performance, responsive Single Page Application (SPA). The core design philosophy centers on **"Premium Simplicity"**—using vibrant primary accents against a clean, whitespace-heavy background to create a luxurious shopping experience.

This document serves as the **Source of Truth** for the frontend architecture, ensuring consistency as the application scales and integrates with a backend.

---

## 2. Design System

### 2.1 Color Palette
The application uses a distinctive primary color to drive brand identity.

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `#e5358dff` | Main buttons, active states, key highlights. |
| **Primary Hover** | `#D32F2F` | Hover states for interactive elements. |
| **Primary Light** | `#FFEBEE` | Backgrounds for selected items, badges. |
| **Text Main** | `#1f2937` | (Gray-800) Primary headings and body text. |
| **Text Muted** | `#6b7280` | (Gray-500) Secondary text, descriptions. |

*Defined in: `client/tailwind.config.js` & `client/src/index.css`*

### 2.2 Typography
*   **Font Family:** System Default Sans-Serif (Inter/Roboto equivalent).
*   **Scale:**
    *   `h1`: Bold, used for Page Titles (Dashboard, Shop Header).
    *   `h2`: Semibold, Section Headers.
    *   `body`: Regular, standard interface text.

### 2.3 UI Components (Atomic Design)
All core UI elements utilize reusable primitives located in `client/src/components/ui/`. **Do not build ad-hoc HTML elements**; use these primitives to maintain consistency.

*   **`Button`:** Supports `variant` (default, outline, ghost) and `size`.
*   **`Input` / `Select`:** Standardized form controls with consistent focus rings.
*   **`Card`:** The fundamental container for content sections.
*   **`Badge`:** Status indicators (e.g., "Pending", "Delivered").
*   **`Modal`:** Popovers for confirmations and quick edits.

---

## 3. Architecture & Code Structure

The project follows a **Feature-based Modular Architecture**.

### 3.1 Directory Map
```
client/src/
├── components/
│   ├── ui/             # Reusable atomic components (Button, Input)
│   ├── layout/         # Layout wrappers (Navbar, Footer, AdminSidebar)
│   ├── admin/          # Admin-specific widgets
│   ├── payment/        # Payment gateway mock forms
│   └── ...
├── context/            # Global State Managers (The "Brain")
├── pages/
│   ├── public/         # Accessible to all (Home, Shop, Login)
│   ├── user/           # Protected User routes (Profile, Orders)
│   └── admin/          # Protected Admin routes (Dashboard, ProductEditor)
├── hooks/              # Custom React hooks
├── data/               # Static mock data (to be replaced by API)
└── types/              # TypeScript Interfaces
```

### 3.2 State Management Strategy (Context API)
The application avoids "Prop Drilling" by using specialized Context Providers.

| Context | Responsibility | Key Data |
| :--- | :--- | :--- |
| **AuthContext** | User Identity | `user`, `login()`, `signup()`, `isAdmin` |
| **CartContext** | Shopping Cart | `items`, `addToCart()`, `cartTotal` |
| **ProductsContext** | Catalog Data | `products`, `addProduct()`, `updateProduct()` |
| **OrdersContext** | Transaction History | `orders`, `createOrder()`, `orderStats` |
| **WishlistContext** | User Favorites | `wishlistItems`, `toggleWishlist()` |
| **RecentlyViewed** | User History | `viewedItems` |

**Data Flow Rule:** Pages read/write to *Contexts*. Contexts currently read/write to *LocalStorage*. Future backend integration will only require updating the *Contexts* to read/write to *API Endpoints*.

---

## 4. Key User Flows

### 4.1 Authentication
*   **Sign Up:** Validates inputs -> Checks unique email -> Creates User -> Saves to `localStorage`.
*   **Login:** Validates credentials -> Sets `currentUser` session.
*   **Protection:** `ProtectedRoute` wrapper component checks `useAuth().isAuthenticated` before rendering private pages.

### 4.2 Shopping & Checkout
1.  **Selection:** User adds items to Cart (handles variants like Size/Color).
2.  **Checkout:**
    *   **Step 1:** Shipping Address (Form validation).
    *   **Step 2:** Payment Method (Khalti/eSewa selection).
    *   **Step 3:** Place Order.
3.  **Order Generation:** Logic in `OrdersContext` creates an Order Object -> Clears Cart -> Redirects to Confirmation.

### 4.3 Admin Management
*   **Dashboard:** Aggregates stats from `OrdersContext`.
*   **Product Editing:** `ProductEditor` page handles both Creation (New) and Editing (Existing) via URL params (e.g., `/admin/products/new` vs `/admin/products/123`).
*   **Routing:** Admin pages are guarded by `<ProtectedRoute adminOnly>`.

---

## 5. Development Guidelines

### 5.1 Adding New Features
1.  **Define Type:** Update `types/` interfaces if data structure changes.
2.  **Update Context:** Add necessary functions to the relevant Context provider.
3.  **Build UI:** Create component using `ui/` primitives.
4.  **Route:** Add page to `App.tsx` router.

### 5.2 Responsive Design
*   **Mobile First:** Write classes for mobile first (e.g., `w-full`), then add breakpoints (e.g., `md:w-1/2`).
*   **Grid System:** Use `grid-cols-1 md:grid-cols-3 lg:grid-cols-4` patterns for product lists.

---

## 6. Future Data Migration (Backend Prep)

The strict separation of logic (Contexts) and presentation (Components) allows for a smooth backend transition.

*   **Mock Data:** Located in `client/src/data/`.
*   **Persistence:** Currently `localStorage`.
*   **Transition:** Replace Context `useEffect` (localStorage sync) with `useEffect` (API Fetch).

This architecture ensures that while the "Engine" (Backend) changes, the "Car Body" (UI/UX) remains untouched.
