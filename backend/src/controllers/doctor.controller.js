import { db } from '../data/store.js';

export const doctorController = {
    getDoctorAppointments: (req, res) => {
        const { doctorName } = req.query;
        let appointments = db.get('appointments') || [];
        if (doctorName) {
            appointments = appointments.filter(a => a.doctorName?.toLowerCase().includes(doctorName.toLowerCase()));
        }
        return res.json({ success: true, data: appointments });
    },

    getDoctorQueue: (req, res) => {
        const { doctorName } = req.params;
        const queueState = db.get('queueState') || { doctors: {} };
        const docQueue = queueState.doctors[doctorName] || { status: 'AVAILABLE', current: null, waiting: [] };
        return res.json({ success: true, data: docQueue });
    },

    createPrescription: (req, res) => {
        try {
            const rxData = req.body;
            const newRx = {
                ...rxData,
                id: rxData.id || `RX-${Date.now().toString().slice(-6)}`,
                date: rxData.date || new Date().toISOString().split('T')[0],
                status: 'Pending'
            };
            db.update('prescriptions', (prev = []) => [newRx, ...prev]);
            return res.status(201).json({ success: true, data: newRx });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
