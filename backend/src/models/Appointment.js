import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    appointmentNumber: {
        type: String,
        required: true,
        unique: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    patientName: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        default: ''
    },
    patientPhone: {
        type: String,
        default: ''
    },
    patientAge: {
        type: Number,
        default: 30
    },
    patientGender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
        required: false
    },
    department: {
        type: String,
        default: 'General'
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    timeSlot: {
        type: String, // e.g. "09:30 AM" or "09:30"
        required: true
    },
    status: {
        type: String,
        enum: ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'],
        default: 'CONFIRMED'
    },
    queueToken: {
        type: String,
        default: ''
    },
    symptoms: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    prescription: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        default: 50
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'REFUNDED'],
        default: 'PAID'
    },
    isDemoData: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Guard against double booking at the database level
AppointmentSchema.index(
    { doctor: 1, date: 1, timeSlot: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $nin: ['CANCELLED', 'RESCHEDULED'] } }
    }
);

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
