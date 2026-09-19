import { db } from '../data/store.js';

export const staffController = {
    getStaffMembers: (req, res) => {
        const staff = db.get('staffMembers') || [];
        return res.json({ success: true, data: staff });
    },

    getTasks: (req, res) => {
        const tasks = db.get('tasks') || [];
        return res.json({ success: true, data: tasks });
    },

    createTask: (req, res) => {
        try {
            const task = req.body;
            const newTask = {
                ...task,
                id: Date.now(),
                status: task.status || 'Pending'
            };
            db.update('tasks', (prev = []) => [newTask, ...prev]);
            return res.status(201).json({ success: true, data: newTask });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateTaskStatus: (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            let updatedTask = null;
            db.update('tasks', (prev = []) =>
                prev.map(t => {
                    if (String(t.id) === String(id)) {
                        updatedTask = { ...t, status };
                        return updatedTask;
                    }
                    return t;
                })
            );
            if (!updatedTask) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }
            return res.json({ success: true, data: updatedTask });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateStaffDutyStatus: (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            let updatedStaff = null;
            db.update('staffMembers', (prev = []) =>
                prev.map(s => {
                    if (String(s.id) === String(id)) {
                        updatedStaff = { ...s, status };
                        return updatedStaff;
                    }
                    return s;
                })
            );
            if (!updatedStaff) {
                return res.status(404).json({ success: false, message: 'Staff member not found' });
            }
            return res.json({ success: true, data: updatedStaff });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
