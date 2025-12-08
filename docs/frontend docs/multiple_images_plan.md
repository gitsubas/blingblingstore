# Implementation Plan - Multiple Product Images

The goal is to update the `ProductEditor` to support adding multiple images for a product. The `Product` interface already supports `images?: string[]`. We will allow users to upload multiple images (stored as Base64 in `localStorage`) or add multiple URLs.

## User Review Required

> [!NOTE]
> The `image` field (single string) will be treated as the "primary" image. The `images` array will contain all images including the primary one, or we can treat `image` as the first item of `images`.
> **Decision**: To maintain backward compatibility, `image` will be the primary image (first in the list), and `images` will store all images. When saving, `image` will be set to `images[0]`.

## Proposed Changes

### Client

#### [MODIFY] [ProductEditor.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/admin/ProductEditor.tsx)
- Update `formData` to include `images: string[]`.
- Modify the image upload section to allow multiple files.
- Display a grid of uploaded images.
- Allow removing images.
- Allow setting a primary image (or just default to the first one).
- On submit, ensure `image` is set to the first image in the array, and `images` contains all of them.

## Verification Plan

### Manual Verification
1.  **Start the App**: Run `npm run dev` in `client`.
2.  **Navigate to Admin**: Go to `/admin` and click "Add New Product".
3.  **Upload Multiple Images**:
    -   Select multiple files at once, or add them one by one.
    -   Verify all images appear in the preview grid.
4.  **Save Product**:
    -   Create the product.
5.  **Verify Persistence**:
    -   Check the product list. The main image should be displayed.
    -   (If Product Details page exists) Go to product details and verify the gallery shows all images.
