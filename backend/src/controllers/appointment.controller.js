import mongoose from 'mongoose';
import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';
import { mockAppointments, MOCK_DOCTORS, MOCK_HOSPITALS, mockUsers } from '../data/mockFallback.js';

export const appointmentController = {
    // POST /api/appointments
    createAppointment: async (req, res) => {
        try {
            const {
                doctorId,
                hospitalId,
                specialtyId,
                department,
                date,
                timeSlot,
                symptoms,
                notes,
                patientName,
                patientEmail,
                patientPhone,
                patientAge,
                patientGender
            } = req.body;

            const patientId = req.user ? (req.user._id || req.user.id) : req.body.patientId;

            if (!doctorId || !hospitalId || !date || !timeSlot) {
                return res.status(400).json({
                    success: false,
                    message: 'Doctor ID, Hospital ID, Date, and Time Slot are required.'
                });
            }

            const isMongoConnected = mongoose.connection.readyState === 1;
            const isDoctorObjectId = mongoose.Types.ObjectId.isValid(doctorId);
            const isHospitalObjectId = mongoose.Types.ObjectId.isValid(hospitalId);

            // MongoDB Mode
            if (isMongoConnected && isDoctorObjectId && isHospitalObjectId) {
                const doctor = await Doctor.findById(doctorId);
                if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

                if (doctor.leaveDates && doctor.leaveDates.includes(date)) {
                    return res.status(400).json({ success: false, message: `${doctor.name} is on leave on ${date}.` });
                }

                const existing = await Appointment.findOne({
                    doctor: doctorId,
                    date,
                    timeSlot,
                    status: { $nin: ['CANCELLED', 'RESCHEDULED'] }
                });

                if (existing) {
                    return res.status(409).json({
                        success: false,
                        message: `Slot ${timeSlot} on ${date} is already booked. Please choose another slot.`
                    });
                }

                const appointmentNumber = `APT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
                const queueToken = `OPD-${Math.floor(100 + Math.random() * 900)}`;

                const appointment = await Appointment.create({
                    appointmentNumber,
                    patient: patientId,
                    patientName: patientName || (req.user ? req.user.name : 'Patient'),
                    patientEmail: patientEmail || (req.user ? req.user.email : ''),
                    patientPhone: patientPhone || (req.user ? req.user.phone : ''),
                    patientAge: patientAge || 30,
                    patientGender: patientGender || 'Male',
                    doctor: doctorId,
                    hospital: hospitalId,
                    specialty: specialtyId || doctor.specialty,
                    department: department || doctor.department,
                    date,
                    timeSlot,
                    status: 'CONFIRMED',
                    queueToken,
                    symptoms: symptoms || '',
                    notes: notes || '',
                    amount: doctor.consultationFee || 50,
                    paymentStatus: 'PAID'
                });

                if (patientId && mongoose.Types.ObjectId.isValid(patientId)) {
                    await User.findByIdAndUpdate(patientId, {
                        $push: {
                            notifications: {
                                title: 'Appointment Confirmed',
                                message: `Your appointment with ${doctor.name} on ${date} at ${timeSlot} is confirmed. Token: ${queueToken}`,
                                type: 'APPOINTMENT',
                                date: new Date().toISOString()
                            }
                        }
                    });
                }

                const populated = await Appointment.findById(appointment._id)
                    .populate('doctor', 'name qualifications roomNumber consultationFee')
                    .populate('hospital', 'name address city emergencyPhone')
                    .populate('specialty', 'name');

                return res.status(201).json({ success: true, message: 'Appointment booked successfully', data: populated });
            }

            // In-Memory Mode
            const doctor = MOCK_DOCTORS.find(d => d._id === doctorId || d.id === doctorId);
            const hospital = MOCK_HOSPITALS.find(h => h._id === hospitalId || h.id === hospitalId);

            const isDoubleBooked = mockAppointments.some(a =>
                (a.doctor?._id === doctorId || a.doctor?.id === doctorId || a.doctor === doctorId) &&
                a.date === date &&
                a.timeSlot === timeSlot &&
                a.status !== 'CANCELLED'
            );

            if (isDoubleBooked) {
                return res.status(409).json({
                    success: false,
                    message: `Slot ${timeSlot} on ${date} is already booked. Please choose another slot.`
                });
            }

            const appointmentNumber = `APT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
            const queueToken = `OPD-${Math.floor(100 + Math.random() * 900)}`;

            const newApt = {
                _id: `apt-${Date.now()}`,
                id: `apt-${Date.now()}`,
                appointmentNumber,
                patient: { _id: patientId, name: patientName, email: patientEmail, phone: patientPhone },
                patientName: patientName || 'Patient',
                patientEmail: patientEmail || '',
                patientPhone: patientPhone || '',
                patientAge: patientAge || 30,
                patientGender: patientGender || 'Male',
                doctor: doctor || { name: 'Doctor' },
                hospital: hospital || { name: 'Hospital' },
                department: department || (doctor ? doctor.department : 'General'),
                date,
                timeSlot,
                status: 'CONFIRMED',
                queueToken,
                symptoms: symptoms || '',
                amount: doctor ? doctor.consultationFee : 50,
                paymentStatus: 'PAID'
            };

            mockAppointments.unshift(newApt);

            if (patientId) {
                const user = mockUsers.find(u => u._id === patientId || u.id === patientId);
                if (user) {
                    if (!user.notifications) user.notifications = [];
                    user.notifications.unshift({
                        id: Date.now().toString(),
                        title: 'Appointment Confirmed',
                        message: `Your appointment with ${doctor?.name || 'Doctor'} on ${date} at ${timeSlot} is confirmed. Token: ${queueToken}`,
                        type: 'APPOINTMENT',
                        date: new Date().toISOString(),
                        read: false
                    });
                }
            }

            return res.status(201).json({ success: true, message: 'Appointment booked successfully', data: newApt });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/appointments
    getAppointments: async (req, res) => {
        try {
            const { doctor, hospital, status, date, page = 1, limit = 20 } = req.query;

            if (mongoose.connection.readyState === 1) {
                const query = {};
                if (doctor && mongoose.Types.ObjectId.isValid(doctor)) query.doctor = doctor;
                if (hospital && mongoose.Types.ObjectId.isValid(hospital)) query.hospital = hospital;
                if (status) query.status = status;
                if (date) query.date = date;

                const total = await Appointment.countDocuments(query);
                if (total > 0) {
                    const skip = (Number(page) - 1) * Number(limit);
                    const appointments = await Appointment.find(query)
                        .populate('doctor', 'name qualifications roomNumber department')
                        .populate('hospital', 'name address city')
                        .populate('patient', 'name email phone')
                        .skip(skip)
                        .limit(Number(limit))
                        .sort({ date: -1 });

                    return res.json({
                        success: true,
                        data: appointments,
                        pagination: {
                            total,
                            page: Number(page),
                            limit: Number(limit),
                            totalPages: Math.ceil(total / Number(limit))
                        }
                    });
                }
            }

            let filtered = [...mockAppointments];
            if (doctor) filtered = filtered.filter(a => a.doctor?._id === doctor || a.doctor?.id === doctor);
            if (hospital) filtered = filtered.filter(a => a.hospital?._id === hospital || a.hospital?.id === hospital);
            if (status) filtered = filtered.filter(a => a.status === status);
            if (date) filtered = filtered.filter(a => a.date === date);

            return res.json({
                success: true,
                data: filtered,
                pagination: {
                    total: filtered.length,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: 1
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/appointments/patient
    getPatientAppointments: async (req, res) => {
        try {
            const patientId = req.user ? (req.user._id || req.user.id) : null;
            if (!patientId) return res.status(401).json({ success: false, message: 'Authentication required' });

            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(patientId)) {
                const appointments = await Appointment.find({ patient: patientId })
                    .populate('doctor', 'name qualifications roomNumber consultationFee department')
                    .populate('hospital', 'name address city contactPhone emergencyPhone')
                    .populate('specialty', 'name icon')
                    .sort({ date: -1 });

                return res.json({ success: true, data: appointments });
            }

            const appointments = mockAppointments.filter(a => a.patient?._id === patientId || a.patient?.id === patientId || a.patient === patientId);
            return res.json({ success: true, data: appointments });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/appointments/:id
    getAppointmentById: async (req, res) => {
        try {
            const { id } = req.params;
            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
                const appointment = await Appointment.findById(id)
                    .populate('doctor')
                    .populate('hospital')
                    .populate('patient', 'name email phone');
                if (appointment) return res.json({ success: true, data: appointment });
            }

            const appointment = mockAppointments.find(a => a._id === id || a.id === id || a.appointmentNumber === id);
            if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

            return res.json({ success: true, data: appointment });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/appointments/:id/status
    updateAppointmentStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, cancellationReason, newDate, newTimeSlot } = req.body;

            if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
                const appointment = await Appointment.findById(id);
                if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

                if (newDate && newTimeSlot) {
                    const existing = await Appointment.findOne({
                        _id: { $ne: id },
                        doctor: appointment.doctor,
                        date: newDate,
                        timeSlot: newTimeSlot,
                        status: { $nin: ['CANCELLED', 'RESCHEDULED'] }
                    });
                    if (existing) {
                        return res.status(409).json({ success: false, message: `Slot ${newTimeSlot} on ${newDate} is already booked.` });
                    }
                    appointment.date = newDate;
                    appointment.timeSlot = newTimeSlot;
                    appointment.status = 'RESCHEDULED';
                } else if (status) {
                    appointment.status = status;
                }

                if (cancellationReason) {
                    appointment.notes = (appointment.notes ? appointment.notes + ' | ' : '') + `Cancelled: ${cancellationReason}`;
                }

                await appointment.save();
                return res.json({ success: true, message: `Appointment status updated to ${appointment.status}`, data: appointment });
            }

            const aptIndex = mockAppointments.findIndex(a => a._id === id || a.id === id);
            if (aptIndex === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });

            if (newDate && newTimeSlot) {
                mockAppointments[aptIndex].date = newDate;
                mockAppointments[aptIndex].timeSlot = newTimeSlot;
                mockAppointments[aptIndex].status = 'RESCHEDULED';
            } else if (status) {
                mockAppointments[aptIndex].status = status;
            }

            return res.json({ success: true, message: `Appointment status updated`, data: mockAppointments[aptIndex] });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
