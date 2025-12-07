import React, { createContext, useContext, useState, useEffect } from "react";

export interface ProductAttribute {
    name: string;
    values: string[];
}

export interface ProductVariant {
    id: string;
    attributes: { [key: string]: string }; // e.g. { "Size": "M", "Color": "Red" }
    price: number;
    stock: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    images?: string[]; // Multiple images for gallery
    description: string;
    rating?: number;
    reviews?: number;
    stock?: number; // Available quantity (overall or default)
    lowStockThreshold?: number; // Threshold for low stock warning (default: 5)
    attributes?: ProductAttribute[];
    variants?: ProductVariant[];
}

export interface CartItem extends Product {
    quantity: number;
    selectedVariant?: ProductVariant;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, variant?: ProductVariant) => void;
    removeFromCart: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    lastAddedItem: CartItem | null;
    clearLastAddedItem: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage");
            }
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, variant?: ProductVariant) => {
        // Determine stock based on variant or base product
        const stock = variant ? variant.stock : (product.stock ?? Infinity);

        if (stock === 0) {
            console.warn(`Cannot add ${product.name} to cart: out of stock`);
            return;
        }

        setItems((prev) => {
            // Find existing item matching product ID AND variant ID (if applicable)
            const existing = prev.find((item) =>
                item.id === product.id &&
                item.selectedVariant?.id === variant?.id
            );

            if (existing) {
                // Check if adding one more would exceed stock
                if (existing.quantity >= stock) {
                    console.warn(`Cannot add more ${product.name}: only ${stock} available`);
                    return prev; // Don't add if at stock limit
                }

                const updated = prev.map((item) =>
                    (item.id === product.id && item.selectedVariant?.id === variant?.id)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                const updatedItem = updated.find((item) => item.id === product.id && item.selectedVariant?.id === variant?.id);
                if (updatedItem) setLastAddedItem(updatedItem);
                return updated;
            }

            // Create new item with variant info if present
            // If variant exists, use variant price, otherwise base price
            const price = variant ? variant.price : product.price;

            const newItem: CartItem = {
                ...product,
                price, // Override price with variant price if applicable
                quantity: 1,
                selectedVariant: variant
            };
            setLastAddedItem(newItem);
            return [...prev, newItem];
        });
    };

    const removeFromCart = (productId: string, variantId?: string) => {
        setItems((prev) => prev.filter((item) =>
            !(item.id === productId && item.selectedVariant?.id === variantId)
        ));
    };

    const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
        if (quantity < 1) return;

        setItems((prev) =>
            prev.map((item) => {
                if (item.id === productId && item.selectedVariant?.id === variantId) {
                    const stock = item.selectedVariant ? item.selectedVariant.stock : (item.stock ?? Infinity);
                    // Don't allow quantity to exceed available stock
                    const newQuantity = Math.min(quantity, stock);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => setItems([]);

    const clearLastAddedItem = () => setLastAddedItem(null);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                itemCount,
                lastAddedItem,
                clearLastAddedItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
