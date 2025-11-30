import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Review {
    productId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReturnRequest {
    reason: string;
    type: "refund" | "exchange";
    notes: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "returned";
    paymentMethod: "esewa" | "khalti" | "cod" | "card";
    paymentDetails?: {
        transactionId?: string;
        paidAmount: number;
    };
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };
    createdAt: string;
    reviews?: Review[];
    returnRequest?: ReturnRequest;
}

interface OrdersContextType {
    orders: Order[];
    createOrder: (
        items: OrderItem[],
        total: number,
        shippingAddress: Order["shippingAddress"],
        paymentMethod: Order["paymentMethod"],
        transactionId?: string
    ) => Order;
    getOrderById: (orderId: string) => Order | undefined;
    getUserOrders: (userId: string) => Order[];
    submitReview: (orderId: string, productId: string, rating: number, comment: string) => void;
    requestReturn: (orderId: string, reason: string, type: "refund" | "exchange", notes: string) => void;
    // Admin-only methods
    getAllOrders: () => Order[];
    updateOrderStatus: (orderId: string, status: Order["status"]) => boolean;
    deleteOrder: (orderId: string) => boolean;
    getOrderStats: () => {
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
        deliveredOrders: number;
    };
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("orders", JSON.stringify(orders));
    }, [orders]);

    const createOrder = (
        items: OrderItem[],
        total: number,
        shippingAddress: Order["shippingAddress"],
        paymentMethod: Order["paymentMethod"],
        transactionId?: string
    ): Order => {
        // Allow guest checkout
        const userId = user ? user.id : "guest";

        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            userId,
            items,
            total,
            status: "pending",
            paymentMethod,
            paymentDetails: transactionId
                ? {
                    transactionId,
                    paidAmount: total,
                }
                : undefined,
            shippingAddress,
            createdAt: new Date().toISOString(),
            reviews: [],
        };

        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
    };

    const getOrderById = (orderId: string): Order | undefined => {
        return orders.find((order) => order.id === orderId);
    };

    const getUserOrders = (userId: string): Order[] => {
        return orders.filter((order) => order.userId === userId);
    };

    const submitReview = (
        orderId: string,
        productId: string,
        rating: number,
        comment: string
    ) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id === orderId) {
                    const review: Review = {
                        productId,
                        rating,
                        comment,
                        createdAt: new Date().toISOString(),
                    };
                    return {
                        ...order,
                        reviews: [...(order.reviews || []), review],
                    };
                }
                return order;
            })
        );
    };

    const requestReturn = (
        orderId: string,
        reason: string,
        type: "refund" | "exchange",
        notes: string
    ) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id === orderId) {
                    const returnRequest: ReturnRequest = {
                        reason,
                        type,
                        notes,
                        status: "pending",
                        createdAt: new Date().toISOString(),
                    };
                    return {
                        ...order,
                        returnRequest,
                    };
                }
                return order;
            })
        );
    };

    // Admin-only methods
    const getAllOrders = (): Order[] => {
        return orders;
    };

    const updateOrderStatus = (orderId: string, status: Order["status"]): boolean => {
        const orderExists = orders.some((order) => order.id === orderId);
        if (!orderExists) return false;

        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status } : order
            )
        );
        return true;
    };

    const deleteOrder = (orderId: string): boolean => {
        const orderExists = orders.some((order) => order.id === orderId);
        if (!orderExists) return false;

        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        return true;
    };

    const getOrderStats = () => {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter((order) => order.status === "pending").length;
        const deliveredOrders = orders.filter((order) => order.status === "delivered").length;

        return {
            totalOrders,
            totalRevenue,
            pendingOrders,
            deliveredOrders,
        };
    };

    return (
        <OrdersContext.Provider
            value={{
                orders,
                createOrder,
                getOrderById,
                getUserOrders,
                submitReview,
                requestReturn,
                // Admin methods
                getAllOrders,
                updateOrderStatus,
                deleteOrder,
                getOrderStats,
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
