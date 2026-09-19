import { apiClient } from './api';

export const doctorService = {
    // Public Doctor Discovery & Filtering
    getDoctors: async (params = {}) => {
        try {
            const query = new URLSearchParams();
            if (params.hospital && params.hospital !== 'All') query.append('hospital', params.hospital);
            if (params.specialty && params.specialty !== 'All') query.append('specialty', params.specialty);
            if (params.department && params.department !== 'All') query.append('department', params.department);
            if (params.search) query.append('search', params.search);
            if (params.limit) query.append('limit', params.limit);
            if (params.page) query.append('page', params.page);

            const queryString = query.toString() ? `?${query.toString()}` : '';
            const res = await apiClient.get(`/doctors${queryString}`);
            if (Array.isArray(res?.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        } catch (err) {
            console.warn('Failed to fetch doctors from backend:', err);
            return [];
        }
    },

    getDoctorById: async (id) => {
        try {
            const res = await apiClient.get(`/doctors/${id}`);
            return res?.data || res || null;
        } catch (err) {
            console.warn(`Failed to fetch doctor ${id}:`, err);
            return null;
        }
    },

    getDoctorAvailability: async (doctorId, date) => {
        try {
            const res = await apiClient.get(`/doctors/${doctorId}/availability?date=${date}`);
            return res?.data || res || { slots: [], availableSlotsCount: 0 };
        } catch (err) {
            console.warn(`Failed to fetch availability for doctor ${doctorId}:`, err);
            return { slots: [], availableSlotsCount: 0 };
        }
    },

    // Staff / Doctor Portal Methods
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

