import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { Hospital } from '../models/Hospital.js';
import { Specialty } from '../models/Specialty.js';
import { Appointment } from '../models/Appointment.js';
import { Review } from '../models/Review.js';
import { PatientRemovalRequest } from '../models/PatientRemovalRequest.js';
import { mockUsers, MOCK_DOCTORS, mockAppointments, mockPatientRemovalRequests } from '../data/mockFallback.js';
import { db } from '../data/store.js';

export const adminController = {
    // GET /api/admin/overview-stats
    getOverviewStats: async (req, res) => {
        try {
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                const totalUsers = await User.countDocuments();
                const totalDoctors = await Doctor.countDocuments();
                const totalAppointments = await Appointment.countDocuments();
                const activeStaff = await User.countDocuments({ status: 'Active' });

                const todayStr = new Date().toISOString().split('T')[0];
                const dailyAppointments = await Appointment.countDocuments({
                    $or: [
                        { date: todayStr },
                        { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
                    ]
                });

                // Calculate total revenue from completed/confirmed appointments
                const allApts = await Appointment.find({}).lean();
                let totalRevenue = 0;
                let pendingInvoicesCount = 0;
                let pendingAmount = 0;

                allApts.forEach(apt => {
                    const fee = Number(apt.amount) || Number(apt.consultationFee) || 65;
                    if (apt.paymentStatus === 'PAID' || apt.status === 'COMPLETED') {
                        totalRevenue += fee;
                    } else if (apt.status !== 'CANCELLED') {
                        pendingInvoicesCount += 1;
                        pendingAmount += fee;
                    }
                });

                // Get recent activities from actual appointments, users, and reviews
                const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(3).lean();
                const recentApts = await Appointment.find({}).sort({ createdAt: -1 }).limit(4).lean();
                const recentRevs = await Review.find({}).sort({ createdAt: -1 }).limit(3).lean();

                const recentActivities = [
                    ...recentUsers.map(u => ({
                        id: `act-u-${u._id}`,
                        type: 'USER',
                        title: `New User Registered: ${u.name}`,
                        subtitle: `Role: ${u.role} • ${u.email}`,
                        time: u.createdAt ? new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
                    })),
                    ...recentApts.map(a => ({
                        id: `act-a-${a._id}`,
                        type: 'APPOINTMENT',
                        title: `Appointment Booked: ${a.patientName}`,
                        subtitle: `${a.department || 'Consultation'} • ${a.timeSlot || 'Scheduled'}`,
                        time: a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
                    })),
                    ...recentRevs.map(r => ({
                        id: `act-r-${r._id}`,
                        type: 'REVIEW',
                        title: `New Review by ${r.patientName}`,
                        subtitle: `${r.rating} Stars • "${r.comment.slice(0, 45)}..."`,
                        time: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
                    }))
                ].slice(0, 6);

                return res.json({
                    success: true,
                    data: {
                        totalUsers: totalUsers || 1,
                        totalDoctors: totalDoctors || 6,
                        totalPatients: totalAppointments > 0 ? totalAppointments : 1,
                        activeStaff: activeStaff || 1,
                        dailyAppointments: dailyAppointments || 0,
                        monthlyRevenue: totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : '$0',
                        monthlyRevenueNumeric: totalRevenue,
                        pendingInvoicesCount: pendingInvoicesCount,
                        pendingAmount: pendingAmount,
                        systemHealth: '100% (MongoDB Atlas Connected)',
                        databaseConnected: true,
                        recentActivities
                    }
                });
            }

            // Fallback In-Memory Stats
            const totalUsers = mockUsers.length;
            const totalDoctors = MOCK_DOCTORS.length;
            const totalAppointments = mockAppointments.length;
            const activeStaff = mockUsers.filter(u => u.status === 'Active').length;

            let totalRevenue = 0;
            let pendingInvoicesCount = 0;
            mockAppointments.forEach(a => {
                const fee = a.amount || 65;
                if (a.paymentStatus === 'PAID') totalRevenue += fee;
                else pendingInvoicesCount++;
            });

            return res.json({
                success: true,
                data: {
                    totalUsers,
                    totalDoctors,
                    totalPatients: totalAppointments,
                    activeStaff,
                    dailyAppointments: 1,
                    monthlyRevenue: `$${totalRevenue.toLocaleString()}`,
                    monthlyRevenueNumeric: totalRevenue,
                    pendingInvoicesCount,
                    pendingAmount: pendingInvoicesCount * 65,
                    systemHealth: '99.9% (Local Store Mode)',
                    databaseConnected: false,
                    recentActivities: [
                        { id: 'act-1', type: 'SYSTEM', title: 'System Initialized', subtitle: 'ProHealth Core API Active', time: 'Active' }
                    ]
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/admin/users
    getUsers: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const users = await User.find({}).select('-passwordHash').lean();
                const formatted = users.map(u => ({
                    id: u.staffId || u._id.toString(),
                    _id: u._id.toString(),
                    name: u.name,
                    email: u.email,
                    role: (u.role || 'staff').charAt(0).toUpperCase() + (u.role || 'staff').slice(1),
                    department: u.department || 'General',
                    phone: u.phone || '',
                    status: u.status || 'Active',
                    createdAt: u.createdAt
                }));
                return res.json({ success: true, data: formatted });
            }

            // Fallback In-Memory
            const users = mockUsers.map(u => ({
                id: u.staffId || u._id || u.id,
                _id: u._id || u.id,
                name: u.name,
                email: u.email,
                role: (u.role || 'staff').charAt(0).toUpperCase() + (u.role || 'staff').slice(1),
                department: u.department || 'General',
                phone: u.phone || '',
                status: u.status || 'Active',
                createdAt: u.createdAt || new Date().toISOString()
            }));
            return res.json({ success: true, data: users });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/admin/users
    createUser: async (req, res) => {
        try {
            const { name, email, role, department, phone, password, specialization, status = 'Active' } = req.body;

            if (!name || !email || !phone || !phone.trim()) {
                return res.status(400).json({ success: false, message: 'Name, email, and phone number are required.' });
            }

            const normalizedRole = (role || 'staff').toLowerCase();
            const rawPassword = password && password.trim() ? password.trim() : `${normalizedRole}@${Math.floor(100 + Math.random() * 900)}`;

            if (mongoose.connection.readyState === 1) {
                const existingUser = await User.findOne({ email: email.toLowerCase() });
                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'User with this email already exists.' });
                }

                const count = await User.countDocuments();
                const prefix = normalizedRole === 'doctor' ? 'DOC' : normalizedRole === 'receptionist' ? 'REC' : normalizedRole === 'pharmacy' ? 'PHA' : normalizedRole === 'admin' ? 'ADM' : 'STF';
                const staffId = `${prefix}${String(count + 1).padStart(3, '0')}`;

                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(rawPassword, salt);

                const newUser = await User.create({
                    name,
                    email: email.toLowerCase(),
                    passwordHash,
                    role: normalizedRole,
                    department: department || specialization || 'General',
                    phone,
                    staffId,
                    status,
                    notifications: [{
                        title: 'Hospital Staff Account Created',
                        message: `Welcome to ProHealth HMS. Your staff account (${staffId}) is active.`,
                        type: 'SYSTEM',
                        date: new Date().toISOString()
                    }]
                });

                if (normalizedRole === 'doctor') {
                    const firstHospital = await Hospital.findOne({});
                    const firstSpecialty = await Specialty.findOne({
                        $or: [
                            { name: new RegExp(specialization || department || 'General', 'i') },
                            { department: new RegExp(specialization || department || 'General', 'i') }
                        ]
                    }) || await Specialty.findOne({});

                    if (firstHospital && firstSpecialty) {
                        await Doctor.create({
                            name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
                            email: email.toLowerCase(),
                            hospital: firstHospital._id,
                            specialty: firstSpecialty._id,
                            department: department || specialization || firstSpecialty.name || 'General Medicine',
                            qualifications: 'MBBS, MD',
                            experienceYears: 5,
                            consultationFee: 50,
                            roomNumber: `Room ${100 + (count % 20)}`,
                            isDemoData: false
                        });
                    }
                }

                return res.status(201).json({
                    success: true,
                    user: {
                        id: staffId,
                        _id: newUser._id.toString(),
                        name: newUser.name,
                        email: newUser.email,
                        role: (newUser.role).charAt(0).toUpperCase() + newUser.role.slice(1),
                        department,
                        phone,
                        status: newUser.status || 'Active'
                    },
                    tempPassword: rawPassword
                });
            }

            // Fallback In-Memory Creation
            const exists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                return res.status(400).json({ success: false, message: 'User with this email already exists.' });
            }

            const count = mockUsers.length;
            const prefix = normalizedRole === 'doctor' ? 'DOC' : normalizedRole === 'receptionist' ? 'REC' : normalizedRole === 'pharmacy' ? 'PHA' : normalizedRole === 'admin' ? 'ADM' : 'STF';
            const staffId = `${prefix}${String(count + 1).padStart(3, '0')}`;

            const newUser = {
                _id: `usr-${Date.now()}`,
                id: staffId,
                staffId,
                name,
                email: email.toLowerCase(),
                role: normalizedRole,
                department,
                phone,
                password: rawPassword,
                status,
                savedHospitals: [],
                savedDoctors: [],
                notifications: []
            };

            mockUsers.push(newUser);

            return res.status(201).json({
                success: true,
                user: {
                    id: staffId,
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: (newUser.role).charAt(0).toUpperCase() + newUser.role.slice(1),
                    department,
                    phone,
                    status: newUser.status || 'Active'
                },
                tempPassword: rawPassword
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /api/admin/users/:id
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { staffId: id };
                
                if (updates.password) {
                    const salt = await bcrypt.genSalt(10);
                    updates.passwordHash = await bcrypt.hash(updates.password, salt);
                    delete updates.password;
                }

                if (updates.role) {
                    updates.role = updates.role.toLowerCase();
                }

                const updated = await User.findOneAndUpdate(query, { $set: updates }, { new: true }).select('-passwordHash');
                if (!updated) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                return res.json({
                    success: true,
                    user: {
                        id: updated.staffId || updated._id.toString(),
                        _id: updated._id.toString(),
                        name: updated.name,
                        email: updated.email,
                        role: (updated.role).charAt(0).toUpperCase() + updated.role.slice(1),
                        department: updated.department || 'General',
                        phone: updated.phone || '',
                        status: updated.status || 'Active'
                    }
                });
            }

            const userIndex = mockUsers.findIndex(u => u.staffId === id || u.id === id || u._id === id);
            if (userIndex === -1) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
            const u = mockUsers[userIndex];

            return res.json({
                success: true,
                user: {
                    id: u.staffId || u.id || u._id,
                    _id: u._id || u.id,
                    name: u.name,
                    email: u.email,
                    role: (u.role).charAt(0).toUpperCase() + u.role.slice(1),
                    department: u.department || 'General',
                    phone: u.phone || '',
                    status: u.status || 'Active'
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /api/admin/users/:id
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { staffId: id };
                const deleted = await User.findOneAndDelete(query);
                if (!deleted) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                return res.json({ success: true, message: `User ${id} removed successfully.` });
            }

            const initialLen = mockUsers.length;
            const updated = mockUsers.filter(u => u.staffId !== id && u.id !== id && u._id !== id);
            mockUsers.length = 0;
            mockUsers.push(...updated);

            if (mockUsers.length === initialLen) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            return res.json({ success: true, message: `User ${id} removed successfully.` });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/admin/users/:id/status
    toggleUserStatus: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { staffId: id };
                const user = await User.findOne(query);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                user.status = user.status === 'Active' ? 'Suspended' : 'Active';
                await user.save();

                return res.json({
                    success: true,
                    user: {
                        id: user.staffId || user._id.toString(),
                        _id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: (user.role).charAt(0).toUpperCase() + user.role.slice(1),
                        status: user.status
                    }
                });
            }

            const user = mockUsers.find(u => u.staffId === id || u.id === id || u._id === id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            user.status = user.status === 'Active' ? 'Suspended' : 'Active';
            return res.json({
                success: true,
                user: {
                    id: user.staffId || user.id || user._id,
                    _id: user._id || user.id,
                    name: user.name,
                    email: user.email,
                    role: (user.role).charAt(0).toUpperCase() + user.role.slice(1),
                    status: user.status
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/admin/logs
    getLogs: async (req, res) => {
        try {
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                const users = await User.find({}).sort({ createdAt: -1 }).limit(10).lean();
                const apts = await Appointment.find({}).sort({ createdAt: -1 }).limit(10).lean();
                const revs = await Review.find({}).sort({ createdAt: -1 }).limit(5).lean();

                const generatedLogs = [
                    ...users.map(u => ({
                        id: `log-u-${u._id}`,
                        timestamp: u.createdAt ? new Date(u.createdAt).toLocaleString() : new Date().toLocaleString(),
                        actor: u.name || 'System Admin',
                        action: 'USER_REGISTERED',
                        entity: `${u.role.toUpperCase()} #${u.staffId || u._id.toString().slice(-4)}`,
                        status: 'Success'
                    })),
                    ...apts.map(a => ({
                        id: `log-a-${a._id}`,
                        timestamp: a.createdAt ? new Date(a.createdAt).toLocaleString() : new Date().toLocaleString(),
                        actor: a.patientName || 'Patient',
                        action: a.status === 'COMPLETED' ? 'CONSULTATION_DONE' : 'APPOINTMENT_BOOKED',
                        entity: `Appointment #${a.appointmentNumber || a._id.toString().slice(-4)}`,
                        status: a.status === 'CANCELLED' ? 'Failed' : 'Success'
                    })),
                    ...revs.map(r => ({
                        id: `log-r-${r._id}`,
                        timestamp: r.createdAt ? new Date(r.createdAt).toLocaleString() : new Date().toLocaleString(),
                        actor: r.patientName || 'Verified Patient',
                        action: 'REVIEW_SUBMITTED',
                        entity: `${r.rating} Star Review`,
                        status: 'Success'
                    }))
                ];

                generatedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                return res.json({
                    success: true,
                    data: generatedLogs.length > 0 ? generatedLogs : [
                        { id: 1, timestamp: new Date().toLocaleString(), actor: 'System Admin', action: 'PORTAL_LOGIN', entity: 'Admin Dashboard', status: 'Success' }
                    ]
                });
            }

            const storedLogs = db.get('logs') || [];
            return res.json({
                success: true,
                data: storedLogs.length > 0 ? storedLogs : [
                    { id: 1, timestamp: new Date().toLocaleString(), actor: 'System Admin', action: 'PORTAL_LOGIN', entity: 'Admin Dashboard', status: 'Success' }
                ]
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/admin/invoices
    getInvoices: async (req, res) => {
        try {
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                const appointments = await Appointment.find({})
                    .populate('doctor', 'name department')
                    .populate('hospital', 'name')
                    .sort({ createdAt: -1 })
                    .lean();

                const invoices = appointments.map(apt => {
                    const fee = Number(apt.amount) || Number(apt.consultationFee) || 65;
                    const status = apt.paymentStatus === 'PAID' ? 'Paid' : apt.status === 'CANCELLED' ? 'Refunded' : 'Pending';

                    return {
                        id: `INV-${apt.appointmentNumber || apt._id.toString().slice(-6).toUpperCase()}`,
                        appointmentId: apt._id.toString(),
                        date: apt.date || (apt.createdAt ? new Date(apt.createdAt).toISOString().split('T')[0] : '2026-03-20'),
                        patient: apt.patientName || 'Patient',
                        doctor: apt.doctor?.name || apt.doctorName || 'Consultant Doctor',
                        amount: fee,
                        status: status,
                        items: [{ description: `${apt.department || 'Clinical'} Consultation`, amount: fee }]
                    };
                });

                return res.json({ success: true, data: invoices });
            }

            const storedInvoices = (db.get('invoices') || []).map(inv => ({
                id: inv.id,
                date: inv.date || new Date().toISOString().split('T')[0],
                patient: inv.patient,
                doctor: 'Consultant Doctor',
                amount: Number(inv.amount) || 65,
                status: inv.status,
                items: inv.items || [{ description: 'Medical Service', amount: Number(inv.amount) || 65 }]
            }));

            return res.json({ success: true, data: storedInvoices });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/admin/invoices/:id/pay
    markInvoicePaid: async (req, res) => {
        try {
            const { id } = req.params;
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                const aptNum = id.replace('INV-', '');
                await Appointment.findOneAndUpdate(
                    { $or: [{ appointmentNumber: aptNum }, { _id: mongoose.Types.ObjectId.isValid(aptNum) ? aptNum : null }] },
                    { $set: { paymentStatus: 'PAID' } }
                );
            }

            db.update('invoices', (prev = []) =>
                prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv)
            );

            return res.json({ success: true, message: `Invoice ${id} marked as Paid.` });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/admin/invoices/:id/refund
    refundInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                const aptNum = id.replace('INV-', '');
                await Appointment.findOneAndUpdate(
                    { $or: [{ appointmentNumber: aptNum }, { _id: mongoose.Types.ObjectId.isValid(aptNum) ? aptNum : null }] },
                    { $set: { paymentStatus: 'REFUNDED', status: 'CANCELLED' } }
                );
            }

            db.update('invoices', (prev = []) =>
                prev.map(inv => inv.id === id ? { ...inv, status: 'Refunded' } : inv)
            );

            return res.json({ success: true, message: `Invoice ${id} refunded successfully.` });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/admin/users/:id/approve
    approveUser: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { staffId: id };
                const user = await User.findOne(query);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                user.status = 'Active';
                user.notifications.push({
                    id: Date.now().toString(),
                    title: 'Account Approved & Activated',
                    message: 'Congratulations! Your hospital portal account has been approved by the administrator. You can now access all portal features.',
                    type: 'SYSTEM',
                    date: new Date().toISOString()
                });
                await user.save();

                // If approved user is doctor, ensure Doctor record exists
                if (user.role === 'doctor') {
                    const existingDoc = await Doctor.findOne({ email: user.email.toLowerCase() });
                    if (!existingDoc) {
                        const firstHospital = await Hospital.findOne({});
                        const firstSpecialty = await Specialty.findOne({
                            $or: [
                                { name: new RegExp(user.department || 'General', 'i') },
                                { department: new RegExp(user.department || 'General', 'i') }
                            ]
                        }) || await Specialty.findOne({});

                        if (firstHospital && firstSpecialty) {
                            await Doctor.create({
                                name: user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`,
                                email: user.email.toLowerCase(),
                                hospital: firstHospital._id,
                                specialty: firstSpecialty._id,
                                department: user.department || firstSpecialty.name || 'General Medicine',
                                qualifications: 'MBBS, MD',
                                experienceYears: 5,
                                consultationFee: 50,
                                roomNumber: `Room 101`,
                                isDemoData: false
                            });
                        }
                    }
                }

                return res.json({
                    success: true,
                    message: `Account for ${user.name} has been approved and activated.`,
                    user: {
                        id: user.staffId || user._id.toString(),
                        _id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: (user.role).charAt(0).toUpperCase() + user.role.slice(1),
                        department: user.department || 'General',
                        phone: user.phone || '',
                        status: 'Active'
                    }
                });
            }

            // Fallback In-Memory Approval
            const user = mockUsers.find(u => u.staffId === id || u.id === id || u._id === id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            user.status = 'Active';
            return res.json({
                success: true,
                message: `Account for ${user.name} has been approved and activated.`,
                user: {
                    id: user.staffId || user.id || user._id,
                    _id: user._id || user.id,
                    name: user.name,
                    email: user.email,
                    role: (user.role).charAt(0).toUpperCase() + user.role.slice(1),
                    department: user.department || 'General',
                    phone: user.phone || '',
                    status: 'Active'
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/admin/users/:id/reject
    rejectUser: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { staffId: id };
                const user = await User.findOne(query);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                user.status = 'Rejected';
                await user.save();

                return res.json({
                    success: true,
                    message: `Account request for ${user.name} was rejected.`,
                    user: {
                        id: user.staffId || user._id.toString(),
                        _id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        status: 'Rejected'
                    }
                });
            }

            const user = mockUsers.find(u => u.staffId === id || u.id === id || u._id === id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            user.status = 'Rejected';
            return res.json({
                success: true,
                message: `Account request for ${user.name} was rejected.`,
                user: {
                    id: user.staffId || user.id || user._id,
                    status: 'Rejected'
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /api/admin/appointments/:id
    deleteAppointment: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { appointmentNumber: id };
                const deleted = await Appointment.findOneAndDelete(query);
                if (!deleted) {
                    return res.status(404).json({ success: false, message: 'Appointment not found' });
                }
                return res.json({ success: true, message: `Appointment ${id} deleted successfully.` });
            }

            const initialLen = mockAppointments.length;
            const updated = mockAppointments.filter(a => a.id !== id && a._id !== id && a.appointmentNumber !== id);
            mockAppointments.length = 0;
            mockAppointments.push(...updated);

            if (mockAppointments.length === initialLen) {
                return res.status(404).json({ success: false, message: 'Appointment not found' });
            }

            return res.json({ success: true, message: `Appointment ${id} deleted successfully.` });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /api/admin/invoices/:id
    deleteInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                const aptNum = id.replace('INV-', '');
                await Appointment.findOneAndDelete({
                    $or: [
                        { appointmentNumber: aptNum },
                        { _id: mongoose.Types.ObjectId.isValid(aptNum) ? aptNum : null }
                    ]
                });
            }

            db.update('invoices', (prev = []) => prev.filter(inv => inv.id !== id));

            return res.json({ success: true, message: `Invoice ${id} deleted successfully.` });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /api/admin/logs
    clearLogs: async (req, res) => {
        try {
            db.set('logs', []);
            return res.json({ success: true, message: 'System audit logs cleared successfully.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/admin/purge-data
    purgeData: async (req, res) => {
        try {
            const { target } = req.body; // 'logs', 'reviews', 'cancelled-appointments', 'all-demo'

            if (mongoose.connection.readyState === 1) {
                if (target === 'logs') {
                    db.set('logs', []);
                } else if (target === 'cancelled-appointments') {
                    await Appointment.deleteMany({ status: 'CANCELLED' });
                } else if (target === 'reviews') {
                    await Review.deleteMany({ isDemoData: true });
                } else if (target === 'all-demo') {
                    await Appointment.deleteMany({ status: 'CANCELLED' });
                    await Review.deleteMany({ isDemoData: true });
                    db.set('logs', []);
                }
            } else {
                if (target === 'logs') {
                    db.set('logs', []);
                } else if (target === 'cancelled-appointments') {
                    const activeApts = mockAppointments.filter(a => a.status !== 'CANCELLED');
                    mockAppointments.length = 0;
                    mockAppointments.push(...activeApts);
                }
            }

            return res.json({ success: true, message: `Data cleanup for '${target || 'selected records'}' completed successfully.` });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/admin/patient-removal-requests
    getPatientRemovalRequests: async (req, res) => {
        try {
            if (mongoose.connection.readyState === 1) {
                const requests = await PatientRemovalRequest.find().sort({ createdAt: -1 });
                return res.json({ success: true, data: requests });
            }

            return res.json({ success: true, data: mockPatientRemovalRequests });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/admin/patient-removal-requests/:id/approve
    approvePatientRemoval: async (req, res) => {
        try {
            const { id } = req.params;
            const { adminNote = 'Approved by Hospital Administrator' } = req.body;

            if (mongoose.connection.readyState === 1) {
                const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { _id: id };
                const request = await PatientRemovalRequest.findById(id);
                if (!request) return res.status(404).json({ success: false, message: 'Patient removal request not found' });

                request.status = 'Approved';
                request.adminNote = adminNote;
                request.processedAt = new Date();
                await request.save();

                // Remove or deactivate the patient record if user exists
                if (request.patientId) {
                    const patQuery = mongoose.Types.ObjectId.isValid(request.patientId)
                        ? { _id: request.patientId }
                        : { $or: [{ staffId: request.patientId }, { name: request.patientName }] };
                    await User.deleteOne(patQuery);
                }

                return res.json({
                    success: true,
                    message: `Patient removal request for '${request.patientName}' approved and patient record discharged.`,
                    data: request
                });
            }

            const request = mockPatientRemovalRequests.find(r => r._id === id || r.id === id);
            if (!request) return res.status(404).json({ success: false, message: 'Patient removal request not found' });

            request.status = 'Approved';
            request.adminNote = adminNote;
            request.processedAt = new Date().toISOString();

            // Deactivate in mockUsers / mockAppointments
            const uIdx = mockUsers.findIndex(u => u.name === request.patientName || u.id === request.patientId);
            if (uIdx !== -1) {
                mockUsers.splice(uIdx, 1);
            }

            return res.json({
                success: true,
                message: `Patient removal request for '${request.patientName}' approved and patient record discharged.`,
                data: request
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/admin/patient-removal-requests/:id/reject
    rejectPatientRemoval: async (req, res) => {
        try {
            const { id } = req.params;
            const { adminNote = 'Removal rejected by Hospital Administrator' } = req.body;

            if (mongoose.connection.readyState === 1) {
                const request = await PatientRemovalRequest.findById(id);
                if (!request) return res.status(404).json({ success: false, message: 'Patient removal request not found' });

                request.status = 'Rejected';
                request.adminNote = adminNote;
                request.processedAt = new Date();
                await request.save();

                return res.json({
                    success: true,
                    message: `Patient removal request for '${request.patientName}' has been rejected.`,
                    data: request
                });
            }

            const request = mockPatientRemovalRequests.find(r => r._id === id || r.id === id);
            if (!request) return res.status(404).json({ success: false, message: 'Patient removal request not found' });

            request.status = 'Rejected';
            request.adminNote = adminNote;
            request.processedAt = new Date().toISOString();

            return res.json({
                success: true,
                message: `Patient removal request for '${request.patientName}' has been rejected.`,
                data: request
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/admin/settings
    getSettings: async (req, res) => {
        try {
            const settings = db.get('hospital_settings') || {
                hospitalName: 'ProHealth Multi-Specialty Hospital',
                tagline: 'Leading Academic & Tertiary Healthcare Network',
                contactEmail: 'central@prohealth-hms.com',
                contactPhone: '+1 (800) 123-4567',
                emergencyPhone: '+1 (800) 911-0001',
                opdHours: '08:00 AM - 08:00 PM',
                autoApprovePatients: false,
                teleconsultationEnabled: true
            };
            return res.json({ success: true, data: settings });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PUT /api/admin/settings
    updateSettings: async (req, res) => {
        try {
            const updates = req.body;
            const current = db.get('hospital_settings') || {};
            const updated = { ...current, ...updates };
            db.set('hospital_settings', updated);
            return res.json({ success: true, message: 'Settings saved successfully', data: updated });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

