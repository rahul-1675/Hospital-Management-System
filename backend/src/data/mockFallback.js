import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.middleware.js';

// Haversine formula to compute geospatial distance in meters
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
};

export const MOCK_SPECIALTIES = [
    { _id: 'spec-1', id: 'spec-1', name: 'Cardiology', slug: 'cardiology', icon: 'HeartPulse', department: 'Cardiology', description: 'Comprehensive cardiac care, ECG, angioplasty, and rehab.' },
    { _id: 'spec-2', id: 'spec-2', name: 'Neurology', slug: 'neurology', icon: 'Activity', department: 'Neurology', description: 'Advanced neuro-diagnostics, spine care, and stroke recovery.' },
    { _id: 'spec-3', id: 'spec-3', name: 'Pediatrics', slug: 'pediatrics', icon: 'Users', department: 'Pediatrics', description: 'Compassionate pediatric wellness, neonatal ICU, and vaccinations.' },
    { _id: 'spec-4', id: 'spec-4', name: 'Orthopedics', slug: 'orthopedics', icon: 'Stethoscope', department: 'Orthopedics', description: 'Joint replacement, trauma care, arthroscopy, and sports therapy.' },
    { _id: 'spec-5', id: 'spec-5', name: 'Dermatology', slug: 'dermatology', icon: 'Sparkles', department: 'Dermatology', description: 'Clinical dermatology, eczema therapy, and cosmetic skincare.' },
    { _id: 'spec-6', id: 'spec-6', name: 'General Medicine', slug: 'general-medicine', icon: 'Stethoscope', department: 'General Medicine', description: 'Primary health consultations, preventive health checkups.' },
    { _id: 'spec-7', id: 'spec-7', name: 'Emergency & Trauma', slug: 'emergency-trauma', icon: 'Clock', department: 'Emergency', description: '24/7 Level-1 trauma resus units and critical acute care.' }
];

export const MOCK_HOSPITALS = [
    {
        _id: 'hosp-1',
        id: 'hosp-1',
        name: 'ProHealth Central Super Specialty Hospital',
        slug: 'prohealth-central-hospital',
        tagline: 'Leading Academic & Tertiary Medical Center',
        description: 'A 500-bed multi-specialty institution equipped with robotic OT suites, 24/7 Level-1 trauma center, and advanced cardiac diagnostics.',
        type: 'Super Specialty Hospital',
        address: '123 Health Avenue, Medical District',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        contactPhone: '+1 (800) 123-4567',
        emergencyPhone: '+1 (800) 911-0001',
        email: 'central@prohealth-hms.com',
        website: 'https://prohealth-central.org',
        location: {
            type: 'Point',
            coordinates: [-73.985130, 40.748817] // [lng, lat]
        },
        departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Emergency', 'Pharmacy'],
        specialties: [MOCK_SPECIALTIES[0], MOCK_SPECIALTIES[1], MOCK_SPECIALTIES[2], MOCK_SPECIALTIES[3], MOCK_SPECIALTIES[5], MOCK_SPECIALTIES[6]],
        facilities: ['24/7 ICU & Trauma', 'Robotic Surgery', '3T MRI & CT', 'In-house Automated Pharmacy', 'Helipad'],
        workingHours: { opd: '08:00 AM - 08:00 PM', emergency: '24/7 Open', visiting: '04:00 PM - 07:00 PM' },
        rating: 4.92,
        reviewsCount: 310,
        totalBeds: 500,
        availableBeds: 68,
        isDemoData: true
    },
    {
        _id: 'hosp-2',
        id: 'hosp-2',
        name: 'Metro City Heart & Neuro Institute',
        slug: 'metro-city-heart-neuro',
        tagline: 'Specialized Cardiac & Brain Care Excellence',
        description: 'State-of-the-art institute featuring 4 Cath Labs, stroke recovery unit, electrophysiology lab, and pediatric cardiology wing.',
        type: 'Cardiology Institute',
        address: '455 Lexington Parkway',
        city: 'New York',
        state: 'NY',
        pincode: '10017',
        contactPhone: '+1 (800) 234-5678',
        emergencyPhone: '+1 (800) 911-0002',
        email: 'heartneuro@prohealth-hms.com',
        website: 'https://metro-heartneuro.org',
        location: {
            type: 'Point',
            coordinates: [-73.974050, 40.752700]
        },
        departments: ['Cardiology', 'Neurology', 'Emergency', 'Pharmacy'],
        specialties: [MOCK_SPECIALTIES[0], MOCK_SPECIALTIES[1], MOCK_SPECIALTIES[6]],
        facilities: ['4 Modern Cath Labs', 'Dedicated Neuro ICU', 'Cardiac Rehab Gymnasium', '24/7 Pharmacy'],
        workingHours: { opd: '09:00 AM - 07:00 PM', emergency: '24/7 Open', visiting: '05:00 PM - 08:00 PM' },
        rating: 4.85,
        reviewsCount: 195,
        totalBeds: 280,
        availableBeds: 34,
        isDemoData: true
    },
    {
        _id: 'hosp-3',
        id: 'hosp-3',
        name: 'St. Jude Children & Family Hospital',
        slug: 'st-jude-children-family',
        tagline: 'Compassionate Pediatric & Family Care',
        description: 'Dedicated pediatric facility with Level-3 NICU, child-friendly outpatient suites, pediatric surgery, and family wellness centers.',
        type: 'Children Hospital',
        address: '890 Brooklyn Heights Blvd',
        city: 'Brooklyn',
        state: 'NY',
        pincode: '11201',
        contactPhone: '+1 (800) 345-6789',
        emergencyPhone: '+1 (800) 911-0003',
        email: 'pediatrics@prohealth-hms.com',
        website: 'https://stjude-family.org',
        location: {
            type: 'Point',
            coordinates: [-73.993000, 40.695000]
        },
        departments: ['Pediatrics', 'General Medicine', 'Dermatology', 'Pharmacy'],
        specialties: [MOCK_SPECIALTIES[2], MOCK_SPECIALTIES[4], MOCK_SPECIALTIES[5]],
        facilities: ['Level-3 NICU', 'Pediatric Surgical Wing', 'Vaccination Center', 'Play Therapy Rooms'],
        workingHours: { opd: '08:30 AM - 06:30 PM', emergency: '24/7 Open', visiting: 'Open 24/7 for Parents' },
        rating: 4.95,
        reviewsCount: 280,
        totalBeds: 200,
        availableBeds: 22,
        isDemoData: true
    },
    {
        _id: 'hosp-4',
        id: 'hosp-4',
        name: 'Valley Orthopedic & Sports Medicine Center',
        slug: 'valley-orthopedic-center',
        tagline: 'Joint Replacement & Sports Injury Recovery',
        description: 'Specialized orthopedic destination offering computer-navigated joint replacements, arthroscopic sports surgery, and hydrotherapy rehabilitation.',
        type: 'Multi Specialty Center',
        address: '320 Queens Boulevard',
        city: 'Queens',
        state: 'NY',
        pincode: '11101',
        contactPhone: '+1 (800) 456-7890',
        emergencyPhone: '+1 (800) 911-0004',
        email: 'ortho@prohealth-hms.com',
        website: 'https://valley-ortho.org',
        location: {
            type: 'Point',
            coordinates: [-73.935242, 40.744778]
        },
        departments: ['Orthopedics', 'General Medicine', 'Pharmacy'],
        specialties: [MOCK_SPECIALTIES[3], MOCK_SPECIALTIES[5]],
        facilities: ['Hydrotherapy Pool', 'Computer-Assisted Joint Replacement', 'Sports Biomechanics Lab'],
        workingHours: { opd: '08:00 AM - 06:00 PM', emergency: '24/7 Open', visiting: '03:00 PM - 06:00 PM' },
        rating: 4.88,
        reviewsCount: 140,
        totalBeds: 180,
        availableBeds: 40,
        isDemoData: true
    }
];

export const MOCK_DOCTORS = [
    {
        _id: 'doc-1',
        id: 'doc-1',
        name: 'Dr. Sarah Smith',
        email: 'dr.smith@hms.com',
        hospital: MOCK_HOSPITALS[0],
        specialty: MOCK_SPECIALTIES[0],
        department: 'Cardiology',
        qualifications: 'MBBS, MD (Cardiology), FACC',
        experienceYears: 14,
        consultationFee: 65,
        roomNumber: 'OPD Room 102',
        bio: 'Senior Cardiologist specializing in interventional cardiology, coronary stenting, and heart failure management with over 14 years of clinical experience.',
        languages: ['English', 'Spanish'],
        rating: 4.92,
        reviewsCount: 145,
        slotDurationMinutes: 30,
        weeklySchedule: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
        ],
        leaveDates: [],
        isAvailableToday: true,
        isDemoData: true
    },
    {
        _id: 'doc-2',
        id: 'doc-2',
        name: 'Dr. James Wilson',
        email: 'dr.wilson@hms.com',
        hospital: MOCK_HOSPITALS[0],
        specialty: MOCK_SPECIALTIES[1],
        department: 'Neurology',
        qualifications: 'MBBS, MD (Neurology), DM',
        experienceYears: 18,
        consultationFee: 80,
        roomNumber: 'OPD Room 204',
        bio: 'Chief of Neuro-sciences with expertise in stroke management, epilepsy, Parkinson’s disease, and advanced neuro-critical care.',
        languages: ['English'],
        rating: 4.95,
        reviewsCount: 210,
        slotDurationMinutes: 30,
        weeklySchedule: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
        ],
        leaveDates: [],
        isAvailableToday: true,
        isDemoData: true
    },
    {
        _id: 'doc-3',
        id: 'doc-3',
        name: 'Dr. Emily Chen',
        email: 'dr.chen@hms.com',
        hospital: MOCK_HOSPITALS[2],
        specialty: MOCK_SPECIALTIES[2],
        department: 'Pediatrics',
        qualifications: 'MBBS, DCH, MD (Pediatrics)',
        experienceYears: 9,
        consultationFee: 50,
        roomNumber: 'Child Clinic 101',
        bio: 'Consultant Pediatrician passionate about preventive pediatric care, newborn wellness, and childhood developmental screening.',
        languages: ['English', 'Mandarin'],
        rating: 4.88,
        reviewsCount: 95,
        slotDurationMinutes: 30,
        weeklySchedule: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
        ],
        leaveDates: [],
        isAvailableToday: true,
        isDemoData: true
    },
    {
        _id: 'doc-4',
        id: 'doc-4',
        name: 'Dr. Michael Brown',
        email: 'dr.brown@hms.com',
        hospital: MOCK_HOSPITALS[3],
        specialty: MOCK_SPECIALTIES[3],
        department: 'Orthopedics',
        qualifications: 'MBBS, MS (Ortho), Fellowship in Joint Replacement',
        experienceYears: 15,
        consultationFee: 70,
        roomNumber: 'Ortho Suite 305',
        bio: 'Specialist in robotic knee and hip replacements, arthroscopic shoulder reconstruction, and sports injury rehabilitation.',
        languages: ['English'],
        rating: 4.91,
        reviewsCount: 160,
        slotDurationMinutes: 30,
        weeklySchedule: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
        ],
        leaveDates: [],
        isAvailableToday: true,
        isDemoData: true
    },
    {
        _id: 'doc-5',
        id: 'doc-5',
        name: 'Dr. Lisa Taylor',
        email: 'dr.taylor@hms.com',
        hospital: MOCK_HOSPITALS[2],
        specialty: MOCK_SPECIALTIES[4],
        department: 'Dermatology',
        qualifications: 'MBBS, MD (Dermatology)',
        experienceYears: 11,
        consultationFee: 55,
        roomNumber: 'Derma Lab 108',
        bio: 'Expert clinical dermatologist offering cutting-edge treatments for chronic skin conditions, acne, eczema, and pediatric dermatology.',
        languages: ['English', 'French'],
        rating: 4.85,
        reviewsCount: 88,
        slotDurationMinutes: 30,
        weeklySchedule: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
        ],
        leaveDates: [],
        isAvailableToday: true,
        isDemoData: true
    },
    {
        _id: 'doc-6',
        id: 'doc-6',
        name: 'Dr. Robert King',
        email: 'dr.king@hms.com',
        hospital: MOCK_HOSPITALS[1],
        specialty: MOCK_SPECIALTIES[5],
        department: 'General Medicine',
        qualifications: 'MBBS, MD (Internal Medicine)',
        experienceYears: 20,
        consultationFee: 45,
        roomNumber: 'Primary Care 100',
        bio: 'Distinguished internist with two decades of experience diagnosing multi-system complex medical conditions and preventive lifestyle medicine.',
        languages: ['English'],
        rating: 4.97,
        reviewsCount: 340,
        slotDurationMinutes: 30,
        weeklySchedule: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
        ],
        leaveDates: [],
        isAvailableToday: true,
        isDemoData: true
    }
];

export let mockAppointments = [
    {
        _id: 'apt-1',
        id: 'apt-1',
        appointmentNumber: 'APT-100201',
        patient: { _id: 'usr-patient', name: 'Alex Johnson', email: 'patient@hms.com', phone: '+1 555-0199' },
        patientName: 'Alex Johnson',
        patientEmail: 'patient@hms.com',
        patientPhone: '+1 555-0199',
        doctor: MOCK_DOCTORS[0],
        hospital: MOCK_HOSPITALS[0],
        specialty: MOCK_SPECIALTIES[0],
        department: 'Cardiology',
        date: '2026-03-25',
        timeSlot: '10:00 AM',
        status: 'CONFIRMED',
        queueToken: 'OPD-102',
        symptoms: 'Annual cardiac checkup and follow-up ECG',
        amount: 65,
        paymentStatus: 'PAID'
    }
];

export let mockUsers = [
    {
        _id: 'usr-admin-167',
        id: 'ADM167',
        staffId: 'ADM167',
        name: 'Rahul (Administrator)',
        email: 'admin@hms.com',
        role: 'admin',
        phone: '+1 555-0100',
        password: 'Rahul@167',
        passwordHash: bcrypt.hashSync('Rahul@167', 10),
        status: 'Active',
        department: 'Management'
    }
];
