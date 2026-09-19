import bcrypt from 'bcryptjs';
import { Hospital } from '../models/Hospital.js';
import { Specialty } from '../models/Specialty.js';
import { Doctor } from '../models/Doctor.js';
import { User } from '../models/User.js';
import { Appointment } from '../models/Appointment.js';
import { Feedback } from '../models/Feedback.js';

export const seedDemoData = async () => {
    try {
        const hospitalCount = await Hospital.countDocuments();
        if (hospitalCount > 0) {
            console.log('ℹ️ Database already contains data. Skipping demo seed.');
            return;
        }

        console.log('🌱 Seeding initial DEMO DATA into MongoDB...');

        // 1. Seed Specialties
        const specialtiesData = [
            { name: 'Cardiology', slug: 'cardiology', icon: 'HeartPulse', department: 'Cardiology', description: 'Comprehensive heart care, ECG, angioplasty, and cardiac rehab.' },
            { name: 'Neurology', slug: 'neurology', icon: 'Activity', department: 'Neurology', description: 'Advanced neuro-diagnostics, spine care, and stroke recovery.' },
            { name: 'Pediatrics', slug: 'pediatrics', icon: 'Users', department: 'Pediatrics', description: 'Compassionate pediatric wellness, neonatal ICU, and vaccinations.' },
            { name: 'Orthopedics', slug: 'orthopedics', icon: 'Stethoscope', department: 'Orthopedics', description: 'Joint replacement, trauma care, arthroscopy, and sports medicine.' },
            { name: 'Dermatology', slug: 'dermatology', icon: 'Sparkles', department: 'Dermatology', description: 'Clinical skin therapy, laser treatment, and cosmetic care.' },
            { name: 'General Medicine', slug: 'general-medicine', icon: 'Stethoscope', department: 'General Medicine', description: 'Primary health consultations, preventive checkups, and chronic disease management.' },
            { name: 'Emergency & Trauma', slug: 'emergency-trauma', icon: 'Clock', department: 'Emergency', description: '24/7 Rapid critical triage, resus units, and acute trauma surgery.' }
        ];

        const specialties = await Specialty.insertMany(
            specialtiesData.map(s => ({ ...s, isDemoData: true }))
        );
        const specialtyMap = {};
        specialties.forEach(s => { specialtyMap[s.name] = s._id; });

        // 2. Seed Realistic Hospitals with GeoJSON Coordinates [lng, lat]
        const hospitalsData = [
            {
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
                    coordinates: [-73.985130, 40.748817] // Manhattan, NY
                },
                departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Emergency', 'Pharmacy'],
                specialties: [specialtyMap['Cardiology'], specialtyMap['Neurology'], specialtyMap['Pediatrics'], specialtyMap['Orthopedics'], specialtyMap['General Medicine'], specialtyMap['Emergency & Trauma']],
                facilities: ['24/7 ICU & Trauma', 'Robotic Surgery', '3T MRI & CT', 'In-house Automated Pharmacy', 'Helipad', 'Emergency Ambulance Fleet'],
                workingHours: { opd: '08:00 AM - 08:00 PM', emergency: '24/7 Open', visiting: '04:00 PM - 07:00 PM' },
                rating: 4.9,
                reviewsCount: 310,
                totalBeds: 500,
                availableBeds: 68,
                isDemoData: true
            },
            {
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
                    coordinates: [-73.974050, 40.752700] // Lexington Ave, NY
                },
                departments: ['Cardiology', 'Neurology', 'Emergency', 'Pharmacy'],
                specialties: [specialtyMap['Cardiology'], specialtyMap['Neurology'], specialtyMap['Emergency & Trauma']],
                facilities: ['4 Modern Cath Labs', 'Dedicated Neuro ICU', 'Cardiac Rehab Gymnasium', '24/7 Pharmacy'],
                workingHours: { opd: '09:00 AM - 07:00 PM', emergency: '24/7 Open', visiting: '05:00 PM - 08:00 PM' },
                rating: 4.85,
                reviewsCount: 195,
                totalBeds: 280,
                availableBeds: 34,
                isDemoData: true
            },
            {
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
                    coordinates: [-73.993000, 40.695000] // Brooklyn Heights, NY
                },
                departments: ['Pediatrics', 'General Medicine', 'Dermatology', 'Pharmacy'],
                specialties: [specialtyMap['Pediatrics'], specialtyMap['General Medicine'], specialtyMap['Dermatology']],
                facilities: ['Level-3 NICU', 'Pediatric Surgical Wing', 'Vaccination Center', 'Play Therapy Rooms'],
                workingHours: { opd: '08:30 AM - 06:30 PM', emergency: '24/7 Open', visiting: 'Open 24/7 for Parents' },
                rating: 4.95,
                reviewsCount: 280,
                totalBeds: 200,
                availableBeds: 22,
                isDemoData: true
            },
            {
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
                    coordinates: [-73.935242, 40.744778] // Queens, NY
                },
                departments: ['Orthopedics', 'General Medicine', 'Pharmacy'],
                specialties: [specialtyMap['Orthopedics'], specialtyMap['General Medicine']],
                facilities: ['Hydrotherapy Pool', 'Computer-Assisted Joint Replacement', 'Sports Biomechanics Lab'],
                workingHours: { opd: '08:00 AM - 06:00 PM', emergency: '24/7 Open', visiting: '03:00 PM - 06:00 PM' },
                rating: 4.88,
                reviewsCount: 140,
                totalBeds: 180,
                availableBeds: 40,
                isDemoData: true
            }
        ];

        const hospitals = await Hospital.insertMany(hospitalsData);
        const hospitalMap = {};
        hospitals.forEach(h => { hospitalMap[h.name] = h._id; });

        // 3. Seed Realistic Doctors
        const weeklyFullSchedule = [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
        ];

        const doctorsData = [
            {
                name: 'Dr. Sarah Smith',
                email: 'dr.smith@hms.com',
                hospital: hospitalMap['ProHealth Central Super Specialty Hospital'],
                specialty: specialtyMap['Cardiology'],
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
                weeklySchedule: weeklyFullSchedule,
                leaveDates: [],
                isAvailableToday: true,
                isDemoData: true
            },
            {
                name: 'Dr. James Wilson',
                email: 'dr.wilson@hms.com',
                hospital: hospitalMap['ProHealth Central Super Specialty Hospital'],
                specialty: specialtyMap['Neurology'],
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
                weeklySchedule: weeklyFullSchedule,
                leaveDates: [],
                isAvailableToday: true,
                isDemoData: true
            },
            {
                name: 'Dr. Emily Chen',
                email: 'dr.chen@hms.com',
                hospital: hospitalMap['St. Jude Children & Family Hospital'],
                specialty: specialtyMap['Pediatrics'],
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
                weeklySchedule: weeklyFullSchedule,
                leaveDates: [],
                isAvailableToday: true,
                isDemoData: true
            },
            {
                name: 'Dr. Michael Brown',
                email: 'dr.brown@hms.com',
                hospital: hospitalMap['Valley Orthopedic & Sports Medicine Center'],
                specialty: specialtyMap['Orthopedics'],
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
                weeklySchedule: weeklyFullSchedule,
                leaveDates: [],
                isAvailableToday: true,
                isDemoData: true
            },
            {
                name: 'Dr. Lisa Taylor',
                email: 'dr.taylor@hms.com',
                hospital: hospitalMap['St. Jude Children & Family Hospital'],
                specialty: specialtyMap['Dermatology'],
                department: 'Dermatology',
                qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
                experienceYears: 11,
                consultationFee: 55,
                roomNumber: 'Derma Lab 108',
                bio: 'Expert clinical dermatologist offering cutting-edge treatments for chronic skin conditions, acne, eczema, and pediatric dermatology.',
                languages: ['English', 'French'],
                rating: 4.85,
                reviewsCount: 88,
                slotDurationMinutes: 30,
                weeklySchedule: weeklyFullSchedule,
                leaveDates: [],
                isAvailableToday: true,
                isDemoData: true
            },
            {
                name: 'Dr. Robert King',
                email: 'dr.king@hms.com',
                hospital: hospitalMap['Metro City Heart & Neuro Institute'],
                specialty: specialtyMap['General Medicine'],
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
                weeklySchedule: weeklyFullSchedule,
                leaveDates: [],
                isAvailableToday: true,
                isDemoData: true
            }
        ];

        const doctors = await Doctor.insertMany(doctorsData);

        // 4. Seed Standard Staff & Demo Users with bcrypt hashed passwords
        const passDoctor = await bcrypt.hash('doc@123', 10);
        const passReceptionist = await bcrypt.hash('rec@123', 10);
        const passPharmacy = await bcrypt.hash('pha@123', 10);
        const passStaff = await bcrypt.hash('stf@123', 10);
        const passAdmin = await bcrypt.hash('admin@123', 10);
        const passPatient = await bcrypt.hash('patient@123', 10);

        const usersData = [
            { name: 'Admin Alice', email: 'admin@hms.com', staffId: 'ADM001', passwordHash: passAdmin, role: 'admin', phone: '+1 555-0100', isDemoData: true },
            { name: 'Dr. Sarah Smith', email: 'doctor@hms.com', staffId: 'DOC001', passwordHash: passDoctor, role: 'doctor', phone: '+1 555-0101', hospital: hospitalMap['ProHealth Central Super Specialty Hospital'], specialty: specialtyMap['Cardiology'], isDemoData: true },
            { name: 'Receptionist Jane', email: 'reception@hms.com', staffId: 'REC001', passwordHash: passReceptionist, role: 'receptionist', phone: '+1 555-0102', hospital: hospitalMap['ProHealth Central Super Specialty Hospital'], isDemoData: true },
            { name: 'Pharmacist Bob', email: 'pharmacy@hms.com', staffId: 'PHA001', passwordHash: passPharmacy, role: 'pharmacy', phone: '+1 555-0103', hospital: hospitalMap['ProHealth Central Super Specialty Hospital'], isDemoData: true },
            { name: 'Staff Mike', email: 'staff@hms.com', staffId: 'STF001', passwordHash: passStaff, role: 'staff', phone: '+1 555-0104', hospital: hospitalMap['ProHealth Central Super Specialty Hospital'], isDemoData: true },
            { name: 'Alex Johnson', email: 'patient@hms.com', passwordHash: passPatient, role: 'patient', phone: '+1 555-0199', isDemoData: true, savedHospitals: [hospitalMap['ProHealth Central Super Specialty Hospital']], savedDoctors: [doctors[0]._id] }
        ];

        await User.insertMany(usersData);

        // 5. Seed Initial Reviews / Feedback
        const feedbackData = [
            { patientName: 'David Miller', hospital: hospitalMap['ProHealth Central Super Specialty Hospital'], department: 'Cardiology', rating: 5, comment: 'Dr. Sarah Smith was exceptionally thorough with my cardiac stress test. The OPD queue was fast and well-organized.' },
            { patientName: 'Maria Garcia', hospital: hospitalMap['St. Jude Children & Family Hospital'], department: 'Pediatrics', rating: 5, comment: 'Dr. Emily Chen is wonderful with kids! Clean clinic, compassionate staff, and zero wait time.' },
            { patientName: 'James Thorne', hospital: hospitalMap['Valley Orthopedic & Sports Medicine Center'], department: 'Orthopedics', rating: 4, comment: 'Great knee consultation by Dr. Michael Brown. Clear rehabilitation roadmap.' }
        ];

        await Feedback.insertMany(feedbackData);

        console.log('✅ DEMO DATA seeded successfully into MongoDB with explicit isDemoData flags.');
    } catch (err) {
        console.error('❌ Error during demo data seeding:', err.message);
    }
};
