import { db } from '../data/store.js';

export const pharmacyController = {
    getInventory: (req, res) => {
        const inventory = db.get('inventory') || [];
        return res.json({ success: true, data: inventory });
    },

    addMedicine: (req, res) => {
        try {
            const item = req.body;
            const inventory = db.get('inventory') || [];
            const newItem = {
                ...item,
                id: Date.now(),
                stock: Number(item.stock) || 0,
                price: Number(item.price) || 0,
                minThreshold: Number(item.minThreshold) || 10
            };
            db.update('inventory', (prev = []) => [...prev, newItem]);
            return res.status(201).json({ success: true, data: newItem });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateMedicine: (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            let updated = null;
            db.update('inventory', (prev = []) =>
                prev.map(item => {
                    if (String(item.id) === String(id)) {
                        updated = { ...item, ...updates };
                        return updated;
                    }
                    return item;
                })
            );
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Medicine not found' });
            }
            return res.json({ success: true, data: updated });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteMedicine: (req, res) => {
        try {
            const { id } = req.params;
            db.update('inventory', (prev = []) => prev.filter(item => String(item.id) !== String(id)));
            return res.json({ success: true, message: 'Medicine removed' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getPrescriptions: (req, res) => {
        const prescriptions = db.get('prescriptions') || [];
        return res.json({ success: true, data: prescriptions });
    },

    dispensePrescription: (req, res) => {
        try {
            const { id } = req.params;
            let targetPrescription = null;
            db.update('prescriptions', (prev = []) =>
                prev.map(rx => {
                    if (String(rx.id) === String(id)) {
                        targetPrescription = { ...rx, status: 'Dispensed' };
                        return targetPrescription;
                    }
                    return rx;
                })
            );
            if (!targetPrescription) {
                return res.status(404).json({ success: false, message: 'Prescription not found' });
            }
            return res.json({ success: true, data: targetPrescription });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
