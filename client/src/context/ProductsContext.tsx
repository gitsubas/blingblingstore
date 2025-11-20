import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./CartContext";
import { products as initialProducts } from "../data/products";

interface ProductsContextType {
    products: Product[];
    addProduct: (product: Omit<Product, "id">) => void;
    updateProduct: (id: string, product: Omit<Product, "id">) => void;
    deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);

    // Load products from local storage on mount
    useEffect(() => {
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
            try {
                setProducts(JSON.parse(savedProducts));
            } catch (e) {
                console.error("Failed to parse products from local storage");
                setProducts(initialProducts);
            }
        } else {
            setProducts(initialProducts);
        }
    }, []);

    // Save products to local storage on change
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem("products", JSON.stringify(products));
        }
    }, [products]);

    const addProduct = (product: Omit<Product, "id">) => {
        const newProduct: Product = {
            ...product,
            id: Date.now().toString(),
        };
        setProducts((prev) => [...prev, newProduct]);
    };

    const updateProduct = (id: string, product: Omit<Product, "id">) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...product, id } : p))
        );
    };

    const deleteProduct = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                addProduct,
                updateProduct,
                deleteProduct,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return context;
}
