import { apiClient } from './api';

export const appointmentService = {
    createAppointment: async (appointmentData) => {
        try {
            return await apiClient.post('/appointments', appointmentData);
        } catch (err) {
            console.warn('Failed to submit appointment to backend:', err);
            throw err;
        }
    },

    getPatientAppointments: async () => {
        try {
            const res = await apiClient.get('/appointments/patient');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch patient appointments:', err);
            return [];
        }
    },

    getAppointmentById: async (id) => {
        try {
            const res = await apiClient.get(`/appointments/${id}`);
            return res.data || null;
        } catch (err) {
            console.warn(`Failed to fetch appointment ${id}:`, err);
            return null;
        }
    }
};
