import { db } from '../data/store.js';

export const receptionController = {
    getAppointments: (req, res) => {
        const appointments = db.get('appointments') || [];
        return res.json({ success: true, data: appointments });
    },

    createAppointment: (req, res) => {
        try {
            const data = req.body;
            const appointments = db.get('appointments') || [];
            const newAppointment = {
                ...data,
                id: Date.now(),
                status: data.status || 'scheduled'
            };
            db.update('appointments', (prev = []) => [newAppointment, ...prev]);
            return res.status(201).json({ success: true, data: newAppointment });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateAppointment: (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            let updated = null;
            db.update('appointments', (prev = []) =>
                prev.map(app => {
                    if (String(app.id) === String(id)) {
                        updated = { ...app, ...updates };
                        return updated;
                    }
                    return app;
                })
            );
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Appointment not found' });
            }
            return res.json({ success: true, data: updated });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    cancelAppointment: (req, res) => {
        try {
            const { id } = req.params;
            db.update('appointments', (prev = []) =>
                prev.map(app => (String(app.id) === String(id) ? { ...app, status: 'cancelled' } : app))
            );
            return res.json({ success: true, message: 'Appointment cancelled' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getQueueState: (req, res) => {
        const queueState = db.get('queueState') || { doctors: {} };
        return res.json({ success: true, data: queueState });
    },

    updateQueueState: (req, res) => {
        try {
            const newQueueState = req.body;
            db.set('queueState', newQueueState);
            return res.json({ success: true, data: newQueueState });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getInvoices: (req, res) => {
        const invoices = db.get('invoices') || [];
        return res.json({ success: true, data: invoices });
    },

    createInvoice: (req, res) => {
        try {
            const invoiceData = req.body;
            const newInvoice = {
                ...invoiceData,
                id: invoiceData.id || `INV-${Date.now().toString().slice(-6)}`,
                date: invoiceData.date || new Date().toISOString().split('T')[0],
                status: invoiceData.status || 'Pending'
            };
            db.update('invoices', (prev = []) => [newInvoice, ...prev]);
            return res.status(201).json({ success: true, data: newInvoice });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
