import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

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
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to token no longer exists'
            });
        }

        req.user = user;
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
