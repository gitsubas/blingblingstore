import { z } from 'zod';

// Create product schema
export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    categoryId: z.string().uuid('Invalid category ID'),
    stock: z.number().int().nonnegative('Stock cannot be negative').optional(),
    featured: z.boolean().optional(),
    lowStockThreshold: z.number().int().positive().optional(),
    variants: z.array(z.object({
        attributes: z.record(z.string()), // Flexible attributes object
        price: z.number().positive('Variant price must be positive'),
        stock: z.number().int().nonnegative('Variant stock cannot be negative')
    })).optional()
});

// Update product schema
export const updateProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().positive('Price must be positive').optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    stock: z.number().int().nonnegative('Stock cannot be negative').optional(),
    featured: z.boolean().optional(),
    lowStockThreshold: z.number().int().positive().optional()
});

// Create category schema
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required')
});

// Create review schema
export const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().optional()
});
