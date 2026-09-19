import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required']
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'receptionist', 'pharmacy', 'staff', 'admin'],
        default: 'patient'
    },
    phone: {
        type: String,
        default: ''
    },
    staffId: {
        type: String,
        default: ''
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    },
    savedHospitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    }],
    savedDoctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    notifications: [{
        id: { type: String, default: () => Date.now().toString() },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ['APPOINTMENT', 'CONFIRMATION', 'CANCELLATION', 'REMINDER', 'SYSTEM'], default: 'APPOINTMENT' },
        date: { type: String, default: () => new Date().toISOString() },
        read: { type: Boolean, default: false }
    }],
    isDemoData: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
