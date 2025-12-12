import apiClient from './apiClient';

export const orderService = {
    // Create new order
    createOrder: async (data: {
        items: { productId: string; quantity: number }[];
        shippingAddress: {
            fullName: string;
            address: string;
            city: string;
            postalCode: string;
            phone: string;
        };
        paymentMethod: 'COD' | 'KHALTI' | 'ESEWA';
    }) => {
        const response = await apiClient.post('/orders', data);
        return response.data;
    },

    // Get user's orders
    getUserOrders: async () => {
        const response = await apiClient.get('/orders/my-orders');
        return response.data;
    },

    // Get single order by ID
    getOrderById: async (id: string) => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },

    // Cancel order
    cancelOrder: async (id: string) => {
        const response = await apiClient.put(`/orders/${id}/cancel`);
        return response.data;
    },

    // Request return
    requestReturn: async (orderId: string, reason: string) => {
        const response = await apiClient.post(`/orders/${orderId}/return`, { reason });
        return response.data;
    },
};
