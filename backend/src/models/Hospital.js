import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    tagline: {
        type: String,
        default: 'Center of Clinical Excellence'
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Super Specialty Hospital', 'Multi Specialty Center', 'General Hospital', 'Children Hospital', 'Cardiology Institute', 'Trauma & Emergency Center'],
        default: 'Multi Specialty Center'
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    emergencyPhone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    website: {
        type: String,
        default: ''
    },
    // GeoJSON Point for spatial queries
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    departments: [{
        type: String
    }],
    specialties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    }],
    facilities: [{
        type: String
    }],
    workingHours: {
        opd: { type: String, default: '08:00 AM - 08:00 PM' },
        emergency: { type: String, default: '24/7 Open' },
        visiting: { type: String, default: '04:00 PM - 07:00 PM' }
    },
    rating: {
        type: Number,
        default: 4.8,
        min: 1,
        max: 5
    },
    reviewsCount: {
        type: Number,
        default: 120
    },
    totalBeds: {
        type: Number,
        default: 250
    },
    availableBeds: {
        type: Number,
        default: 45
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isDemoData: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// 2dsphere index for nearby geospatial queries
HospitalSchema.index({ location: '2dsphere' });
HospitalSchema.index({ name: 'text', city: 'text', address: 'text', departments: 'text' });

export const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);
