import { apiClient } from './api';

const DEFAULT_FEEDBACK = [
    { id: 1, name: 'John Doe', rating: 5, comment: 'Excellent service and very friendly staff!', department: 'Cardiology', date: '2026-03-15' },
    { id: 2, name: 'Jane Smith', rating: 4, comment: 'Good overall experience, clean premises and helpful doctors.', department: 'Pediatrics', date: '2026-03-12' },
    { id: 3, name: 'Robert Chen', rating: 5, comment: 'Quick pharmacy dispensing and clear consultation.', department: 'Pharmacy', date: '2026-03-10' }
];

export const feedbackService = {
    getFeedbacks: async () => {
        try {
            const res = await apiClient.get('/feedback');
            if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                return res.data;
            }
        } catch (err) {
            console.warn('Backend feedback fetch failed, using cached/fallback feedback:', err.message);
        }
        
        try {
            const cached = localStorage.getItem('hms_feedback_cache');
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (_) {}
        
        return DEFAULT_FEEDBACK;
    },

    submitFeedback: async (feedbackData) => {
        const item = {
            ...feedbackData,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };

        try {
            const res = await apiClient.post('/feedback', feedbackData);
            if (res && res.data) {
                return res.data;
            }
        } catch (err) {
            console.warn('Backend feedback submission failed, saving locally:', err.message);
        }

        try {
            const cached = JSON.parse(localStorage.getItem('hms_feedback_cache') || '[]');
            const updated = [item, ...(cached.length ? cached : DEFAULT_FEEDBACK)];
            localStorage.setItem('hms_feedback_cache', JSON.stringify(updated));
        } catch (_) {}

        return item;
    }
};
