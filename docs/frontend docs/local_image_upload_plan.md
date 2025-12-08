# Implementation Plan - Local Image Upload

The goal is to allow admins to upload images locally for products. Currently, only image URLs are supported. Since the application uses `localStorage` for persistence, we will implement "upload" by converting selected image files to Base64 strings and storing them directly in the product data.

## User Review Required

> [!NOTE]
> Images will be stored as Base64 strings in `localStorage`. This is suitable for a demo or small-scale local use but has storage limits (typically 5MB total for localStorage). Large images or many products with images might hit this limit.
> Future integration with cloud storage (AWS S3/Cloudinary) is recommended as per the assessment report.

## Proposed Changes

### Client

#### [MODIFY] [ProductEditor.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/admin/ProductEditor.tsx)
- Add a file input element (`type="file"`) to the form.
- Implement a handler to read the selected file using `FileReader` and convert it to a Base64 Data URL.
- Update the `formData.image` state with the Base64 string.
- Add an image preview to show the uploaded image (or the URL if entered).
- Allow users to switch between entering a URL and uploading a file, or just have the file upload update the image path.

## Verification Plan

### Manual Verification
1.  **Start the App**: Run `npm run dev` in `client`.
2.  **Navigate to Admin**: Go to `/admin` (or wherever the product list is) and click "Add New Product" or edit an existing one.
3.  **Upload Image**:
    -   Click the "Choose File" button.
    -   Select an image file from your computer.
    -   Verify that the image preview appears.
4.  **Save Product**:
    -   Fill in other required fields.
    -   Click "Create Product" or "Update Product".
5.  **Verify Persistence**:
    -   Check the product list to see if the image is displayed.
    -   Refresh the page to ensure the image persists (loaded from `localStorage`).
