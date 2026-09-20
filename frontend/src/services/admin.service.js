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

    approveUser: async (id) => {
        try {
            return await apiClient.patch(`/admin/users/${id}/approve`);
        } catch (err) {
            console.warn('Failed to approve user on backend', err);
            throw err;
        }
    },

    rejectUser: async (id) => {
        try {
            return await apiClient.patch(`/admin/users/${id}/reject`);
        } catch (err) {
            console.warn('Failed to reject user on backend', err);
            throw err;
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

    clearLogs: async () => {
        try {
            return await apiClient.delete('/admin/logs');
        } catch (err) {
            console.warn('Failed to clear logs on backend', err);
            throw err;
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

    deleteInvoice: async (id) => {
        try {
            return await apiClient.delete(`/admin/invoices/${id}`);
        } catch (err) {
            console.warn('Failed to delete invoice on backend', err);
            throw err;
        }
    },

    deleteAppointment: async (id) => {
        try {
            return await apiClient.delete(`/admin/appointments/${id}`);
        } catch (err) {
            console.warn('Failed to delete appointment on backend', err);
            throw err;
        }
    },

    purgeData: async (target) => {
        try {
            return await apiClient.post('/admin/purge-data', { target });
        } catch (err) {
            console.warn('Failed to purge data on backend', err);
            throw err;
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

    refundInvoice: async (id) => {
        try {
            return await apiClient.patch(`/admin/invoices/${id}/refund`);
        } catch (err) {
            console.warn('Failed to refund invoice on backend', err);
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
    },

    getPatientRemovalRequests: async () => {
        try {
            const res = await apiClient.get('/admin/patient-removal-requests');
            const data = res?.data || res;
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.warn('Failed to fetch patient removal requests on admin service', err);
            return [];
        }
    },

    approvePatientRemoval: async (id, adminNote) => {
        try {
            return await apiClient.patch(`/admin/patient-removal-requests/${id}/approve`, { adminNote });
        } catch (err) {
            console.warn('Failed to approve patient removal on admin service', err);
            throw err;
        }
    },

    rejectPatientRemoval: async (id, adminNote) => {
        try {
            return await apiClient.patch(`/admin/patient-removal-requests/${id}/reject`, { adminNote });
        } catch (err) {
            console.warn('Failed to reject patient removal on admin service', err);
            throw err;
        }
    }
};
