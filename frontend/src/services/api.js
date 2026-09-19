// frontend/src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = {
    request: async (endpoint, options = {}) => {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMessage = data?.message || `Request failed with status ${response.status}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            console.warn(`[API Client Error] ${options.method || 'GET'} ${url}:`, error.message);
            throw error;
        }
    },

    get: (endpoint, options = {}) => {
        return apiClient.request(endpoint, { ...options, method: 'GET' });
    },

    post: (endpoint, body, options = {}) => {
        return apiClient.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put: (endpoint, body, options = {}) => {
        return apiClient.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    patch: (endpoint, body, options = {}) => {
        return apiClient.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    },

    delete: (endpoint, options = {}) => {
        return apiClient.request(endpoint, { ...options, method: 'DELETE' });
    }
};
