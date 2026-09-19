import { apiClient } from './api';

export const receptionService = {
    getAppointments: async () => {
        try {
            const res = await apiClient.get('/reception/appointments');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch appointments from backend', err);
            return null;
        }
    },

    createAppointment: async (appointmentData) => {
        try {
            return await apiClient.post('/reception/appointments', appointmentData);
        } catch (err) {
            console.warn('Failed to create appointment on backend', err);
            return null;
        }
    },

    updateAppointment: async (id, updates) => {
        try {
            return await apiClient.put(`/reception/appointments/${id}`, updates);
        } catch (err) {
            console.warn('Failed to update appointment on backend', err);
            return null;
        }
    },

    cancelAppointment: async (id) => {
        try {
            return await apiClient.delete(`/reception/appointments/${id}`);
        } catch (err) {
            console.warn('Failed to cancel appointment on backend', err);
            return null;
        }
    },

    getQueueState: async () => {
        try {
            const res = await apiClient.get('/reception/queue');
            return res.data || null;
        } catch (err) {
            console.warn('Failed to fetch queue state from backend', err);
            return null;
        }
    },

    updateQueueState: async (queueState) => {
        try {
            return await apiClient.put('/reception/queue', queueState);
        } catch (err) {
            console.warn('Failed to update queue on backend', err);
            return null;
        }
    },

    getInvoices: async () => {
        try {
            const res = await apiClient.get('/reception/invoices');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch reception invoices from backend', err);
            return null;
        }
    },

    createInvoice: async (invoiceData) => {
        try {
            return await apiClient.post('/reception/invoices', invoiceData);
        } catch (err) {
            console.warn('Failed to create invoice on backend', err);
            return null;
        }
    }
};
