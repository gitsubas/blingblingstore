import apiClient from './apiClient';

export const authService = {
    // Register new user
    register: async (data: { name: string; email: string; password: string }) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    // Login user
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    // Get current user profile
    getMe: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data: {
        name?: string;
        email?: string;
        profilePicture?: string;
        addresses?: any[];
    }) => {
        const response = await apiClient.put('/auth/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (oldPassword: string, newPassword: string) => {
        const response = await apiClient.put('/auth/password', { oldPassword, newPassword });
        return response.data;
    },

    // Address management
    getAddresses: async () => {
        const response = await apiClient.get('/auth/addresses');
        return response.data;
    },

    createAddress: async (data: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault?: boolean;
    }) => {
        const response = await apiClient.post('/auth/addresses', data);
        return response.data;
    },

    updateAddress: async (id: string, data: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        isDefault?: boolean;
    }) => {
        const response = await apiClient.put(`/auth/addresses/${id}`, data);
        return response.data;
    },

    deleteAddress: async (id: string) => {
        const response = await apiClient.delete(`/auth/addresses/${id}`);
        return response.data;
    },

    setDefaultAddress: async (id: string) => {
        const response = await apiClient.patch(`/auth/addresses/${id}/default`);
        return response.data;
    },
};
