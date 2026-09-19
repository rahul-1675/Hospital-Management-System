import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Initial load from backend API
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const fetchedUsers = await adminService.getUsers();
            if (fetchedUsers) {
                setUsers(fetchedUsers);
            }
        } catch (err) {
            console.warn('Failed to load users from backend:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsers();

            const fetchedLogs = await adminService.getLogs();
            if (fetchedLogs && fetchedLogs.length > 0) setLogs(fetchedLogs);

            const fetchedInvoices = await adminService.getInvoices();
            if (fetchedInvoices && fetchedInvoices.length > 0) setInvoices(fetchedInvoices);
        };
        fetchData();
    }, []);

    // User Actions
    const checkEmailUnique = (email) => {
        return !users.some(u => u.email?.toLowerCase() === email.toLowerCase());
    };

    const addUser = async (userData) => {
        try {
            const res = await adminService.addUser(userData);
            if (res && res.success && res.user) {
                const newUser = res.user;
                setUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id && u._id !== newUser._id)]);
                logAction('Admin', 'CREATE_USER', `${newUser.name} (${newUser.role})`, 'Success');
                return { success: true, user: newUser, tempPassword: res.tempPassword };
            }
            throw new Error(res?.message || 'Failed to create user on backend');
        } catch (err) {
            console.error('Error adding user:', err);
            return { success: false, error: err.message };
        }
    };

    const updateUser = async (id, updates) => {
        try {
            const res = await adminService.updateUser(id, updates);
            if (res && res.success && res.user) {
                setUsers(prev => prev.map(u => (u.id === id || u._id === id) ? { ...u, ...res.user } : u));
                logAction('Admin', 'UPDATE_USER', `ID: ${id}`, 'Success');
                return { success: true, user: res.user };
            }
            // Fallback local update
            setUsers(prev => prev.map(u => (u.id === id || u._id === id) ? { ...u, ...updates } : u));
            logAction('Admin', 'UPDATE_USER', `ID: ${id}`, 'Success');
            return { success: true };
        } catch (err) {
            console.error('Error updating user:', err);
            return { success: false, error: err.message };
        }
    };

    const deleteUser = async (id) => {
        try {
            await adminService.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id && u._id !== id));
            logAction('Admin', 'DELETE_USER', `ID: ${id}`, 'Success');
            return { success: true };
        } catch (err) {
            console.error('Error deleting user:', err);
            return { success: false, error: err.message };
        }
    };

    const toggleUserStatus = async (id) => {
        try {
            const res = await adminService.toggleUserStatus(id);
            if (res && res.success && res.user) {
                setUsers(prev => prev.map(u => (u.id === id || u._id === id) ? { ...u, status: res.user.status } : u));
                logAction('Admin', 'STATUS_CHANGE', `${res.user.name || id} -> ${res.user.status}`, 'Success');
                return { success: true, status: res.user.status };
            }
            setUsers(prev => prev.map(u => {
                if (u.id === id || u._id === id) {
                    const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
                    logAction('Admin', 'STATUS_CHANGE', `${u.name} -> ${newStatus}`, 'Success');
                    return { ...u, status: newStatus };
                }
                return u;
            }));
            return { success: true };
        } catch (err) {
            console.error('Error toggling status:', err);
            return { success: false, error: err.message };
        }
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
            loadingUsers,
            logs,
            invoices,
            fetchUsers,
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
