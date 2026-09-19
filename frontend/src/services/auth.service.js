import { apiClient } from './api';

export const authService = {
    login: async (arg1, arg2, arg3) => {
        let role, id, password;
        if (arg3 !== undefined) {
            role = arg1;
            id = arg2;
            password = arg3;
        } else {
            id = arg1;
            password = arg2;
        }

        const cleanId = id ? id.trim() : '';
        const payload = {
            id: cleanId,
            email: cleanId.includes('@') ? cleanId : undefined,
            password
        };
        if (role) payload.role = role;

        const res = await apiClient.post('/auth/login', payload);

        if (res.success && res.user) {
            if (res.token) {
                localStorage.setItem('hms_auth_token', res.token);
                localStorage.setItem('hms_token', res.token);
            }
            return {
                ...res.user,
                token: res.token
            };
        }

        throw new Error(res.message || 'Login failed. Please check your credentials.');
    },

    register: async (userData) => {
        const res = await apiClient.post('/auth/register', userData);
        if (res.success && res.user) {
            if (res.token) {
                localStorage.setItem('hms_auth_token', res.token);
                localStorage.setItem('hms_token', res.token);
            }
            return res;
        }
        throw new Error(res.message || 'Registration failed.');
    },

    getCurrentUser: async () => {
        const token = localStorage.getItem('hms_auth_token') || localStorage.getItem('hms_token');
        if (!token) return null;

        try {
            const res = await apiClient.get('/auth/me');
            if (res.success && res.user) {
                return res.user;
            }
        } catch (err) {
            console.warn('Failed to verify session token:', err.message);
            localStorage.removeItem('hms_auth_token');
            localStorage.removeItem('hms_token');
        }
        return null;
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout', {});
        } catch (err) {
            console.warn('Logout API error:', err.message);
        } finally {
            localStorage.removeItem('hms_auth_token');
            localStorage.removeItem('hms_token');
            localStorage.removeItem('hms_user');
            localStorage.removeItem('hms_role');
        }
        return true;
    }
};
