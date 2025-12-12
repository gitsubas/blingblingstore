import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./CartContext";
import { productService } from "../services/api";

interface ProductsContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    addProduct: (product: Omit<Product, "id">) => Promise<string | null>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
    deleteProduct: (id: string) => Promise<boolean>;
    getProductById: (id: string) => Product | undefined;
    getProductsByCategory: (category: string) => Product[];
    getFeaturedProducts: () => Product[];
    refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch products from API on mount
    const refreshProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await productService.getProducts();
            // Backend returns {products: [...]}
            setProducts(response.products || []);
        } catch (err: any) {
            setError(err.message || "Failed to load products");
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    const addProduct = async (productData: Omit<Product, "id">): Promise<string | null> => {
        try {
            // Note: This would typically be FormData for image uploads
            // For now, we'll use the product data as-is
            const { product } = await productService.createProduct(productData as any);
            setProducts(prev => [...prev, product]);
            return product.id;
        } catch (error: any) {
            console.error("Failed to add product:", error);
            setError(error.message || "Failed to add product");
            return null;
        }
    };

    const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
        try {
            const { product } = await productService.updateProduct(id, productData);
            setProducts(prev => prev.map(p => p.id === id ? product : p));
            return true;
        } catch (error: any) {
            console.error("Failed to update product:", error);
            setError(error.message || "Failed to update product");
            return false;
        }
    };

    const deleteProduct = async (id: string): Promise<boolean> => {
        try {
            await productService.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            return true;
        } catch (error: any) {
            console.error("Failed to delete product:", error);
            setError(error.message || "Failed to delete product");
            return false;
        }
    };

    const getProductById = (id: string): Product | undefined => {
        return products.find(p => p.id === id);
    };

    const getProductsByCategory = (category: string): Product[] => {
        return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    };

    const getFeaturedProducts = (): Product[] => {
        return products.filter(p => p.featured === true);
    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                loading,
                error,
                addProduct,
                updateProduct,
                deleteProduct,
                getProductById,
                getProductsByCategory,
                getFeaturedProducts,
                refreshProducts,
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
