import React, { createContext, useContext, useState, useEffect } from "react";
import { orderService } from "../services/api";

export interface Order {
    id: string;
    userId: string;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    shippingAddress: any;
    createdAt: string;
    updatedAt: string;
    items?: OrderItem[];
    timeline?: OrderTimeline[];
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product?: any;
}

export interface OrderTimeline {
    id: string;
    orderId: string;
    status: string;
    note?: string;
    createdAt: string;
}

interface OrdersContextType {
    orders: Order[];
    loading: boolean;
    error: string | null;
    createOrder: (orderData: any) => Promise<string | null>;
    cancelOrder: (orderId: string) => Promise<boolean>;
    requestReturn: (orderId: string, reason: string) => Promise<boolean>;
    getOrderById: (orderId: string) => Order | undefined;
    refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user orders from API
    const refreshOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const { orders: fetchedOrders } = await orderService.getUserOrders();
            setOrders(fetchedOrders);
        } catch (err: any) {
            // Don't set error if user is not logged in (401)
            if (err.response?.status !== 401) {
                setError(err.message || "Failed to load orders");
                console.error("Failed to fetch orders:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders on mount if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            refreshOrders();
        }
    }, []);

    const createOrder = async (orderData: {
        items: { productId: string; quantity: number }[];
        shippingAddress: any;
        paymentMethod: string;
    }): Promise<string | null> => {
        try {
            const { order } = await orderService.createOrder(orderData);
            setOrders(prev => [order, ...prev]);
            return order.id;
        } catch (error: any) {
            console.error("Failed to create order:", error);
            setError(error.message || "Failed to create order");
            return null;
        }
    };

    const cancelOrder = async (orderId: string): Promise<boolean> => {
        try {
            await orderService.cancelOrder(orderId);
            await refreshOrders(); // Refresh to get updated order
            return true;
        } catch (error: any) {
            console.error("Failed to cancel order:", error);
            setError(error.message || "Failed to cancel order");
            return false;
        }
    };

    const requestReturn = async (orderId: string, reason: string): Promise<boolean> => {
        try {
            await orderService.requestReturn(orderId, reason);
            await refreshOrders(); // Refresh to get updated order
            return true;
        } catch (error: any) {
            console.error("Failed to request return:", error);
            setError(error.message || "Failed to request return");
            return false;
        }
    };

    const getOrderById = (orderId: string): Order | undefined => {
        return orders.find(o => o.id === orderId);
    };

    return (
        <OrdersContext.Provider
            value={{
                orders,
                loading,
                error,
                createOrder,
                cancelOrder,
                requestReturn,
                getOrderById,
                refreshOrders,
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (context === undefined) {
        throw new Error("useOrders must be used within an OrdersProvider");
    }
    return context;
}
