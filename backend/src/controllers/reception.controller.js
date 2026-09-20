import mongoose from 'mongoose';
import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';
import { mockAppointments, MOCK_DOCTORS, MOCK_HOSPITALS, mockUsers } from '../data/mockFallback.js';

export const receptionController = {
    // GET /api/reception/overview-stats
    getOverviewStats: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const totalDoctors = await Doctor.countDocuments();
                const availableDoctors = await Doctor.countDocuments({ isAvailableToday: true });
                const appointments = await Appointment.find().populate('doctor');

                const totalAppointments = appointments.length;
                const checkedIn = appointments.filter(a => ['CONFIRMED', 'CHECKED-IN'].includes((a.status || '').toUpperCase())).length;
                const inQueue = appointments.filter(a => ['CONFIRMED', 'CHECKED-IN'].includes((a.status || '').toUpperCase()) && a.queueToken).length;

                // Department queue breakdown
                const deptMap = {};
                appointments.forEach(a => {
                    const dept = a.department || (a.doctor ? a.doctor.department : 'General Med');
                    deptMap[dept] = (deptMap[dept] || 0) + 1;
                });

                return res.json({
                    success: true,
                    data: {
                        todayAppointments: totalAppointments,
                        checkedIn,
                        inQueue,
                        availableDoctors,
                        totalDoctors: totalDoctors || 1,
                        departmentQueues: deptMap
                    }
                });
            }

            // In-Memory Fallback
            const totalDoctors = MOCK_DOCTORS.length;
            const availableDoctors = MOCK_DOCTORS.filter(d => d.isAvailableToday).length;
            const totalAppointments = mockAppointments.length;
            const checkedIn = mockAppointments.filter(a => ['CONFIRMED', 'CHECKED-IN'].includes((a.status || '').toUpperCase())).length;
            const inQueue = mockAppointments.filter(a => a.queueToken).length;

            const deptMap = {};
            mockAppointments.forEach(a => {
                const dept = a.department || 'General Med';
                deptMap[dept] = (deptMap[dept] || 0) + 1;
            });

            return res.json({
                success: true,
                data: {
                    todayAppointments: totalAppointments,
                    checkedIn,
                    inQueue,
                    availableDoctors,
                    totalDoctors,
                    departmentQueues: deptMap
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/reception/doctors
    getDoctors: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const docs = await Doctor.find().select('name department consultationFee roomNumber isAvailableToday');
                return res.json({ success: true, data: docs });
            }
            return res.json({
                success: true,
                data: MOCK_DOCTORS.map(d => ({
                    _id: d._id,
                    id: d.id,
                    name: d.name,
                    department: d.department,
                    consultationFee: d.consultationFee,
                    roomNumber: d.roomNumber,
                    isAvailableToday: d.isAvailableToday
                }))
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/reception/appointments
    getAppointments: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const appointments = await Appointment.find()
                    .populate('doctor')
                    .populate('hospital')
                    .populate('patient')
                    .sort({ createdAt: -1 });

                const mapped = appointments.map(app => ({
                    id: app._id.toString(),
                    _id: app._id.toString(),
                    appointmentNumber: app.appointmentNumber,
                    time: app.timeSlot || '09:00 AM',
                    date: app.date,
                    patientName: app.patientName || (app.patient ? app.patient.name : 'Walk-in Patient'),
                    patientEmail: app.patientEmail || (app.patient ? app.patient.email : ''),
                    doctorName: app.doctor ? app.doctor.name : 'Attending Physician',
                    doctorId: app.doctor ? (app.doctor._id || app.doctor.id) : null,
                    department: app.department || (app.doctor ? app.doctor.department : 'General Med'),
                    type: 'Clinical Consultation',
                    status: (app.status || 'scheduled').toLowerCase(),
                    details: app.symptoms || 'General Checkup & Clinical Assessment',
                    contact: app.patientPhone || (app.patient ? app.patient.phone : '+1 555-0100'),
                    queueToken: app.queueToken || '',
                    amount: app.amount || 50,
                    paymentStatus: app.paymentStatus || 'PENDING'
                }));

                return res.json({ success: true, data: mapped });
            }

            // In-Memory Fallback
            const mapped = mockAppointments.map(app => ({
                id: app._id || app.id,
                _id: app._id || app.id,
                appointmentNumber: app.appointmentNumber || `APT-${Date.now().toString().slice(-6)}`,
                time: app.timeSlot || app.time || '10:00 AM',
                date: app.date || new Date().toISOString().split('T')[0],
                patientName: app.patientName || (app.patient ? app.patient.name : 'Walk-in Patient'),
                patientEmail: app.patientEmail || (app.patient ? app.patient.email : ''),
                doctorName: (app.doctor && app.doctor.name) ? app.doctor.name : (app.doctorName || 'Dr. Sarah Smith'),
                doctorId: (app.doctor && app.doctor._id) ? app.doctor._id : 'doc-1',
                department: app.department || 'Cardiology',
                type: 'Clinical Consultation',
                status: (app.status || 'scheduled').toLowerCase(),
                details: app.symptoms || app.details || 'General Checkup',
                contact: app.patientPhone || app.contact || '+1 555-0199',
                queueToken: app.queueToken || 'OPD-101',
                amount: app.amount || 65,
                paymentStatus: app.paymentStatus || 'PAID'
            }));

            return res.json({ success: true, data: mapped });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/reception/appointments
    createAppointment: async (req, res) => {
        try {
            const data = req.body;
            const patientName = data.patientName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Registered Patient';
            const date = data.date || new Date().toISOString().split('T')[0];
            const timeSlot = data.time || data.timeSlot || '10:00 AM';
            const symptoms = data.symptoms || data.details || 'Initial Consultation';
            const department = data.department || 'General Medicine';
            const tokenNum = `OPD-${Math.floor(100 + Math.random() * 900)}`;

            if (mongoose.connection.readyState === 1) {
                // Find doctor
                let doc = null;
                if (data.doctorId) {
                    doc = await Doctor.findById(data.doctorId);
                } else if (data.doctorName || data.doctor) {
                    const docSearch = data.doctorName || data.doctor;
                    doc = await Doctor.findOne({ name: new RegExp(docSearch, 'i') });
                }
                if (!doc) doc = await Doctor.findOne();

                // Find hospital
                let hosp = doc ? await Hospital.findById(doc.hospital) : await Hospital.findOne();
                if (!hosp) hosp = await Hospital.findOne();

                const newApp = await Appointment.create({
                    appointmentNumber: `APT-${Date.now().toString().slice(-6)}`,
                    patientName,
                    patientPhone: data.phone || data.contact || '',
                    patientEmail: data.email || '',
                    patientAge: Number(data.age) || 30,
                    patientGender: data.gender || 'Male',
                    doctor: doc._id,
                    hospital: hosp ? hosp._id : null,
                    department: doc.department || department,
                    date,
                    timeSlot,
                    status: 'CONFIRMED',
                    queueToken: tokenNum,
                    symptoms,
                    amount: doc.consultationFee || 50,
                    paymentStatus: 'PAID'
                });

                return res.status(201).json({
                    success: true,
                    data: {
                        id: newApp._id.toString(),
                        appointmentNumber: newApp.appointmentNumber,
                        time: newApp.timeSlot,
                        date: newApp.date,
                        patientName: newApp.patientName,
                        doctorName: doc.name,
                        department: newApp.department,
                        type: 'Clinical Consultation',
                        status: 'scheduled',
                        details: newApp.symptoms,
                        contact: newApp.patientPhone,
                        queueToken: newApp.queueToken,
                        amount: newApp.amount,
                        paymentStatus: newApp.paymentStatus
                    }
                });
            }

            // In-Memory Fallback
            const newAppointment = {
                _id: `apt-${Date.now()}`,
                id: `apt-${Date.now()}`,
                appointmentNumber: `APT-${Date.now().toString().slice(-6)}`,
                time: timeSlot,
                timeSlot,
                date,
                patientName,
                patientPhone: data.phone || data.contact || '',
                patientEmail: data.email || '',
                doctorName: data.doctorName || data.doctor || MOCK_DOCTORS[0].name,
                doctor: MOCK_DOCTORS[0],
                hospital: MOCK_HOSPITALS[0],
                department,
                type: 'Clinical Consultation',
                status: 'scheduled',
                details: symptoms,
                symptoms,
                contact: data.phone || data.contact || '+1 555-0100',
                queueToken: tokenNum,
                amount: 65,
                paymentStatus: 'PAID'
            };

            mockAppointments.unshift(newAppointment);
            return res.status(201).json({ success: true, data: newAppointment });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /api/reception/appointments/:id
    updateAppointment: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
                const app = await Appointment.findById(id).populate('doctor');
                if (!app) return res.status(404).json({ success: false, message: 'Appointment not found' });

                if (updates.status) {
                    const normalized = updates.status.toUpperCase();
                    if (normalized === 'CHECKED-IN') app.status = 'CONFIRMED';
                    else if (normalized === 'SCHEDULED') app.status = 'BOOKED';
                    else if (['CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'].includes(normalized)) {
                        app.status = normalized;
                    }
                }
                if (updates.time) app.timeSlot = updates.time;
                if (updates.date) app.date = updates.date;
                if (updates.doctorName) {
                    const doc = await Doctor.findOne({ name: new RegExp(updates.doctorName, 'i') });
                    if (doc) app.doctor = doc._id;
                }

                await app.save();
                return res.json({
                    success: true,
                    data: {
                        id: app._id.toString(),
                        time: app.timeSlot,
                        date: app.date,
                        patientName: app.patientName,
                        doctorName: app.doctor ? app.doctor.name : updates.doctorName,
                        status: (app.status || 'scheduled').toLowerCase(),
                        details: app.symptoms,
                        contact: app.patientPhone
                    }
                });
            }

            // In-Memory Fallback
            const app = mockAppointments.find(a => a._id === id || a.id === id);
            if (!app) return res.status(404).json({ success: false, message: 'Appointment not found' });

            if (updates.status) app.status = updates.status;
            if (updates.time) {
                app.time = updates.time;
                app.timeSlot = updates.time;
            }
            if (updates.date) app.date = updates.date;
            if (updates.doctorName) app.doctorName = updates.doctorName;

            return res.json({ success: true, data: app });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /api/reception/appointments/:id
    cancelAppointment: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
                await Appointment.findByIdAndUpdate(id, { status: 'CANCELLED' });
                return res.json({ success: true, message: 'Appointment cancelled successfully' });
            }

            const app = mockAppointments.find(a => a._id === id || a.id === id);
            if (app) app.status = 'cancelled';

            return res.json({ success: true, message: 'Appointment cancelled successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/reception/queue
    getQueueState: async (req, res) => {
        try {
            const doctorsMap = {};

            if (mongoose.connection.readyState === 1) {
                const doctors = await Doctor.find();
                const appointments = await Appointment.find({ status: { $in: ['CONFIRMED', 'CHECKED-IN'] } }).populate('doctor');

                doctors.forEach(doc => {
                    const docApps = appointments.filter(a => a.doctor && a.doctor._id.toString() === doc._id.toString());
                    const current = docApps.find(a => a.status === 'IN_PROGRESS') || null;
                    const waiting = docApps
                        .filter(a => a.status !== 'IN_PROGRESS')
                        .map(a => ({
                            token: a.queueToken || `OPD-${Math.floor(100 + Math.random() * 900)}`,
                            name: a.patientName,
                            time: a.timeSlot || '09:00 AM'
                        }));

                    doctorsMap[doc.name] = {
                        status: current ? 'BUSY' : (doc.isAvailableToday ? 'AVAILABLE' : 'OFF_DUTY'),
                        department: doc.department,
                        current: current ? { token: current.queueToken || 'OPD-101', name: current.patientName, time: current.timeSlot } : null,
                        waiting
                    };
                });

                return res.json({ success: true, data: { doctors: doctorsMap } });
            }

            // In-Memory Fallback
            MOCK_DOCTORS.forEach(doc => {
                const docApps = mockAppointments.filter(a => a.doctorName === doc.name || (a.doctor && a.doctor.name === doc.name));
                const waiting = docApps.map(a => ({
                    token: a.queueToken || 'OPD-101',
                    name: a.patientName,
                    time: a.timeSlot || '10:00 AM'
                }));

                doctorsMap[doc.name] = {
                    status: 'AVAILABLE',
                    department: doc.department,
                    current: null,
                    waiting
                };
            });

            return res.json({ success: true, data: { doctors: doctorsMap } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /api/reception/queue
    updateQueueState: (req, res) => {
        try {
            const newQueueState = req.body;
            return res.json({ success: true, data: newQueueState });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/reception/invoices
    getInvoices: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const appointments = await Appointment.find().populate('doctor').sort({ createdAt: -1 });
                const invoices = appointments.map((app, idx) => ({
                    id: `INV-${app.date ? app.date.replace(/-/g, '') : '2026'}-${(idx + 1).toString().padStart(3, '0')}`,
                    patient: app.patientName,
                    date: app.date || new Date().toISOString().split('T')[0],
                    status: (app.paymentStatus || 'PAID').toLowerCase() === 'paid' ? 'Paid' : 'Pending',
                    items: [
                        {
                            description: `Consultation - ${app.doctor ? app.doctor.name : 'Specialist'} (${app.department || 'General'})`,
                            amount: app.amount || 50
                        }
                    ]
                }));
                return res.json({ success: true, data: invoices });
            }

            // In-Memory Fallback
            const invoices = mockAppointments.map((app, idx) => ({
                id: `INV-2026-${(idx + 1).toString().padStart(3, '0')}`,
                patient: app.patientName,
                date: app.date || new Date().toISOString().split('T')[0],
                status: (app.paymentStatus || 'PAID').toLowerCase() === 'paid' ? 'Paid' : 'Pending',
                items: [
                    {
                        description: `Consultation - ${app.doctorName || 'Dr. Sarah Smith'} (${app.department || 'Cardiology'})`,
                        amount: app.amount || 65
                    }
                ]
            }));

            return res.json({ success: true, data: invoices });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/reception/invoices
    createInvoice: async (req, res) => {
        try {
            const invoiceData = req.body;
            const newInvoice = {
                ...invoiceData,
                id: invoiceData.id || `INV-${Date.now().toString().slice(-6)}`,
                date: invoiceData.date || new Date().toISOString().split('T')[0],
                status: invoiceData.status || 'Pending'
            };
            return res.status(201).json({ success: true, data: newInvoice });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/reception/patients/pending
    getPendingPatients: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const pendingPatients = await User.find({ role: 'patient', status: 'Pending' })
                    .select('-passwordHash')
                    .sort({ createdAt: -1 })
                    .lean();
                return res.json({ success: true, data: pendingPatients });
            }

            const pending = mockUsers.filter(u => u.role === 'patient' && u.status === 'Pending');
            return res.json({ success: true, data: pending });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/reception/patients/:id/approve
    approvePatient: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { staffId: id };
                const user = await User.findOne(query);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'Patient not found' });
                }

                user.status = 'Active';
                user.notifications.push({
                    id: Date.now().toString(),
                    title: 'Patient Account Activated',
                    message: 'Your patient account has been verified and activated by the Reception Desk. You may now sign in and manage your health records.',
                    type: 'SYSTEM',
                    date: new Date().toISOString()
                });
                await user.save();

                return res.json({
                    success: true,
                    message: `Patient ${user.name} approved and activated successfully.`,
                    patient: user
                });
            }

            const user = mockUsers.find(u => u.staffId === id || u.id === id || u._id === id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Patient not found' });
            }

            user.status = 'Active';
            return res.json({
                success: true,
                message: `Patient ${user.name} approved and activated successfully.`,
                patient: user
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/reception/patients/:id/reject
    rejectPatient: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { staffId: id };
                const user = await User.findOne(query);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'Patient not found' });
                }

                user.status = 'Rejected';
                await user.save();

                return res.json({
                    success: true,
                    message: `Registration for patient ${user.name} was rejected.`
                });
            }

            const user = mockUsers.find(u => u.staffId === id || u.id === id || u._id === id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Patient not found' });
            }

            user.status = 'Rejected';
            return res.json({
                success: true,
                message: `Registration for patient ${user.name} was rejected.`
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

