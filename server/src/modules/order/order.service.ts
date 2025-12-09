
import prisma from '../../utils/prisma';
import { Prisma } from '@prisma/client';

export const createOrder = async (
    userId: string,
    items: { productId: string; quantity: number }[],
    shippingAddress: any,
    paymentMethod: string
) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Calculate total and validate stock
        let total = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await tx.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }

            total += product.price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });

            // 2. Deduct stock
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: product.stock - item.quantity },
            });
        }

        // 3. Create Order
        const order = await tx.order.create({
            data: {
                userId,
                total,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                paymentMethod,
                shippingAddress: shippingAddress,
                items: {
                    create: orderItemsData,
                },
                timeline: {
                    create: {
                        status: 'PENDING',
                        note: 'Order placed successfully',
                    },
                },
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                timeline: true,
            },
        });

        return order;
    });
};

export const getUserOrders = async (userId: string) => {
    return await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            timeline: true,
        },
    });
};

export const getOrderById = async (orderId: string) => {
    return await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            timeline: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const cancelOrder = async (orderId: string, userId: string) => {
    return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) throw new Error('Order not found');
        if (order.userId !== userId) throw new Error('Unauthorized'); // Use Admin check for admin cancellations
        if (!['PENDING', 'PROCESSING'].includes(order.status)) {
            throw new Error('Order cannot be cancelled in its current state');
        }

        // 1. Restore Stock
        for (const item of order.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
            });
        }

        // 2. Update Status
        const cancelledOrder = await tx.order.update({
            where: { id: orderId },
            data: {
                status: 'CANCELLED',
                timeline: {
                    create: {
                        status: 'CANCELLED',
                        note: 'Order cancelled by user',
                    },
                },
            },
        });

        return cancelledOrder;
    });
};

// Admin Logic
export const getAllOrders = async (page = 1, limit = 10, status?: string) => {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        }),
        prisma.order.count({ where })
    ]);

    return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status,
            timeline: {
                create: {
                    status,
                    note: note || `Status updated to ${status}`
                }
            }
        }
    })
}

export const requestReturn = async (orderId: string, userId: string, reason: string) => {
    return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');
        if (order.userId !== userId) throw new Error('Unauthorized');
        if (order.status !== 'DELIVERED') throw new Error('Only delivered orders can be returned');

        // Create Return Request
        const returnReq = await tx.returnRequest.create({
            data: {
                orderId,
                reason,
                status: 'PENDING'
            }
        });

        // Update Order Status
        await tx.order.update({
            where: { id: orderId },
            data: {
                status: 'RETURN_REQUESTED',
                timeline: {
                    create: { status: 'RETURN_REQUESTED', note: `Return requested: ${reason}` }
                }
            }
        });

        return returnReq;
    });
};

export const processReturn = async (returnId: string, status: 'APPROVED' | 'REJECTED', restock: boolean = false) => {
    return await prisma.$transaction(async (tx) => {
        const returnReq = await tx.returnRequest.findUnique({ where: { id: returnId }, include: { order: { include: { items: true } } } });
        if (!returnReq) throw new Error('Return request not found');

        // Update Return Status
        await tx.returnRequest.update({
            where: { id: returnId },
            data: { status }
        });

        if (status === 'APPROVED') {
            await tx.order.update({
                where: { id: returnReq.orderId },
                data: {
                    status: 'RETURNED',
                    paymentStatus: 'REFUNDED', // Simplified
                    timeline: { create: { status: 'RETURNED', note: 'Return approved' } }
                }
            });

            if (restock) {
                for (const item of returnReq.order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } }
                    });
                }
            }
        } else {
            await tx.order.update({
                where: { id: returnReq.orderId },
                data: {
                    status: 'DELIVERED', // Revert to delivered if rejected? Or keep as DELIVERED but mark return rejected.
                    timeline: { create: { status: 'DELIVERED', note: 'Return rejected' } }
                }
            });
        }

        return returnReq;
    });
};
