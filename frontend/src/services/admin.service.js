import { apiClient } from './api';

export const adminService = {
    getUsers: async () => {
        try {
            const res = await apiClient.get('/admin/users');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch users from backend, using fallback', err);
            return null;
        }
    },

    addUser: async (userData) => {
        try {
            return await apiClient.post('/admin/users', userData);
        } catch (err) {
            console.warn('Failed to add user to backend', err);
            return null;
        }
    },

    updateUser: async (id, updates) => {
        try {
            return await apiClient.put(`/admin/users/${id}`, updates);
        } catch (err) {
            console.warn('Failed to update user on backend', err);
            return null;
        }
    },

    deleteUser: async (id) => {
        try {
            return await apiClient.delete(`/admin/users/${id}`);
        } catch (err) {
            console.warn('Failed to delete user on backend', err);
            return null;
        }
    },

    toggleUserStatus: async (id) => {
        try {
            return await apiClient.patch(`/admin/users/${id}/status`);
        } catch (err) {
            console.warn('Failed to toggle status on backend', err);
            return null;
        }
    },

    getLogs: async () => {
        try {
            const res = await apiClient.get('/admin/logs');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch logs from backend', err);
            return null;
        }
    },

    getInvoices: async () => {
        try {
            const res = await apiClient.get('/admin/invoices');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch invoices from backend', err);
            return null;
        }
    },

    markInvoicePaid: async (id) => {
        try {
            return await apiClient.patch(`/admin/invoices/${id}/pay`);
        } catch (err) {
            console.warn('Failed to mark invoice paid on backend', err);
            return null;
        }
    },

    getOverviewStats: async () => {
        try {
            const res = await apiClient.get('/admin/overview-stats');
            return res.data || null;
        } catch (err) {
            console.warn('Failed to fetch overview stats from backend', err);
            return null;
        }
    },

    getSettings: async () => {
        try {
            const res = await apiClient.get('/admin/settings');
            return res.data || null;
        } catch (err) {
            console.warn('Failed to fetch settings from backend', err);
            return null;
        }
    },

    updateSettings: async (settingsData) => {
        try {
            const res = await apiClient.put('/admin/settings', settingsData);
            return res;
        } catch (err) {
            console.warn('Failed to update settings on backend', err);
            throw err;
        }
    }
};
