import mongoose from 'mongoose';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { MOCK_DOCTORS, mockAppointments } from '../data/mockFallback.js';

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
    }
};
