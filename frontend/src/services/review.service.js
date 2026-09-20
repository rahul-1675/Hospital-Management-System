import { apiClient } from './api';

export const reviewService = {
    // Fetch all published reviews with optional filters (rating, doctor, hospital, page)
    getReviews: async (params = {}) => {
        try {
            const res = await apiClient.get('/reviews', { params });
            return res.data || { data: [], stats: { totalReviews: 0, averageRating: 0, distribution: {} } };
        } catch (err) {
            console.warn('Failed to fetch reviews:', err);
            return { data: [], stats: { totalReviews: 0, averageRating: 0, distribution: {} } };
        }
    },

    // Submit a review for a completed appointment
    submitReview: async (reviewData) => {
        try {
            const res = await apiClient.post('/reviews', reviewData);
            return res.data;
        } catch (err) {
            console.error('Failed to submit review:', err);
            const msg = err.response?.data?.message || err.message || 'Unable to submit your review right now.';
            throw new Error(msg);
        }
    },

    // Get reviews specifically for a doctor
    getDoctorReviews: async (doctorId) => {
        try {
            const res = await apiClient.get(`/reviews/doctor/${doctorId}`);
            return res.data || { data: [], stats: { totalReviews: 0, averageRating: 0 } };
        } catch (err) {
            console.warn(`Failed to fetch reviews for doctor ${doctorId}:`, err);
            return { data: [], stats: { totalReviews: 0, averageRating: 0 } };
        }
    },

    // Get reviews specifically for a hospital
    getHospitalReviews: async (hospitalId) => {
        try {
            const res = await apiClient.get(`/reviews/hospital/${hospitalId}`);
            return res.data || { data: [], stats: { totalReviews: 0, averageRating: 0 } };
        } catch (err) {
            console.warn(`Failed to fetch reviews for hospital ${hospitalId}:`, err);
            return { data: [], stats: { totalReviews: 0, averageRating: 0 } };
        }
    },

    // Get reviews submitted by the logged-in patient
    getPatientReviews: async () => {
        try {
            const res = await apiClient.get('/reviews/patient');
            return Array.isArray(res.data) ? res.data : (res.data?.data || []);
        } catch (err) {
            console.warn('Failed to fetch patient reviews:', err);
            return [];
        }
    },

    // Admin status update
    updateReviewStatus: async (reviewId, status) => {
        try {
            const res = await apiClient.patch(`/reviews/${reviewId}/status`, { status });
            return res.data;
        } catch (err) {
            console.error(`Failed to update review ${reviewId} status:`, err);
            throw err;
        }
    },

    // Delete review
    deleteReview: async (reviewId) => {
        try {
            const res = await apiClient.delete(`/reviews/${reviewId}`);
            return res.data;
        } catch (err) {
            console.error(`Failed to delete review ${reviewId}:`, err);
            throw err;
        }
    }
};
