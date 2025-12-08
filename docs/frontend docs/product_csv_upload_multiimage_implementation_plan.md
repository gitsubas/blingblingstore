# Multi-Image CSV Upload Implementation Plan

## Goal Description
Support uploading multiple images for a single product via CSV. This involves:
1.  Allowing multiple filenames in the CSV `Image` column (comma-separated).
2.  Accumulating images from multiple CSV rows matching the same product.
3.  Matching these filenames to uploaded local files and converting them to Base64.

## Proposed Changes

### [Admin] Product Management
#### [MODIFY] [ProductManagement.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/admin/ProductManagement.tsx)
- **Logic Updates in `handleFileUpload`**:
    - **Accumulate Images**:
        - In the `results.data.forEach` loop, add a `_rawImages` Set to the product object in `productsMap`.
        - For *every* row, split the `row.image` string by comma (`,`) and add trimmed filenames to `_rawImages`.
    - **Process Images**:
        - Iterate through `_rawImages`.
        - If `imageFiles` (local upload) contains a matching filename:
            - Convert it to Base64.
            - Add to `product.images`.
        - If no match (or no upload), keep the original string (allows mixed URLs or unmatched filenames).
        - Set `product.image` to the first item in the processed list.
- **Cleanup**: Remove the temporary `_rawImages` property before saving.

### [Other]
#### [MODIFY] [products table.csv](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/assets/products/products table.csv)
- Update sample CSV to demonstrate multiple images (e.g., `"front.jpg, back.jpg"`).

## Verification Plan
1. **Manual Verification**:
    - Update `products table.csv` with a row having `"p1.jpg, p1_detail.jpg"`.
    - Select two dummy images (`p1.jpg` and `p1_detail.jpg`) in the dashboard.
    - Import the CSV.
    - Verify that the imported product has both images in the details view.
