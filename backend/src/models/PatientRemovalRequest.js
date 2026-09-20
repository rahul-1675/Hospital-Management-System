import mongoose from 'mongoose';

const PatientRemovalRequestSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: ['Treatment Completed', 'Patient Discharged', 'Transferred to Another Facility', 'Inactive / Non-responsive', 'Duplicate Profile', 'Other'],
        default: 'Treatment Completed'
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    adminNote: {
        type: String,
        default: ''
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    }
}, { timestamps: true });

export const PatientRemovalRequest = mongoose.models.PatientRemovalRequest || mongoose.model('PatientRemovalRequest', PatientRemovalRequestSchema);
