
import prisma from '../../utils/prisma';
import { Role } from '@prisma/client';

// Get all users with pagination and search
export const getAllUsers = async (
    page: number = 1,
    limit: number = 10,
    search?: string
) => {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
                // Exclude password
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
    ]);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

// Update user role
export const updateUserRole = async (userId: string, role: 'CUSTOMER' | 'ADMIN') => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: role as Role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return updatedUser;
};

// Delete user
export const deleteUser = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    await prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted successfully' };
};

// Get order statistics
export const getOrderStatistics = async () => {
    const [
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders
    ] = await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { total: true }
        }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { status: 'PROCESSING' } }),
        prisma.order.count({ where: { status: 'SHIPPED' } }),
        prisma.order.count({ where: { status: 'DELIVERED' } }),
        prisma.order.count({ where: { status: 'CANCELLED' } })
    ]);

    return {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders
    };
};

// Bulk import products from CSV data
export const bulkImportProducts = async (productsData: any[]) => {
    const imported = [];
    const errors = [];

    for (const productData of productsData) {
        try {
            // Validate required fields
            if (!productData.name || !productData.price || !productData.categoryId) {
                errors.push({
                    product: productData.name || 'Unknown',
                    error: 'Missing required fields: name, price, or categoryId'
                });
                continue;
            }

            // Check if category exists
            const category = await prisma.category.findUnique({
                where: { id: productData.categoryId }
            });

            if (!category) {
                errors.push({
                    product: productData.name,
                    error: `Category ID ${productData.categoryId} not found`
                });
                continue;
            }

            // Create product
            const product = await prisma.product.create({
                data: {
                    name: productData.name,
                    description: productData.description || '',
                    price: parseFloat(productData.price),
                    categoryId: productData.categoryId,
                    stock: parseInt(productData.stock || '0'),
                    featured: productData.featured === 'true' || productData.featured === true,
                    lowStockThreshold: parseInt(productData.lowStockThreshold || '5'),
                    rating: productData.rating ? parseFloat(productData.rating) : null,
                    reviewCount: parseInt(productData.reviewCount || '0')
                }
            });

            imported.push(product);
        } catch (error: any) {
            errors.push({
                product: productData.name || 'Unknown',
                error: error.message
            });
        }
    }

    return {
        imported: imported.length,
        failed: errors.length,
        errors
    };
};
