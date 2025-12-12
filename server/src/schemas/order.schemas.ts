import { z } from 'zod';

// Create order schema
export const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be positive')
    })).min(1, 'Order must have at least one item'),
    shippingAddress: z.object({
        fullName: z.string().min(1, 'Full name is required'),
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        phone: z.string().min(1, 'Phone is required')
    }),
    paymentMethod: z.enum(['COD', 'KHALTI', 'ESEWA'], {
        errorMap: () => ({ message: 'Invalid payment method' })
    })
});

// Update order status schema
export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED'], {
        errorMap: () => ({ message: 'Invalid order status' })
    }),
    note: z.string().optional()
});

// Request return schema
export const requestReturnSchema = z.object({
    reason: z.string().min(10, 'Return reason must be at least 10 characters')
});

// Process return schema (admin)
export const processReturnSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED'], {
        errorMap: () => ({ message: 'Invalid return status' })
    }),
    restock: z.boolean().optional()
});
