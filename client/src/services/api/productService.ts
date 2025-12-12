import apiClient from './apiClient';

// Transform backend product to match frontend interface
const transformProduct = (backendProduct: any) => {
    return {
        ...backendProduct,
        category: backendProduct.category?.name || backendProduct.category,
        image: backendProduct.images?.[0]?.url || '',
        images: backendProduct.images?.map((img: any) => img.url) || []
    };
};

export const productService = {
    // Get all products with optional filters
    getProducts: async (params?: {
        category?: string;
        search?: string;
        sort?: string;
    }) => {
        const response = await apiClient.get('/products', { params });
        return {
            ...response.data,
            products: response.data.products.map(transformProduct)
        };
    },

    // Get single product by ID
    getProductById: async (id: string) => {
        const response = await apiClient.get(`/products/${id}`);
        return {
            ...response.data,
            product: transformProduct(response.data.product)
        };
    },

    // Get featured products
    getFeaturedProducts: async () => {
        const response = await apiClient.get('/products/featured');
        return {
            ...response.data,
            products: response.data.products.map(transformProduct)
        };
    },

    // Get all categories
    getCategories: async () => {
        const response = await apiClient.get('/products/categories');
        return response.data;
    },

    // Admin-only: Create product
    createProduct: async (data: FormData) => {
        const response = await apiClient.post('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Admin-only: Update product
    updateProduct: async (id: string, data: any) => {
        const response = await apiClient.put(`/products/${id}`, data);
        return response.data;
    },

    // Admin-only: Delete product
    deleteProduct: async (id: string) => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },

    // Admin-only: Create category
    createCategory: async (name: string) => {
        const response = await apiClient.post('/products/categories', { name });
        return response.data;
    },
};
