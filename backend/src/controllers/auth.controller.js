import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.middleware.js';
import { mockUsers } from '../data/mockFallback.js';

export const authController = {
    // POST /api/auth/register
    register: async (req, res) => {
        try {
            const { name, email, password, phone, role = 'patient', department, specialization } = req.body;

            if (!name || !email || !password || !phone || !phone.trim()) {
                return res.status(400).json({ success: false, message: 'Please provide all required fields: name, email, phone number, and password.' });
            }

            const normalizedRole = (role || 'patient').toLowerCase();
            const approvalRoleText = normalizedRole === 'patient' ? 'reception desk' : 'administrator';

            if (mongoose.connection.readyState === 1) {
                const existingUser = await User.findOne({ email: email.toLowerCase() });
                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'User with this email already exists.' });
                }

                const count = await User.countDocuments();
                const prefix = normalizedRole === 'doctor' ? 'DOC' : normalizedRole === 'receptionist' ? 'REC' : normalizedRole === 'pharmacy' ? 'PHA' : normalizedRole === 'admin' ? 'ADM' : normalizedRole === 'patient' ? 'PAT' : 'STF';
                const staffId = `${prefix}${String(count + 1).padStart(3, '0')}`;

                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);

                const user = await User.create({
                    name,
                    email: email.toLowerCase(),
                    passwordHash,
                    phone: phone.trim(),
                    role: normalizedRole,
                    staffId,
                    department: department || specialization || (normalizedRole === 'patient' ? 'Patient' : 'General'),
                    status: 'Pending',
                    notifications: [{
                        title: 'Registration Submitted',
                        message: `Your account registration has been received and is pending ${approvalRoleText} review and approval.`,
                        type: 'SYSTEM',
                        date: new Date().toISOString()
                    }]
                });

                return res.status(201).json({
                    success: true,
                    pendingApproval: true,
                    message: `Registration submitted successfully! Your account is pending ${approvalRoleText} approval before you can sign in.`,
                    user: {
                        id: user.staffId || user._id.toString(),
                        _id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone,
                        status: user.status
                    }
                });
            }

            // In-Memory Fallback
            const exists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                return res.status(400).json({ success: false, message: 'User with this email already exists.' });
            }

            const count = mockUsers.length;
            const prefix = normalizedRole === 'doctor' ? 'DOC' : normalizedRole === 'receptionist' ? 'REC' : normalizedRole === 'pharmacy' ? 'PHA' : normalizedRole === 'admin' ? 'ADM' : normalizedRole === 'patient' ? 'PAT' : 'STF';
            const staffId = `${prefix}${String(count + 1).padStart(3, '0')}`;

            const newUser = {
                _id: `usr-${Date.now()}`,
                id: staffId,
                staffId,
                name,
                email: email.toLowerCase(),
                phone: phone.trim(),
                role: normalizedRole,
                department: department || specialization || (normalizedRole === 'patient' ? 'Patient' : 'General'),
                password,
                passwordHash: bcrypt.hashSync(password, 10),
                status: 'Pending',
                savedHospitals: [],
                savedDoctors: [],
                notifications: [{
                    id: Date.now().toString(),
                    title: 'Registration Submitted',
                    message: `Your account registration has been received and is pending ${approvalRoleText} review and approval.`,
                    type: 'SYSTEM',
                    date: new Date().toISOString(),
                    read: false
                }]
            };
            mockUsers.push(newUser);

            return res.status(201).json({
                success: true,
                pendingApproval: true,
                message: `Registration submitted successfully! Your account is pending ${approvalRoleText} approval before you can sign in.`,
                user: {
                    id: newUser.staffId,
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone,
                    status: newUser.status
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/auth/login
    login: async (req, res) => {
        try {
            const { role, id, email, password } = req.body;

            if (!password) {
                return res.status(400).json({ success: false, message: 'Password is required' });
            }

            const cleanId = (id || email || '').trim();
            if (!cleanId) {
                return res.status(400).json({ success: false, message: 'Email or Staff ID is required' });
            }

            // Role Aliases Normalizer
            const normalizeRole = (r) => {
                if (!r) return undefined;
                const lower = r.toLowerCase().trim();
                if (lower === 'reception' || lower === 'receptionist') return 'receptionist';
                if (lower === 'pharmacy' || lower === 'pharmacist') return 'pharmacy';
                if (lower === 'staff' || lower === 'nurse' || lower === 'ward') return 'staff';
                if (lower === 'doctor' || lower === 'doc') return 'doctor';
                if (lower === 'admin' || lower === 'administrator') return 'admin';
                if (lower === 'patient') return 'patient';
                return lower;
            };

            const requestedRole = normalizeRole(role);

            if (mongoose.connection.readyState === 1) {
                const query = {
                    $or: [
                        { email: cleanId.toLowerCase() },
                        { staffId: new RegExp(`^${cleanId}$`, 'i') }
                    ]
                };

                if (requestedRole) {
                    query.role = { $in: [requestedRole, role.toLowerCase().trim()] };
                }

                const user = await User.findOne(query);
                if (!user) {
                    return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
                }

                // Check Account Approval Status
                if (user.status === 'Pending') {
                    return res.status(403).json({
                        success: false,
                        isPendingApproval: true,
                        message: 'Your account is pending administrator approval. Please wait for an administrator to activate your account.'
                    });
                }

                if (user.status === 'Suspended') {
                    return res.status(403).json({
                        success: false,
                        message: 'Your account has been suspended. Please contact hospital administration.'
                    });
                }

                if (user.status === 'Rejected') {
                    return res.status(403).json({
                        success: false,
                        message: 'Your registration application was not approved. Please contact support.'
                    });
                }

                const isMatch = (await user.matchPassword(password)) || (user.password && user.password === password);
                if (!isMatch) {
                    return res.status(401).json({ success: false, message: 'Invalid credentials / Incorrect password' });
                }

                const token = generateToken(user._id, user.role);
                return res.json({
                    success: true,
                    token,
                    user: {
                        id: user.staffId || user._id.toString(),
                        _id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        staffId: user.staffId,
                        phone: user.phone,
                        status: user.status || 'Active'
                    }
                });
            }

            // Fallback In-Memory Login
            const cleanIdLower = cleanId.toLowerCase();
            const user = mockUsers.find(u => {
                const matchesIdentifier = (u.email && u.email.toLowerCase() === cleanIdLower) ||
                    (u.staffId && u.staffId.toLowerCase() === cleanIdLower) ||
                    (u.id && u.id.toLowerCase() === cleanIdLower);
                
                if (!matchesIdentifier) return false;

                if (!requestedRole) return true;
                const userRole = normalizeRole(u.role);
                return userRole === requestedRole || u.role.toLowerCase() === role.toLowerCase();
            });

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
            }

            // Check Account Approval Status in fallback
            if (user.status === 'Pending') {
                return res.status(403).json({
                    success: false,
                    isPendingApproval: true,
                    message: 'Your account is pending administrator approval. Please wait for an administrator to activate your account.'
                });
            }

            if (user.status === 'Suspended') {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been suspended. Please contact hospital administration.'
                });
            }

            if (user.status === 'Rejected') {
                return res.status(403).json({
                    success: false,
                    message: 'Your registration application was not approved. Please contact support.'
                });
            }

            const isPassValid = user.password === password || (user.passwordHash && (await bcrypt.compare(password, user.passwordHash)));
            if (!isPassValid) {
                return res.status(401).json({ success: false, message: 'Invalid credentials / Incorrect password' });
            }

            const token = generateToken(user._id || user.id, user.role);
            return res.json({
                success: true,
                token,
                user: {
                    id: user.staffId || user._id || user.id,
                    _id: user._id || user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    staffId: user.staffId,
                    phone: user.phone,
                    status: user.status || 'Active'
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/auth/me
    getMe: async (req, res) => {
        try {
            const userId = req.user ? (req.user._id || req.user.id) : null;
            if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

            if (mongoose.connection.readyState === 1) {
                const user = await User.findById(userId)
                    .select('-passwordHash')
                    .populate('hospital')
                    .populate('specialty')
                    .populate('savedHospitals')
                    .populate('savedDoctors');

                if (user) return res.json({ success: true, user });
            }

            const user = mockUsers.find(u => u._id === userId || u.id === userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const { password: _, passwordHash: __, ...safeUser } = user;
            return res.json({ success: true, user: safeUser });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
