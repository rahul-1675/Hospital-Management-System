import React, { createContext, useContext, useState, useEffect } from 'react';
import { staffService } from '../services/staff.service';

const StaffContext = createContext();

export const useStaff = () => {
    return useContext(StaffContext);
};

const initialTasks = [
    {
        id: "T001",
        title: "Prepare Room A",
        type: "Room Prep",
        priority: "High",
        status: "ACTIVE",
        details: "Sanitize and setup equipment for incoming patient."
    },
    {
        id: "T002",
        title: "Assist Dr. Smith",
        type: "Assistance",
        priority: "Medium",
        status: "PENDING",
        details: "Required in OPD for general assistance."
    },
    {
        id: "T003",
        title: "Update Patient Records",
        type: "Admin",
        priority: "Low",
        status: "PENDING",
        details: "File the reports for patient #4022."
    }
];

const initialSchedule = [
    {
        id: 1,
        date: "2026-02-02",
        shift: "Morning",
        start: "8:00 AM",
        end: "2:00 PM",
        status: "Confirmed",
        available: true
    },
    {
        id: 2,
        date: "2026-02-03",
        shift: "Morning",
        start: "8:00 AM",
        end: "2:00 PM",
        status: "Confirmed",
        available: true
    },
    {
        id: 3,
        date: "2026-02-04",
        shift: "Night",
        start: "10:00 PM",
        end: "6:00 AM",
        status: "Confirmed",
        available: true
    }
];

export const StaffProvider = ({ children }) => {
    const [staffData, setStaffData] = useState({
        id: "STF001",
        name: "Sarah Jenkins",
        role: "Nurse / Staff",
        email: "sarah.j@hms.com",
        phone: "+1 (555) 123-9999",
        department: "General Ward",
        shift: {
            status: "ON",
            startTime: Date.now() - 3600000,
            endTime: Date.now() + 14400000
        }
    });

    const [tasks, setTasks] = useState(initialTasks);
    const [schedule, setSchedule] = useState(initialSchedule);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchStaffData = async () => {
            const fetchedTasks = await staffService.getTasks();
            if (fetchedTasks && fetchedTasks.length > 0) setTasks(fetchedTasks);
        };
        fetchStaffData();
    }, []);

    const staff = {
        ...staffData,
        tasks,
        schedule
    };

    // Auto-off shift logic
    useEffect(() => {
        const checkShift = () => {
            if (staffData.shift.status === 'ON' && Date.now() >= staffData.shift.endTime) {
                setStaffData(prev => ({
                    ...prev,
                    shift: { ...prev.shift, status: 'OFF' }
                }));
                setTasks(prev => prev.map(t =>
                    t.status === 'ACTIVE' ? { ...t, status: 'PAUSED' } : t
                ));
                showNotification('Shift has ended. Active tasks paused.');
            }
        };

        const interval = setInterval(checkShift, 60000);
        return () => clearInterval(interval);
    }, [staffData.shift]);

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    // Task Actions
    const startTask = (taskId) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                return { ...t, status: 'ACTIVE' };
            }
            if (t.status === 'ACTIVE') {
                return { ...t, status: 'PAUSED' };
            }
            return t;
        }));
        staffService.updateTaskStatus(taskId, 'ACTIVE');
        showNotification('Task started. Other active tasks paused.');
    };

    const pauseTask = (taskId) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: 'PAUSED' } : t
        ));
        staffService.updateTaskStatus(taskId, 'PAUSED');
        showNotification('Task paused');
    };

    const completeTask = (taskId) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: 'COMPLETED' } : t
        ));
        staffService.updateTaskStatus(taskId, 'COMPLETED');
        showNotification('Task completed successfully');
    };

    // Schedule Actions
    const requestSwap = (shiftId, reason) => {
        setSchedule(prev => prev.map(s =>
            s.id === shiftId ? { ...s, swapRequested: true, swapReason: reason } : s
        ));
        showNotification('Shift swap requested');
    };

    const toggleAvailability = (shiftId) => {
        setSchedule(prev => prev.map(s =>
            s.id === shiftId ? { ...s, available: !s.available } : s
        ));
        showNotification('Availability updated');
    };

    // Profile Actions
    const updateProfile = (data) => {
        setStaffData(prev => ({ ...prev, ...data }));
        showNotification('Profile updated successfully');
    };

    const updateShiftStatus = (status) => {
        setStaffData(prev => ({
            ...prev,
            shift: {
                ...prev.shift,
                status,
                endTime: status === 'ON' ? Date.now() + 28800000 : prev.shift.endTime
            }
        }));
        staffService.updateDutyStatus(staffData.id, status === 'ON' ? 'On Duty' : 'Off Duty');
    };

    return (
        <StaffContext.Provider value={{
            staff,
            tasks,
            schedule,
            notifications,
            startTask,
            pauseTask,
            completeTask,
            requestSwap,
            toggleAvailability,
            updateProfile,
            updateShiftStatus
        }}>
            {children}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', animation: 'slideIn 0.3s ease',
                        borderLeft: '4px solid #1d4ed8', fontSize: '0.9rem', fontWeight: 500
                    }}>
                        {n.message}
                    </div>
                ))}
            </div>
            <style>
                {`
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}
            </style>
        </StaffContext.Provider>
    );
};
