import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Appointment } from '../models/Appointment.js';
import { Hospital } from '../models/Hospital.js';
import { Doctor } from '../models/Doctor.js';
import { mockUsers, mockAppointments, MOCK_HOSPITALS, MOCK_DOCTORS } from '../data/mockFallback.js';

export const patientController = {
    // GET /api/patient/dashboard
    getDashboard: async (req, res) => {
        try {
            const patientId = req.user ? (req.user._id || req.user.id) : null;
            if (!patientId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            if (mongoose.connection.readyState === 1) {
                const today = new Date().toISOString().split('T')[0];
                const upcomingAppointment = await Appointment.findOne({
                    patient: patientId,
                    date: { $gte: today },
                    status: { $in: ['BOOKED', 'CONFIRMED', 'RESCHEDULED'] }
                })
                    .populate('doctor', 'name qualifications roomNumber department')
                    .populate('hospital', 'name address city emergencyPhone')
                    .populate('specialty', 'name icon')
                    .sort({ date: 1, timeSlot: 1 });

                const totalAppointments = await Appointment.countDocuments({ patient: patientId });
                const completedCount = await Appointment.countDocuments({ patient: patientId, status: 'COMPLETED' });

                const user = await User.findById(patientId)
                    .populate({
                        path: 'savedHospitals',
                        select: 'name tagline address city rating totalBeds availableBeds'
                    })
                    .populate({
                        path: 'savedDoctors',
                        select: 'name qualifications department experienceYears rating consultationFee'
                    });

                return res.json({
                    success: true,
                    data: {
                        user: { name: user.name, email: user.email, phone: user.phone },
                        upcomingAppointment,
                        stats: {
                            totalAppointments,
                            completedCount,
                            savedHospitalsCount: (user.savedHospitals || []).length,
                            savedDoctorsCount: (user.savedDoctors || []).length
                        },
                        savedHospitals: user.savedHospitals || [],
                        savedDoctors: user.savedDoctors || [],
                        notifications: (user.notifications || []).slice(0, 10)
                    }
                });
            }

            // Fallback In-Memory Dashboard
            const user = mockUsers.find(u => u._id === patientId || u.id === patientId) || { name: 'Patient', email: 'patient@hms.com', phone: '', savedHospitals: [], savedDoctors: [], notifications: [] };
            const patientApts = mockAppointments.filter(a => a.patient?._id === patientId || a.patient?.id === patientId || a.patient === patientId);
            const upcomingAppointment = patientApts.find(a => a.status === 'CONFIRMED' || a.status === 'BOOKED' || a.status === 'RESCHEDULED') || null;

            return res.json({
                success: true,
                data: {
                    user: { name: user.name, email: user.email, phone: user.phone },
                    upcomingAppointment,
                    stats: {
                        totalAppointments: patientApts.length,
                        completedCount: patientApts.filter(a => a.status === 'COMPLETED').length,
                        savedHospitalsCount: (user.savedHospitals || []).length,
                        savedDoctorsCount: (user.savedDoctors || []).length
                    },
                    savedHospitals: user.savedHospitals || [MOCK_HOSPITALS[0]],
                    savedDoctors: user.savedDoctors || [MOCK_DOCTORS[0]],
                    notifications: user.notifications || []
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/patient/save-hospital
    toggleSaveHospital: async (req, res) => {
        try {
            const { hospitalId } = req.body;
            const patientId = req.user._id || req.user.id;

            if (mongoose.connection.readyState === 1) {
                const user = await User.findById(patientId);
                const isSaved = user.savedHospitals.some(id => id.toString() === hospitalId);
                if (isSaved) {
                    user.savedHospitals = user.savedHospitals.filter(id => id.toString() !== hospitalId);
                } else {
                    user.savedHospitals.push(hospitalId);
                }
                await user.save();
                return res.json({ success: true, saved: !isSaved, message: !isSaved ? 'Hospital saved' : 'Hospital removed' });
            }

            const user = mockUsers.find(u => u._id === patientId || u.id === patientId);
            if (user) {
                if (!user.savedHospitals) user.savedHospitals = [];
                const idx = user.savedHospitals.findIndex(h => (h._id || h.id || h) === hospitalId);
                if (idx > -1) {
                    user.savedHospitals.splice(idx, 1);
                    return res.json({ success: true, saved: false, message: 'Hospital removed from favorites' });
                } else {
                    const hosp = MOCK_HOSPITALS.find(h => h._id === hospitalId || h.id === hospitalId) || hospitalId;
                    user.savedHospitals.push(hosp);
                    return res.json({ success: true, saved: true, message: 'Hospital saved to favorites' });
                }
            }
            return res.json({ success: true, saved: true, message: 'Hospital saved' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/patient/save-doctor
    toggleSaveDoctor: async (req, res) => {
        try {
            const { doctorId } = req.body;
            const patientId = req.user._id || req.user.id;

            if (mongoose.connection.readyState === 1) {
                const user = await User.findById(patientId);
                const isSaved = user.savedDoctors.some(id => id.toString() === doctorId);
                if (isSaved) {
                    user.savedDoctors = user.savedDoctors.filter(id => id.toString() !== doctorId);
                } else {
                    user.savedDoctors.push(doctorId);
                }
                await user.save();
                return res.json({ success: true, saved: !isSaved, message: !isSaved ? 'Doctor saved' : 'Doctor removed' });
            }

            const user = mockUsers.find(u => u._id === patientId || u.id === patientId);
            if (user) {
                if (!user.savedDoctors) user.savedDoctors = [];
                const idx = user.savedDoctors.findIndex(d => (d._id || d.id || d) === doctorId);
                if (idx > -1) {
                    user.savedDoctors.splice(idx, 1);
                    return res.json({ success: true, saved: false, message: 'Doctor removed from favorites' });
                } else {
                    const doc = MOCK_DOCTORS.find(d => d._id === doctorId || d.id === doctorId) || doctorId;
                    user.savedDoctors.push(doc);
                    return res.json({ success: true, saved: true, message: 'Doctor saved to favorites' });
                }
            }
            return res.json({ success: true, saved: true, message: 'Doctor saved' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/patient/notifications/:id/read
    markNotificationRead: async (req, res) => {
        try {
            const { id } = req.params;
            const patientId = req.user._id || req.user.id;

            if (mongoose.connection.readyState === 1) {
                const user = await User.findById(patientId);
                user.notifications = (user.notifications || []).map(n => {
                    if (n.id === id || n._id?.toString() === id) n.read = true;
                    return n;
                });
                await user.save();
                return res.json({ success: true, message: 'Notification marked as read' });
            }

            const user = mockUsers.find(u => u._id === patientId || u.id === patientId);
            if (user && user.notifications) {
                user.notifications = user.notifications.map(n => {
                    if (n.id === id || n._id === id) n.read = true;
                    return n;
                });
            }
            return res.json({ success: true, message: 'Notification marked as read' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
