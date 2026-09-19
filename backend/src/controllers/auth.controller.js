import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.middleware.js';
import { mockUsers } from '../data/mockFallback.js';

export const authController = {
    // POST /api/auth/register
    register: async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
            }

            if (mongoose.connection.readyState === 1) {
                const existingUser = await User.findOne({ email: email.toLowerCase() });
                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'User with this email already exists.' });
                }

                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);

                const user = await User.create({
                    name,
                    email: email.toLowerCase(),
                    passwordHash,
                    phone: phone || '',
                    role: 'patient',
                    notifications: [{
                        title: 'Welcome to ProHealth HMS',
                        message: 'Your account has been created successfully. Explore verified hospitals and book consultations online.',
                        type: 'SYSTEM',
                        date: new Date().toISOString()
                    }]
                });

                const token = generateToken(user._id, user.role);

                return res.status(201).json({
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone
                    }
                });
            }

            // In-Memory Fallback
            const exists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                return res.status(400).json({ success: false, message: 'User with this email already exists.' });
            }

            const newUser = {
                _id: `usr-${Date.now()}`,
                id: `usr-${Date.now()}`,
                name,
                email: email.toLowerCase(),
                phone: phone || '',
                role: 'patient',
                password,
                savedHospitals: [],
                savedDoctors: [],
                notifications: [{
                    id: Date.now().toString(),
                    title: 'Welcome to ProHealth HMS',
                    message: 'Your account has been created successfully.',
                    type: 'SYSTEM',
                    date: new Date().toISOString(),
                    read: false
                }]
            };
            mockUsers.push(newUser);

            const token = generateToken(newUser._id, newUser.role);
            return res.status(201).json({
                success: true,
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone
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

            if (mongoose.connection.readyState === 1) {
                const query = {};
                const cleanId = (id || email || '').trim();

                if (cleanId) {
                    query.$or = [
                        { email: cleanId.toLowerCase() },
                        { staffId: new RegExp(`^${cleanId}$`, 'i') }
                    ];
                }
                if (role) query.role = role.toLowerCase();

                const user = await User.findOne(query);
                if (!user) {
                    return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
                }

                const isMatch = await user.matchPassword(password);
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
                        phone: user.phone
                    }
                });
            }

            // Fallback In-Memory Login
            const cleanId = (id || email || '').trim().toLowerCase();
            const user = mockUsers.find(u => {
                const matchesIdentifier = (u.email && u.email.toLowerCase() === cleanId) ||
                    (u.staffId && u.staffId.toLowerCase() === cleanId) ||
                    (u.id && u.id.toLowerCase() === cleanId);
                const matchesRole = !role || u.role.toLowerCase() === role.toLowerCase();
                return matchesIdentifier && matchesRole;
            });

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
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
                    phone: user.phone
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
