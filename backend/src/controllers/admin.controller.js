import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { Hospital } from '../models/Hospital.js';
import { Specialty } from '../models/Specialty.js';
import { mockUsers, MOCK_DOCTORS } from '../data/mockFallback.js';
import { db } from '../data/store.js';

export const adminController = {
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

            if (!name || !email) {
                return res.status(400).json({ success: false, message: 'Name and email are required.' });
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

                // If role is doctor, create doctor profile too
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

            if (normalizedRole === 'doctor') {
                mockDoctors.push({
                    _id: `doc-${Date.now()}`,
                    id: `doc-${Date.now()}`,
                    name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
                    specialtyName: specialization || department || 'General Medicine',
                    qualification: 'MBBS, MD',
                    experienceYears: 5,
                    consultationFee: 50,
                    roomNumber: `Room ${100 + (count % 20)}`,
                    hospitalName: 'City Care Multi-Specialty Hospital',
                    isActive: true,
                    rating: 4.8
                });
            }

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

            // Fallback In-Memory
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

            // Fallback In-Memory
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

            // Fallback In-Memory
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
        const logs = db.get('logs') || [
            { id: 1, timestamp: new Date().toLocaleString(), actor: 'Admin', action: 'SYSTEM_BOOT', entity: 'Server', status: 'Success' }
        ];
        return res.json({ success: true, data: logs });
    },

    // GET /api/admin/invoices
    getInvoices: async (req, res) => {
        const invoices = db.get('invoices') || [];
        return res.json({ success: true, data: invoices });
    },

    // PATCH /api/admin/invoices/:id/pay
    markInvoicePaid: (req, res) => {
        const { id } = req.params;
        return res.json({ success: true, message: `Invoice ${id} marked as Paid` });
    },

    // PATCH /api/admin/invoices/:id/refund
    refundInvoice: (req, res) => {
        const { id } = req.params;
        return res.json({ success: true, message: `Invoice ${id} refunded` });
    }
};
