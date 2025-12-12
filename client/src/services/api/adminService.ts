import apiClient from './apiClient';

export const adminService = {
    // Get all users (paginated, searchable)
    getUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
    }) => {
        const response = await apiClient.get('/admin/users', { params });
        return response.data;
    },

    // Update user role
    updateUserRole: async (userId: string, role: 'CUSTOMER' | 'ADMIN') => {
        const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    // Delete user
    deleteUser: async (userId: string) => {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Get order statistics
    getOrderStats: async () => {
        const response = await apiClient.get('/admin/orders/stats');
        return response.data;
    },

    // Bulk import products from CSV
    importProducts: async (products: any[]) => {
        const response = await apiClient.post('/admin/products/import', { products });
        return response.data;
    },

    // Get all orders (admin view)
    getAllOrders: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
    }) => {
        const response = await apiClient.get('/admin/orders', { params });
        return response.data;
    },

    // Update order status
    updateOrderStatus: async (orderId: string, status: string, note?: string) => {
        const response = await apiClient.put(`/admin/orders/${orderId}/status`, { status, note });
        return response.data;
    },
};
