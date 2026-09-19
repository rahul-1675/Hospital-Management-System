import { db } from '../data/store.js';

export const adminController = {
    getUsers: (req, res) => {
        const users = db.get('users') || [];
        return res.json({ success: true, data: users });
    },

    createUser: (req, res) => {
        try {
            const userData = req.body;
            const users = db.get('users') || [];

            // Email check
            if (userData.email && users.some(u => u.email?.toLowerCase() === userData.email?.toLowerCase())) {
                return res.status(400).json({ success: false, message: 'Email is already in use.' });
            }

            const tempPassword = Math.random().toString(36).slice(-8);
            const newUser = {
                ...userData,
                id: `USR00${users.length + 1}`,
                status: userData.status || 'Active'
            };

            db.update('users', (prev = []) => [...prev, newUser]);
            
            // Log action
            db.update('logs', (logs = []) => [
                {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    actor: 'Admin',
                    action: 'CREATE_USER',
                    entity: newUser.name,
                    status: 'Success'
                },
                ...logs
            ]);

            return res.status(201).json({ success: true, user: newUser, tempPassword });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateUser: (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            let updatedUser = null;

            db.update('users', (prev = []) =>
                prev.map(u => {
                    if (u.id === id) {
                        updatedUser = { ...u, ...updates };
                        return updatedUser;
                    }
                    return u;
                })
            );

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            db.update('logs', (logs = []) => [
                {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    actor: 'Admin',
                    action: 'UPDATE_USER',
                    entity: `ID: ${id}`,
                    status: 'Success'
                },
                ...logs
            ]);

            return res.json({ success: true, user: updatedUser });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteUser: (req, res) => {
        try {
            const { id } = req.params;
            db.update('users', (prev = []) => prev.filter(u => u.id !== id));

            db.update('logs', (logs = []) => [
                {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    actor: 'Admin',
                    action: 'DELETE_USER',
                    entity: `ID: ${id}`,
                    status: 'Success'
                },
                ...logs
            ]);

            return res.json({ success: true, message: `User ${id} deleted` });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    toggleUserStatus: (req, res) => {
        try {
            const { id } = req.params;
            let changedUser = null;

            db.update('users', (prev = []) =>
                prev.map(u => {
                    if (u.id === id) {
                        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
                        changedUser = { ...u, status: newStatus };
                        return changedUser;
                    }
                    return u;
                })
            );

            if (!changedUser) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            db.update('logs', (logs = []) => [
                {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    actor: 'Admin',
                    action: 'STATUS_CHANGE',
                    entity: `${changedUser.name} -> ${changedUser.status}`,
                    status: 'Success'
                },
                ...logs
            ]);

            return res.json({ success: true, user: changedUser });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getLogs: (req, res) => {
        const logs = db.get('logs') || [];
        return res.json({ success: true, data: logs });
    },

    getInvoices: (req, res) => {
        const invoices = db.get('invoices') || [];
        return res.json({ success: true, data: invoices });
    },

    markInvoicePaid: (req, res) => {
        const { id } = req.params;
        db.update('invoices', (prev = []) =>
            prev.map(inv => (inv.id === id ? { ...inv, status: 'Paid' } : inv))
        );
        db.update('logs', (logs = []) => [
            {
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                actor: 'Admin',
                action: 'FINANCE_UPDATE',
                entity: `Invoice ${id} Paid`,
                status: 'Success'
            },
            ...logs
        ]);
        return res.json({ success: true, message: `Invoice ${id} marked as Paid` });
    },

    refundInvoice: (req, res) => {
        const { id } = req.params;
        db.update('invoices', (prev = []) =>
            prev.map(inv => (inv.id === id ? { ...inv, status: 'Refunded' } : inv))
        );
        db.update('logs', (logs = []) => [
            {
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                actor: 'Admin',
                action: 'REFUND_ISSUED',
                entity: `Invoice ${id}`,
                status: 'Warning'
            },
            ...logs
        ]);
        return res.json({ success: true, message: `Invoice ${id} refunded` });
    }
};
