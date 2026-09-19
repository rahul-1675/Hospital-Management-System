import { db } from '../data/store.js';

export const feedbackController = {
    getFeedback: (req, res) => {
        const feedback = db.get('feedback') || [];
        return res.json({ success: true, data: feedback });
    },

    submitFeedback: (req, res) => {
        try {
            const data = req.body;
            const newFeedback = {
                ...data,
                id: Date.now(),
                date: new Date().toISOString().split('T')[0]
            };
            db.update('feedback', (prev = []) => [newFeedback, ...prev]);
            return res.status(201).json({ success: true, data: newFeedback });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
