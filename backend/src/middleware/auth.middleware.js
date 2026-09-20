import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { mockUsers } from '../data/mockFallback.js';

const JWT_SECRET = process.env.JWT_SECRET || 'prohealth-jwt-secret-key-2026';

export const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(decoded.id).select('-passwordHash');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User belonging to token no longer exists'
                });
            }

            req.user = user;
            return next();
        }

        // In-Memory Fallback
        const user = mockUsers.find(u => u._id === decoded.id || u.id === decoded.id || u.staffId === decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to token no longer exists'
            });
        }

        const { password: _, passwordHash: __, ...safeUser } = user;
        req.user = safeUser;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.map(r => r.toLowerCase()).includes(req.user.role?.toLowerCase())) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: requires one of the following roles: [${roles.join(', ')}]`
            });
        }
        next();
    };
};

export const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(decoded.id).select('-passwordHash');
            if (user) req.user = user;
        } else {
            const user = mockUsers.find(u => u._id === decoded.id || u.id === decoded.id || u.staffId === decoded.id);
            if (user) {
                const { password: _, passwordHash: __, ...safeUser } = user;
                req.user = safeUser;
            }
        }
    } catch (error) {
        // Token invalid/expired: continue as guest without blocking
    }
    next();
};


