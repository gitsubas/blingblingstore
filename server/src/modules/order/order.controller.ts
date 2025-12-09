
import { Request, Response } from 'express';
import * as orderService from './order.service';

// Place Order
export const placeOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        const order = await orderService.createOrder(userId, items, shippingAddress, paymentMethod);
        res.status(201).json(order);
    } catch (error: any) {
        console.error('Place Order Error:', error);
        res.status(400).json({ message: error.message || 'Failed to place order' });
    }
};

// Get My Orders
export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const orders = await orderService.getUserOrders(userId);
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get Order Details
export const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Authorization check: User can only see their own orders (unless admin - to be refined)
        const userId = (req as any).user.userId;
        // Ideally we check role here too, but for Customer flow:
        if (order.userId !== userId && (req as any).user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel Order
export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const orderId = req.params.id;
        const result = await orderService.cancelOrder(orderId, userId);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Admin: Get All Orders
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;

        const result = await orderService.getAllOrders(page, limit, status);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Admin: Update Status
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { status, note } = req.body;
        const orderId = req.params.id;

        const result = await orderService.updateOrderStatus(orderId, status, note);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const requestReturn = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const orderId = req.params.id;
        const { reason } = req.body;
        const result = await orderService.requestReturn(orderId, userId, reason);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const processReturn = async (req: Request, res: Response) => {
    try {
        const returnId = req.params.returnId;
        const { status, restock } = req.body;
        const result = await orderService.processReturn(returnId, status, restock);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
