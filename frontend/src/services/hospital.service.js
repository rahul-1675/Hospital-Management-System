import { apiClient } from './api';

export const hospitalService = {
    getHospitals: async (params = {}) => {
        try {
            const query = new URLSearchParams();
            if (params.search) query.append('search', params.search);
            if (params.city && params.city !== 'All') query.append('city', params.city);
            if (params.specialty && params.specialty !== 'All') query.append('specialty', params.specialty);
            if (params.lat && params.lng) {
                query.append('lat', params.lat);
                query.append('lng', params.lng);
                if (params.radius) query.append('radius', params.radius);
            }

            const queryString = query.toString() ? `?${query.toString()}` : '';
            const res = await apiClient.get(`/hospitals${queryString}`);
            if (Array.isArray(res?.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        } catch (err) {
            console.warn('Failed to fetch hospitals from backend:', err);
            return [];
        }
    },

    getHospitalById: async (id) => {
        try {
            const res = await apiClient.get(`/hospitals/${id}`);
            return res?.data || res || null;
        } catch (err) {
            console.warn(`Failed to fetch hospital ${id}:`, err);
            return null;
        }
    },

    getSpecialties: async () => {
        try {
            const res = await apiClient.get('/specialties');
            if (Array.isArray(res?.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        } catch (err) {
            console.warn('Failed to fetch specialties from backend:', err);
            return [];
        }
    }
};
