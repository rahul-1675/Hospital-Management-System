import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    qualifications: {
        type: String,
        default: 'MBBS, MD'
    },
    experienceYears: {
        type: Number,
        default: 10
    },
    consultationFee: {
        type: Number,
        default: 50
    },
    roomNumber: {
        type: String,
        default: 'OPD-101'
    },
    bio: {
        type: String,
        default: ''
    },
    languages: [{
        type: String,
        default: ['English']
    }],
    rating: {
        type: Number,
        default: 4.9,
        min: 1,
        max: 5
    },
    reviewsCount: {
        type: Number,
        default: 85
    },
    slotDurationMinutes: {
        type: Number,
        default: 30
    },
    weeklySchedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        startTime: { type: String, default: '09:00' }, // 24hr format
        endTime: { type: String, default: '17:00' },
        lunchStart: { type: String, default: '13:00' },
        lunchEnd: { type: String, default: '14:00' },
        isWorking: { type: Boolean, default: true }
    }],
    leaveDates: [{
        type: String // YYYY-MM-DD
    }],
    isAvailableToday: {
        type: Boolean,
        default: true
    },
    isDemoData: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

DoctorSchema.index({ name: 'text', department: 'text', qualifications: 'text' });

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
