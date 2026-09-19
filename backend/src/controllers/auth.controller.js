import { db } from '../data/store.js';

export const authController = {
    login: (req, res) => {
        try {
            const { role, id, password } = req.body;
            const credentials = db.get('credentials') || {};
            const user = credentials[role?.toLowerCase()];

            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid role selected' });
            }

            if (user.id === id && user.password === password) {
                const { password: _, ...safeUser } = user;
                
                // Add log
                db.update('logs', (logs = []) => [
                    {
                        id: Date.now(),
                        timestamp: new Date().toLocaleString(),
                        actor: safeUser.name,
                        action: 'LOGIN',
                        entity: 'System Portal',
                        status: 'Success'
                    },
                    ...logs
                ]);

                return res.json({
                    success: true,
                    user: safeUser,
                    token: `mock-token-${safeUser.id}-${Date.now()}`
                });
            }

            // Log failed attempt
            db.update('logs', (logs = []) => [
                {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    actor: id || 'Unknown',
                    action: 'LOGIN_ATTEMPT',
                    entity: 'System Portal',
                    status: 'Failed'
                },
                ...logs
            ]);

            return res.status(401).json({ success: false, message: 'Invalid ID or Password' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getProfile: (req, res) => {
        const { role } = req.params;
        const credentials = db.get('credentials') || {};
        const user = credentials[role?.toLowerCase()];
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const { password: _, ...safeUser } = user;
        return res.json({ success: true, user: safeUser });
    },

    logout: (req, res) => {
        return res.json({ success: true, message: 'Logged out successfully' });
    }
};
