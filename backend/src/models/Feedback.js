import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    department: {
        type: String,
        default: 'General'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    isVerifiedVisit: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
