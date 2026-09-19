import mongoose from 'mongoose';
import { Specialty } from '../models/Specialty.js';
import { MOCK_SPECIALTIES } from '../data/mockFallback.js';

export const specialtyController = {
    getSpecialties: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const specialties = await Specialty.find().sort({ name: 1 });
                if (specialties.length > 0) {
                    return res.json({ success: true, data: specialties });
                }
            }
            return res.json({ success: true, data: MOCK_SPECIALTIES });
        } catch (error) {
            return res.json({ success: true, data: MOCK_SPECIALTIES });
        }
    },

    createSpecialty: async (req, res) => {
        try {
            const data = req.body;
            if (!data.slug && data.name) {
                data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            }
            if (mongoose.connection.readyState === 1) {
                const specialty = await Specialty.create(data);
                return res.status(201).json({ success: true, data: specialty });
            }
            const newSpec = { ...data, _id: `spec-${Date.now()}` };
            MOCK_SPECIALTIES.push(newSpec);
            return res.status(201).json({ success: true, data: newSpec });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
