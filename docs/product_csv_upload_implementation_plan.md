# Admin CSV Product Upload Implementation Plan

## Goal Description
Allow the admin to upload a CSV file to bulk add products to the store. This will parse the CSV file in the frontend and update the product list state (which persists to local storage for now).

## User Review Required
> [!IMPORTANT]
> This plan requires installing `papaparse` and `@types/papaparse` for robust CSV parsing.
> The CSV is expected to have specific headers: `name`, `price`, `category`, `description`, `stock`, `image`.
> Currently, this will **ADD** products from the CSV. It will not update existing products based on ID (as IDs are system-generated).

## Proposed Changes

### Dependencies
#### [NEW]
- `papaparse`: For CSV parsing.
- `@types/papaparse`: TypeScript definitions.

### Frontend Components

#### [MODIFY] [ProductManagement.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/admin/ProductManagement.tsx)
- Add an "Import CSV" button next to "Add New Product".
- Implement a hidden file input to trigger file selection.
- Add `handleFileUpload` function:
    - Parse file using `Papa.parse`.
    - Validate required fields (`name`, `price`, `category`).
    - Map CSV rows to `Product` objects.
    - Call `addProduct` from `ProductsContext` for each valid row.
    - Show success/error feedback (e.g., "Imported X products", "Error parsing file").

## Verification Plan

### Automated Tests
- None (Frontend logic relies on user interaction and file API).

### Manual Verification
1.  **Setup**:
    - Create a sample CSV file with headers: `name`, `price`, `category`, `description`, `stock`, `image`.
    - Add dummy data (e.g., "Test Product", "100", "Test Category", "Desc", "10", "https://via.placeholder.com/150").
2.  **Execution**:
    - Go to Admin Dashboard -> Product Inventory.
    - Click "Import CSV".
    - Select the sample CSV file.
3.  **Validation**:
    - Verify that the new products appear in the list.
    - Verify that the data (price, stock, etc.) is correct.
    - Verify that invalid rows (missing name/price) are handled (or at least don't crash the app).
