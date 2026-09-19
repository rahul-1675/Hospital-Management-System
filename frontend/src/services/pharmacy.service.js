import { apiClient } from './api';

export const pharmacyService = {
    getInventory: async () => {
        try {
            const res = await apiClient.get('/pharmacy/inventory');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch inventory from backend', err);
            return null;
        }
    },

    addMedicine: async (medicineData) => {
        try {
            return await apiClient.post('/pharmacy/inventory', medicineData);
        } catch (err) {
            console.warn('Failed to add medicine on backend', err);
            return null;
        }
    },

    updateMedicine: async (id, updates) => {
        try {
            return await apiClient.put(`/pharmacy/inventory/${id}`, updates);
        } catch (err) {
            console.warn('Failed to update medicine on backend', err);
            return null;
        }
    },

    deleteMedicine: async (id) => {
        try {
            return await apiClient.delete(`/pharmacy/inventory/${id}`);
        } catch (err) {
            console.warn('Failed to delete medicine on backend', err);
            return null;
        }
    },

    getPrescriptions: async () => {
        try {
            const res = await apiClient.get('/pharmacy/prescriptions');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch prescriptions from backend', err);
            return null;
        }
    },

    dispensePrescription: async (id) => {
        try {
            return await apiClient.patch(`/pharmacy/prescriptions/${id}/dispense`);
        } catch (err) {
            console.warn('Failed to dispense prescription on backend', err);
            return null;
        }
    }
};
