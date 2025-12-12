import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor - add JWT token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle specific error codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Could dispatch a logout action or redirect here
                    console.error('Unauthorized - please login again');
                    break;
                case 403:
                    console.error('Forbidden - insufficient permissions');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Server error - please try again later');
                    break;
                default:
                    console.error('An error occurred:', error.response.data.message || error.message);
            }
        } else if (error.request) {
            console.error('No response from server - check your connection');
        } else {
            console.error('Request error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
