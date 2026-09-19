import mongoose from 'mongoose';

const SpecialtySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Specialty name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    icon: {
        type: String,
        default: 'Stethoscope'
    },
    description: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        required: true
    },
    isDemoData: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Specialty = mongoose.models.Specialty || mongoose.model('Specialty', SpecialtySchema);
