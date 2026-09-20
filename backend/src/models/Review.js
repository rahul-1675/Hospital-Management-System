import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        default: null
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['PUBLISHED', 'PENDING', 'HIDDEN'],
        default: 'PUBLISHED'
    },
    isVerifiedVisit: {
        type: Boolean,
        default: false
    },
    isDemoData: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Enforce single review per appointment for a patient when appointment is provided
ReviewSchema.index({ appointment: 1, patient: 1 }, { unique: true, sparse: true });
ReviewSchema.index({ doctor: 1, status: 1 });
ReviewSchema.index({ hospital: 1, status: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
