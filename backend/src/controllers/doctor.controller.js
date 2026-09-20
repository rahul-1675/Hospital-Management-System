import mongoose from 'mongoose';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { User } from '../models/User.js';
import { PatientRemovalRequest } from '../models/PatientRemovalRequest.js';
import { MOCK_DOCTORS, mockAppointments, mockPatientRemovalRequests, mockUsers } from '../data/mockFallback.js';

// Helper: Convert 24hr string ("09:30") to readable 12hr slot ("09:30 AM")
const formatTime12Hr = (timeStr24) => {
    const [hourStr, minStr] = timeStr24.split(':');
    let hour = parseInt(hourStr, 10);
    const min = minStr.padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour.toString().padStart(2, '0')}:${min} ${ampm}`;
};

// Helper: Parse Date to Day name (e.g., 'Monday')
const getDayName = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateString);
    return days[d.getUTCDay()];
};

export const doctorController = {
    // GET /api/doctors/portal/dashboard-stats
    getPortalDashboardStats: async (req, res) => {
        try {
            const todayStr = new Date().toISOString().split('T')[0];

            if (mongoose.connection.readyState === 1) {
                const appointments = await Appointment.find().populate('doctor').populate('patient');
                const todayApps = appointments.filter(a => a.date === todayStr || !a.date);
                const waiting = todayApps.filter(a => ['CONFIRMED', 'CHECKED-IN'].includes((a.status || '').toUpperCase())).length;
                const completed = todayApps.filter(a => (a.status || '').toUpperCase() === 'COMPLETED').length;

                const upNext = todayApps.slice(0, 3).map(a => ({
                    id: a._id.toString(),
                    time: a.timeSlot || '09:00 AM',
                    patientName: a.patientName || (a.patient ? a.patient.name : 'Patient'),
                    reason: a.symptoms || 'Clinical Consultation',
                    status: (a.status || 'scheduled').toLowerCase()
                }));

                return res.json({
                    success: true,
                    data: {
                        todayAppointments: todayApps.length || appointments.length,
                        patientsWaiting: waiting,
                        completedCount: completed,
                        pendingReports: Math.max(1, appointments.filter(a => !a.notes).length),
                        avgConsultTime: '15m',
                        upNext,
                        activity: [
                            { type: 'result', title: 'Clinical Notes Logged', detail: 'Patient OPD Assessment updated', time: '10 mins ago' },
                            { type: 'admit', title: 'Consultation Completed', detail: 'Prescription issued & verified', time: '25 mins ago' },
                            { type: 'alert', title: 'OPD Queue Active', detail: 'Reception checked-in token queue', time: '1h ago' }
                        ]
                    }
                });
            }

            // In-Memory Fallback
            const todayApps = mockAppointments;
            const waiting = todayApps.filter(a => ['CONFIRMED', 'CHECKED-IN', 'scheduled'].includes((a.status || '').toLowerCase())).length;

            const upNext = todayApps.slice(0, 3).map(a => ({
                id: a._id || a.id,
                time: a.timeSlot || a.time || '10:00 AM',
                patientName: a.patientName || 'Alex Johnson',
                reason: a.symptoms || a.details || 'Annual cardiac checkup',
                status: (a.status || 'scheduled').toLowerCase()
            }));

            return res.json({
                success: true,
                data: {
                    todayAppointments: todayApps.length,
                    patientsWaiting: waiting,
                    completedCount: todayApps.filter(a => a.status === 'completed' || a.status === 'COMPLETED').length,
                    pendingReports: 2,
                    avgConsultTime: '15m',
                    upNext,
                    activity: [
                        { type: 'result', title: 'Clinical Notes Logged', detail: 'Patient OPD Assessment updated', time: '10 mins ago' },
                        { type: 'admit', title: 'Consultation Completed', detail: 'Prescription issued & verified', time: '25 mins ago' },
                        { type: 'alert', title: 'OPD Queue Active', detail: 'Reception checked-in token queue', time: '1h ago' }
                    ]
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors/portal/appointments
    getPortalAppointments: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const appointments = await Appointment.find()
                    .populate('doctor')
                    .populate('patient')
                    .populate('hospital')
                    .sort({ createdAt: -1 });

                const mapped = appointments.map((app, idx) => ({
                    id: app._id.toString(),
                    _id: app._id.toString(),
                    time: app.timeSlot || '09:00 AM',
                    date: app.date,
                    patientName: app.patientName || (app.patient ? app.patient.name : 'Patient'),
                    age: app.patientAge || 32,
                    gender: app.patientGender || 'Male',
                    reason: app.symptoms || 'Clinical Consultation & Assessment',
                    status: (app.status || 'scheduled').toLowerCase(),
                    history: `Registered Consultation • ${app.department || 'General Med'}`,
                    vitals: 'BP: 120/80 • HR: 72 bpm',
                    pastVisits: [],
                    notes: app.notes || ''
                }));

                return res.json({ success: true, data: mapped });
            }

            // In-Memory Fallback
            const mapped = mockAppointments.map((app, idx) => ({
                id: app._id || app.id,
                _id: app._id || app.id,
                time: app.timeSlot || app.time || '10:00 AM',
                date: app.date || new Date().toISOString().split('T')[0],
                patientName: app.patientName || 'Alex Johnson',
                age: 34,
                gender: 'Male',
                reason: app.symptoms || app.details || 'General Health Consultation',
                status: (app.status || 'scheduled').toLowerCase(),
                history: `Registered Consultation • ${app.department || 'Cardiology'}`,
                vitals: 'BP: 120/80 • HR: 74 bpm',
                pastVisits: [],
                notes: app.notes || ''
            }));

            return res.json({ success: true, data: mapped });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /api/doctors/portal/appointments/:id/consultation
    updateConsultation: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, notes, prescription } = req.body;

            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
                const app = await Appointment.findById(id);
                if (!app) return res.status(404).json({ success: false, message: 'Appointment not found' });

                if (status) {
                    const norm = status.toUpperCase();
                    if (norm === 'COMPLETED') app.status = 'COMPLETED';
                    else if (norm === 'IN-CONSULTATION') app.status = 'CONFIRMED';
                    else app.status = norm;
                }
                if (notes !== undefined) app.notes = notes;
                if (prescription !== undefined) app.prescription = prescription;

                await app.save();
                return res.json({ success: true, data: app });
            }

            // In-Memory Fallback
            const app = mockAppointments.find(a => a._id === id || a.id === id);
            if (!app) return res.status(404).json({ success: false, message: 'Appointment not found' });

            if (status) app.status = status;
            if (notes !== undefined) app.notes = notes;
            if (prescription !== undefined) app.prescription = prescription;

            return res.json({ success: true, data: app });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors/portal/patients
    getPortalPatients: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const appointments = await Appointment.find().populate('doctor').sort({ createdAt: -1 });
                const patientMap = new Map();

                appointments.forEach(app => {
                    const key = (app.patientName || 'Walk-in Patient').toLowerCase();
                    if (!patientMap.has(key)) {
                        patientMap.set(key, {
                            id: app._id.toString(),
                            name: app.patientName || 'Walk-in Patient',
                            age: app.patientAge || 34,
                            gender: app.patientGender || 'Male',
                            phone: app.patientPhone || '+1 555-0100',
                            lastVisit: app.date || new Date().toISOString().split('T')[0],
                            condition: app.symptoms || 'General Checkup',
                            type: 'Standard',
                            timeline: [
                                {
                                    id: app._id.toString(),
                                    date: app.date || new Date().toISOString().split('T')[0],
                                    title: 'Clinical Consultation',
                                    doctor: app.doctor ? app.doctor.name : 'Attending Specialist',
                                    details: app.symptoms || 'Regular consultation'
                                }
                            ],
                            labReports: []
                        });
                    }
                });

                return res.json({ success: true, data: Array.from(patientMap.values()) });
            }

            // In-Memory Fallback
            const patients = mockAppointments.map(app => ({
                id: app._id || app.id,
                name: app.patientName || 'Alex Johnson',
                age: 34,
                gender: 'Male',
                phone: app.patientPhone || '+1 555-0199',
                lastVisit: app.date || new Date().toISOString().split('T')[0],
                condition: app.symptoms || 'Cardiac Checkup',
                type: 'Standard',
                timeline: [
                    {
                        id: 1,
                        date: app.date || new Date().toISOString().split('T')[0],
                        title: 'Cardiac Evaluation',
                        doctor: app.doctorName || 'Dr. Sarah Smith',
                        details: app.symptoms || 'Cardiac checkup and ECG'
                    }
                ],
                labReports: [
                    { id: 1, name: 'Electrocardiogram (ECG)', type: 'Cardiology', date: app.date || new Date().toISOString().split('T')[0], status: 'Reviewed' }
                ]
            }));

            return res.json({ success: true, data: patients });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors/portal/records
    getPortalRecords: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const appointments = await Appointment.find().populate('doctor').sort({ createdAt: -1 });
                const records = appointments.map((app, idx) => ({
                    id: app._id.toString(),
                    type: 'Clinical Evaluation',
                    title: `OPD Consultation Note - ${app.patientName}`,
                    date: app.date || new Date().toISOString().split('T')[0],
                    patientName: app.patientName,
                    status: app.notes ? 'Reviewed' : 'Pending Review',
                    data: {
                        'Department': app.department || 'General Medicine',
                        'Specialist': app.doctor ? app.doctor.name : 'Physician',
                        'Symptoms': app.symptoms || 'None recorded',
                        'Vitals': 'BP: 120/80 mmHg'
                    },
                    notes: app.notes || '',
                    attachments: []
                }));

                return res.json({ success: true, data: records });
            }

            // In-Memory Fallback
            const records = mockAppointments.map((app, idx) => ({
                id: app._id || app.id,
                type: 'Clinical Evaluation',
                title: `OPD Consultation Note - ${app.patientName}`,
                date: app.date || new Date().toISOString().split('T')[0],
                patientName: app.patientName || 'Alex Johnson',
                status: 'Reviewed',
                data: {
                    'Department': app.department || 'Cardiology',
                    'Specialist': app.doctorName || 'Dr. Sarah Smith',
                    'Symptoms': app.symptoms || 'Cardiac Evaluation',
                    'Vitals': 'BP: 120/80 mmHg'
                },
                notes: app.notes || 'Normal sinus rhythm observed. Patient instructed to maintain low-sodium diet.',
                attachments: []
            }));

            return res.json({ success: true, data: records });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/doctors/portal/records
    savePortalRecord: async (req, res) => {
        try {
            const { id, notes } = req.body;
            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
                await Appointment.findByIdAndUpdate(id, { notes });
            }
            return res.json({ success: true, message: 'Medical record updated successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors
    getDoctors: async (req, res) => {
        try {
            const { hospital, specialty, department, search, page = 1, limit = 12 } = req.query;

            if (mongoose.connection.readyState === 1) {
                const query = {};
                if (hospital) query.hospital = hospital;
                if (specialty) query.specialty = specialty;
                if (department) query.department = department;

                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { department: { $regex: search, $options: 'i' } },
                        { qualifications: { $regex: search, $options: 'i' } }
                    ];
                }

                const total = await Doctor.countDocuments(query);
                if (total > 0) {
                    const skip = (Number(page) - 1) * Number(limit);
                    const doctors = await Doctor.find(query)
                        .populate('hospital', 'name slug address city rating')
                        .populate('specialty', 'name slug icon')
                        .skip(skip)
                        .limit(Number(limit))
                        .sort({ rating: -1 });

                    return res.json({
                        success: true,
                        data: doctors,
                        pagination: {
                            total,
                            page: Number(page),
                            limit: Number(limit),
                            totalPages: Math.ceil(total / Number(limit))
                        }
                    });
                }
            }

            // Fallback filtering
            let filtered = [...MOCK_DOCTORS];
            if (hospital) {
                filtered = filtered.filter(d => d.hospital._id === hospital || d.hospital.id === hospital);
            }
            if (specialty) {
                filtered = filtered.filter(d => d.specialty._id === specialty || d.specialty.id === specialty || d.specialty.name === specialty);
            }
            if (department) {
                filtered = filtered.filter(d => d.department === department);
            }
            if (search) {
                const s = search.toLowerCase();
                filtered = filtered.filter(d =>
                    d.name.toLowerCase().includes(s) ||
                    d.department.toLowerCase().includes(s) ||
                    d.qualifications.toLowerCase().includes(s)
                );
            }

            const total = filtered.length;
            const skip = (Number(page) - 1) * Number(limit);
            const paginated = filtered.slice(skip, skip + Number(limit));

            return res.json({
                success: true,
                data: paginated,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors/:id
    getDoctorById: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const doctor = await Doctor.findById(id).populate('hospital').populate('specialty');
                if (doctor) {
                    return res.json({ success: true, data: doctor });
                }
            }

            const doctor = MOCK_DOCTORS.find(d => d._id === id || d.id === id);
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Doctor not found' });
            }

            return res.json({ success: true, data: doctor });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors/:id/availability?date=YYYY-MM-DD
    getDoctorAvailability: async (req, res) => {
        try {
            const { id } = req.params;
            const { date } = req.query;

            if (!date) {
                return res.status(400).json({ success: false, message: 'Query parameter "date" (YYYY-MM-DD) is required.' });
            }

            let doctor = null;
            if (mongoose.connection.readyState === 1) {
                doctor = await Doctor.findById(id);
            }
            if (!doctor) {
                doctor = MOCK_DOCTORS.find(d => d._id === id || d.id === id);
            }

            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Doctor not found' });
            }

            // Check if on leave
            if (doctor.leaveDates && doctor.leaveDates.includes(date)) {
                return res.json({
                    success: true,
                    date,
                    isDoctorOnLeave: true,
                    message: `${doctor.name} is on leave on ${date}.`,
                    slots: []
                });
            }

            const dayName = getDayName(date);
            const defaultWeekly = [
                { day: 'Monday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
                { day: 'Tuesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
                { day: 'Wednesday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
                { day: 'Thursday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
                { day: 'Friday', startTime: '09:00', endTime: '17:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true }
            ];

            const schedule = doctor.weeklySchedule && doctor.weeklySchedule.length ? doctor.weeklySchedule : defaultWeekly;
            const daySchedule = schedule.find(s => s.day === dayName);

            if (!daySchedule || !daySchedule.isWorking) {
                return res.json({
                    success: true,
                    date,
                    day: dayName,
                    isDoctorOnLeave: false,
                    message: `${doctor.name} does not have OPD clinic hours on ${dayName}s.`,
                    slots: []
                });
            }

            // Generate slots
            const slotDuration = doctor.slotDurationMinutes || 30;
            const [startH, startM] = (daySchedule.startTime || '09:00').split(':').map(Number);
            const [endH, endM] = (daySchedule.endTime || '17:00').split(':').map(Number);
            const [lunchStartH, lunchStartM] = (daySchedule.lunchStart || '13:00').split(':').map(Number);
            const [lunchEndH, lunchEndM] = (daySchedule.lunchEnd || '14:00').split(':').map(Number);

            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;
            const lunchStartMinutes = lunchStartH * 60 + lunchStartM;
            const lunchEndMinutes = lunchEndH * 60 + lunchEndM;

            const allSlots = [];
            for (let m = startMinutes; m + slotDuration <= endMinutes; m += slotDuration) {
                if (m >= lunchStartMinutes && m < lunchEndMinutes) continue;
                const h = Math.floor(m / 60);
                const min = m % 60;
                const time24 = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const time12 = formatTime12Hr(time24);
                allSlots.push({ time24, time12 });
            }

            // Check bookings
            let bookedSlotSet = new Set();
            if (mongoose.connection.readyState === 1) {
                const existing = await Appointment.find({
                    doctor: id,
                    date,
                    status: { $nin: ['CANCELLED', 'RESCHEDULED'] }
                }).select('timeSlot');
                existing.forEach(b => bookedSlotSet.add(b.timeSlot));
            } else {
                mockAppointments.filter(b => (b.doctor._id === id || b.doctor.id === id || b.doctor === id) && b.date === date && b.status !== 'CANCELLED')
                    .forEach(b => bookedSlotSet.add(b.timeSlot));
            }

            const computedSlots = allSlots.map(s => ({
                time24: s.time24,
                slot: s.time12,
                isAvailable: !bookedSlotSet.has(s.time12) && !bookedSlotSet.has(s.time24)
            }));

            return res.json({
                success: true,
                date,
                day: dayName,
                doctorName: doctor.name,
                slotDurationMinutes: slotDuration,
                totalSlots: computedSlots.length,
                availableSlotsCount: computedSlots.filter(s => s.isAvailable).length,
                slots: computedSlots
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/doctors/portal/appointments/:id/cancel
    cancelAppointment: async (req, res) => {
        try {
            const { id } = req.params;
            const { reason = 'Cancelled by attending physician' } = req.body;

            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
                const app = await Appointment.findById(id);
                if (!app) return res.status(404).json({ success: false, message: 'Appointment not found' });

                app.status = 'CANCELLED';
                app.cancellationReason = reason;
                if (!app.notes) {
                    app.notes = `Cancellation Note: ${reason}`;
                } else {
                    app.notes = `${app.notes} | Cancellation Note: ${reason}`;
                }
                await app.save();

                return res.json({
                    success: true,
                    message: 'Appointment cancelled successfully.',
                    data: app
                });
            }

            const app = mockAppointments.find(a => a._id === id || a.id === id);
            if (!app) return res.status(404).json({ success: false, message: 'Appointment not found' });

            app.status = 'CANCELLED';
            app.cancellationReason = reason;
            app.notes = app.notes ? `${app.notes} | Cancellation Note: ${reason}` : `Cancellation Note: ${reason}`;

            return res.json({
                success: true,
                message: 'Appointment cancelled successfully.',
                data: app
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors/portal/patient-removal-requests
    getPatientRemovalRequests: async (req, res) => {
        try {
            const { doctorId } = req.query;

            if (mongoose.connection.readyState === 1) {
                const filter = doctorId ? { doctorId } : {};
                const requests = await PatientRemovalRequest.find(filter).sort({ createdAt: -1 });
                return res.json({ success: true, data: requests });
            }

            const requests = doctorId
                ? mockPatientRemovalRequests.filter(r => r.doctorId === doctorId)
                : mockPatientRemovalRequests;

            return res.json({ success: true, data: requests });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/doctors/portal/patient-removal-requests
    requestPatientRemoval: async (req, res) => {
        try {
            const { patientId, patientName, reason, notes, doctorId, doctorName } = req.body;

            if (!patientName || !reason) {
                return res.status(400).json({ success: false, message: 'Patient name and removal reason are required.' });
            }

            const docName = doctorName || (req.user ? req.user.name : 'Attending Physician');
            const docId = doctorId || (req.user ? (req.user.staffId || req.user.id || req.user._id) : 'DOC001');

            if (mongoose.connection.readyState === 1) {
                const request = await PatientRemovalRequest.create({
                    patientId: patientId || `pat-${Date.now()}`,
                    patientName,
                    doctorId: docId,
                    doctorName: docName,
                    reason,
                    notes: notes || '',
                    status: 'Pending',
                    requestedAt: new Date()
                });

                return res.status(201).json({
                    success: true,
                    message: 'Patient removal request submitted for Administrator approval.',
                    data: request
                });
            }

            const newRequest = {
                _id: `rem-req-${Date.now()}`,
                id: `rem-req-${Date.now()}`,
                patientId: patientId || `pat-${Date.now()}`,
                patientName,
                doctorId: docId,
                doctorName: docName,
                reason,
                notes: notes || '',
                status: 'Pending',
                adminNote: '',
                requestedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };

            mockPatientRemovalRequests.unshift(newRequest);

            return res.status(201).json({
                success: true,
                message: 'Patient removal request submitted for Administrator approval.',
                data: newRequest
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/doctors/portal/profile
    getDoctorProfile: async (req, res) => {
        try {
            const docEmail = req.user?.email || req.query.email || 'dr.smith@hms.com';

            if (mongoose.connection.readyState === 1) {
                const user = await User.findOne({ email: docEmail.toLowerCase() });
                const doctor = await Doctor.findOne({ email: docEmail.toLowerCase() }).populate('specialty');

                return res.json({
                    success: true,
                    data: {
                        name: user?.name || doctor?.name || 'Dr. Sarah Smith',
                        email: user?.email || doctor?.email || docEmail,
                        phone: user?.phone || doctor?.phone || '+1 (555) 123-4567',
                        department: user?.department || doctor?.department || 'Cardiology',
                        specialization: doctor?.qualifications || 'Cardiologist (MD)',
                        experience: doctor?.experienceYears ? `${doctor.experienceYears} Years` : '12 Years',
                        roomNumber: doctor?.roomNumber || 'Room 104',
                        consultationFee: doctor?.consultationFee || 65,
                        id: user?.staffId || user?._id || 'DOC001'
                    }
                });
            }

            const user = mockUsers.find(u => u.email.toLowerCase() === docEmail.toLowerCase()) || mockUsers[1];
            const doctor = MOCK_DOCTORS.find(d => d.email?.toLowerCase() === docEmail.toLowerCase()) || MOCK_DOCTORS[0];

            return res.json({
                success: true,
                data: {
                    name: user?.name || doctor?.name || 'Dr. Sarah Smith',
                    email: user?.email || doctor?.email || docEmail,
                    phone: user?.phone || doctor?.phone || '+1 (555) 123-4567',
                    department: user?.department || doctor?.department || 'Cardiology',
                    specialization: doctor?.qualifications || 'Cardiologist (MD)',
                    experience: doctor?.experienceYears ? `${doctor.experienceYears} Years` : '12 Years',
                    roomNumber: doctor?.roomNumber || 'Room 104',
                    consultationFee: doctor?.consultationFee || 65,
                    id: user?.staffId || user?._id || 'DOC001'
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /api/doctors/portal/profile
    updateDoctorProfile: async (req, res) => {
        try {
            const { name, phone, department, specialization, experience, roomNumber, consultationFee, email } = req.body;
            const targetEmail = email || req.user?.email || 'dr.smith@hms.com';

            if (mongoose.connection.readyState === 1) {
                const user = await User.findOne({ email: targetEmail.toLowerCase() });
                if (user) {
                    if (name) user.name = name;
                    if (phone) user.phone = phone;
                    if (department) user.department = department;
                    await user.save();
                }

                const doctor = await Doctor.findOne({ email: targetEmail.toLowerCase() });
                if (doctor) {
                    if (name) doctor.name = name.startsWith('Dr.') ? name : `Dr. ${name}`;
                    if (department) doctor.department = department;
                    if (specialization) doctor.qualifications = specialization;
                    if (roomNumber) doctor.roomNumber = roomNumber;
                    if (consultationFee) doctor.consultationFee = Number(consultationFee);
                    if (experience) doctor.experienceYears = parseInt(experience, 10) || doctor.experienceYears;
                    await doctor.save();
                }

                return res.json({
                    success: true,
                    message: 'Doctor profile updated successfully.',
                    data: { name, phone, department, specialization, experience, roomNumber, consultationFee }
                });
            }

            const user = mockUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
            if (user) {
                if (name) user.name = name;
                if (phone) user.phone = phone;
                if (department) user.department = department;
            }

            const doctor = MOCK_DOCTORS.find(d => d.email?.toLowerCase() === targetEmail.toLowerCase());
            if (doctor) {
                if (name) doctor.name = name;
                if (department) doctor.department = department;
            }

            return res.json({
                success: true,
                message: 'Doctor profile updated successfully.',
                data: { name, phone, department, specialization, experience, roomNumber, consultationFee }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
