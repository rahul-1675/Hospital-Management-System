import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const initialUsers = [
    { id: 'USR001', name: 'Dr. Sarah Smith', role: 'Doctor', department: 'Cardiology', status: 'Active', email: 'sarah.smith@hms.com' },
    { id: 'USR002', name: 'James Wilson', role: 'Receptionist', department: 'Front Desk', status: 'Active', email: 'j.wilson@hms.com' },
    { id: 'USR003', name: 'Emily Davis', role: 'Nurse', department: 'Pediatrics', status: 'Active', email: 'e.davis@hms.com' },
    { id: 'USR004', name: 'Michael Chen', role: 'Admin', department: 'IT', status: 'Active', email: 'm.chen@hms.com' },
    { id: 'USR005', name: 'Robert Brown', role: 'Pharmacist', department: 'Pharmacy', status: 'Suspended', email: 'r.brown@hms.com' },
];

const initialLogs = [
    { id: 1, timestamp: '2026-02-02 10:30:15', actor: 'Dr. Sarah Smith', action: 'UPDATE_RECORD', entity: 'Patient #4022', status: 'Success' },
    { id: 2, timestamp: '2026-02-02 10:15:00', actor: 'James Wilson', action: 'LOGIN', entity: 'System', status: 'Success' },
    { id: 3, timestamp: '2026-02-02 09:45:22', actor: 'System', action: 'BACKUP', entity: 'Database', status: 'Success' },
    { id: 4, timestamp: '2026-02-02 09:00:00', actor: 'Robert Brown', action: 'LOGIN_ATTEMPT', entity: 'System', status: 'Failed' },
    { id: 5, timestamp: '2026-02-01 18:30:00', actor: 'Admin', action: 'CONFIG_CHANGE', entity: 'Settings', status: 'Warning' },
];

const initialInvoices = [
    { id: 'INV-2024-001', patient: 'Alice Cooper', amount: 150.00, status: 'Paid', date: '2026-02-01' },
    { id: 'INV-2024-002', patient: 'Bob Marley', amount: 450.50, status: 'Pending', date: '2026-02-02' },
    { id: 'INV-2024-003', patient: 'Charlie Puth', amount: 1200.00, status: 'Overdue', date: '2026-01-25' },
];

export const AdminProvider = ({ children }) => {
    const [users, setUsers] = useState(initialUsers);
    const [logs, setLogs] = useState(initialLogs);
    const [invoices, setInvoices] = useState(initialInvoices);

    // Initial load from backend API
    useEffect(() => {
        const fetchData = async () => {
            const fetchedUsers = await adminService.getUsers();
            if (fetchedUsers && fetchedUsers.length > 0) setUsers(fetchedUsers);

            const fetchedLogs = await adminService.getLogs();
            if (fetchedLogs && fetchedLogs.length > 0) setLogs(fetchedLogs);

            const fetchedInvoices = await adminService.getInvoices();
            if (fetchedInvoices && fetchedInvoices.length > 0) setInvoices(fetchedInvoices);
        };
        fetchData();
    }, []);

    // User Actions
    const checkEmailUnique = (email) => {
        return !users.some(u => u.email.toLowerCase() === email.toLowerCase());
    };

    const addUser = async (userData) => {
        const tempPassword = Math.random().toString(36).slice(-8);
        const newUser = {
            ...userData,
            id: `USR00${users.length + 1}`,
            status: 'Active'
        };

        setUsers(prev => [...prev, newUser]);
        logAction('Admin', 'CREATE_USER', newUser.name, 'Success');

        // Async sync with backend
        adminService.addUser(newUser);

        return { success: true, user: newUser, tempPassword };
    };

    const updateUser = (id, updates) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        logAction('Admin', 'UPDATE_USER', `ID: ${id}`, 'Success');
        adminService.updateUser(id, updates);
    };

    const deleteUser = (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        logAction('Admin', 'DELETE_USER', `ID: ${id}`, 'Success');
        adminService.deleteUser(id);
    };

    const toggleUserStatus = (id) => {
        setUsers(prev => prev.map(u => {
            if (u.id === id) {
                const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
                logAction('Admin', 'STATUS_CHANGE', `${u.name} -> ${newStatus}`, 'Success');
                return { ...u, status: newStatus };
            }
            return u;
        }));
        adminService.toggleUserStatus(id);
    };

    const resetPassword = (id) => {
        logAction('Admin', 'RESET_PASSWORD', `ID: ${id}`, 'Success');
    };

    // Finance Actions
    const markInvoicePaid = (id) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
        logAction('Admin', 'FINANCE_UPDATE', `Invoice ${id} Paid`, 'Success');
        adminService.markInvoicePaid(id);
    };

    const refundInvoice = (id) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Refunded' } : inv));
        logAction('Admin', 'REFUND_ISSUED', `Invoice ${id}`, 'Warning');
        adminService.refundInvoice(id);
    };

    // Helper
    const logAction = (actor, action, entity, status) => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            actor,
            action,
            entity,
            status
        };
        setLogs(prev => [newLog, ...prev]);
    };

    return (
        <AdminContext.Provider value={{
            users,
            logs,
            invoices,
            checkEmailUnique,
            addUser,
            updateUser,
            deleteUser,
            toggleUserStatus,
            resetPassword,
            markInvoicePaid,
            refundInvoice
        }}>
            {children}
        </AdminContext.Provider>
    );
};
