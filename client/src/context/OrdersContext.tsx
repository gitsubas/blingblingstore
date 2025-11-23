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
    createOrder: (items: OrderItem[], total: number, shippingAddress: Order["shippingAddress"]) => Order;
    getOrderById: (orderId: string) => Order | undefined;
    getUserOrders: (userId: string) => Order[];
    submitReview: (orderId: string, productId: string, rating: number, comment: string) => void;
    requestReturn: (orderId: string, reason: string, type: "refund" | "exchange", notes: string) => void;
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
        shippingAddress: Order["shippingAddress"]
    ): Order => {
        if (!user) throw new Error("User must be logged in to create an order");

        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            userId: user.id,
            items,
            total,
            status: "pending",
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

    return (
        <OrdersContext.Provider
            value={{
                orders,
                createOrder,
                getOrderById,
                getUserOrders,
                submitReview,
                requestReturn,
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
