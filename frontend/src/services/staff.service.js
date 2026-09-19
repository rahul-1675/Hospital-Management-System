import { apiClient } from './api';

export const staffService = {
    getStaffMembers: async () => {
        try {
            const res = await apiClient.get('/staff/members');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch staff members from backend', err);
            return null;
        }
    },

    updateDutyStatus: async (id, status) => {
        try {
            return await apiClient.patch(`/staff/members/${id}/status`, { status });
        } catch (err) {
            console.warn('Failed to update staff duty status on backend', err);
            return null;
        }
    },

    getTasks: async () => {
        try {
            const res = await apiClient.get('/staff/tasks');
            return res.data || [];
        } catch (err) {
            console.warn('Failed to fetch staff tasks from backend', err);
            return null;
        }
    },

    createTask: async (taskData) => {
        try {
            return await apiClient.post('/staff/tasks', taskData);
        } catch (err) {
            console.warn('Failed to create task on backend', err);
            return null;
        }
    },

    updateTaskStatus: async (id, status) => {
        try {
            return await apiClient.patch(`/staff/tasks/${id}/status`, { status });
        } catch (err) {
            console.warn('Failed to update task status on backend', err);
            return null;
        }
    }
};
