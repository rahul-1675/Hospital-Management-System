import { apiClient } from './api';

export const doctorService = {
    getAppointments: async (doctorName) => {
        try {
            const query = doctorName ? `?doctorName=${encodeURIComponent(doctorName)}` : '';
            const res = await apiClient.get(`/doctor/appointments${query}`);
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch doctor appointments from backend', err);
            return null;
        }
    },

    getQueue: async (doctorName) => {
        try {
            const res = await apiClient.get(`/doctor/queue/${encodeURIComponent(doctorName)}`);
            return res.data || null;
        } catch (err) {
            console.warn('Failed to fetch doctor queue from backend', err);
            return null;
        }
    },

    createPrescription: async (rxData) => {
        try {
            return await apiClient.post('/doctor/prescriptions', rxData);
        } catch (err) {
            console.warn('Failed to submit prescription to backend', err);
            return null;
        }
    }
};
