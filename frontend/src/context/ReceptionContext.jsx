import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { receptionService } from '../services/reception.service';

const ReceptionContext = createContext();

export const useReception = () => {
    return useContext(ReceptionContext);
};

export const ReceptionProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [queue, setQueue] = useState({ doctors: {} });
    const [invoices, setInvoices] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [overviewStats, setOverviewStats] = useState({
        todayAppointments: 0,
        checkedIn: 0,
        inQueue: 0,
        availableDoctors: 0,
        totalDoctors: 0,
        departmentQueues: {}
    });
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    const fetchReceptionData = useCallback(async () => {
        try {
            setLoading(true);
            const [fetchedAppointments, fetchedQueue, fetchedInvoices, fetchedDoctors, fetchedStats] = await Promise.all([
                receptionService.getAppointments(),
                receptionService.getQueueState(),
                receptionService.getInvoices(),
                receptionService.getDoctors(),
                receptionService.getOverviewStats()
            ]);

            if (Array.isArray(fetchedAppointments)) setAppointments(fetchedAppointments);
            if (fetchedQueue && fetchedQueue.doctors) setQueue(fetchedQueue);
            if (Array.isArray(fetchedInvoices)) setInvoices(fetchedInvoices);
            if (Array.isArray(fetchedDoctors)) setDoctorsList(fetchedDoctors);
            if (fetchedStats) setOverviewStats(fetchedStats);
        } catch (err) {
            console.error('Error fetching reception data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReceptionData();
    }, [fetchReceptionData]);

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const registerNewPatient = async (formData) => {
        try {
            const res = await receptionService.createAppointment(formData);
            if (res && res.data) {
                setAppointments(prev => [res.data, ...prev]);
                showNotification(`Patient ${res.data.patientName || 'Registration'} added successfully!`);
                await fetchReceptionData();
                return { success: true, data: res.data };
            }
            return { success: false, message: 'Failed to create patient record' };
        } catch (err) {
            showNotification(`Error: ${err.message}`);
            return { success: false, message: err.message };
        }
    };

    const updateInvoiceItem = (invoiceId, itemIndex, field, value) => {
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
                const newItems = [...inv.items];
                newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
                return { ...inv, items: newItems };
            }
            return inv;
        }));
    };

    const markInvoiceAsPaid = (invoiceId) => {
        setInvoices(prev => prev.map(inv =>
            inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
        ));
        showNotification(`Invoice ${invoiceId} marked as PAID`);
    };

    const checkInPatient = async (appointmentId) => {
        const appointment = appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        setAppointments(prev => prev.map(app =>
            app.id === appointmentId ? { ...app, status: 'checked-in' } : app
        ));

        await receptionService.updateAppointment(appointmentId, { status: 'checked-in' });

        setQueue(prev => {
            const docName = appointment.doctorName;
            const docState = prev.doctors[docName] || {
                status: 'AVAILABLE',
                department: appointment.department || 'General',
                current: null,
                waiting: []
            };

            const newToken = appointment.queueToken || `OPD-${100 + Math.floor(Math.random() * 900)}`;
            const newPatient = {
                token: newToken,
                name: appointment.patientName,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const updatedQueue = {
                ...prev,
                doctors: {
                    ...prev.doctors,
                    [docName]: {
                        ...docState,
                        waiting: [...(docState.waiting || []), newPatient]
                    }
                }
            };
            receptionService.updateQueueState(updatedQueue);
            return updatedQueue;
        });

        showNotification(`Checked in ${appointment.patientName}`);
        fetchReceptionData();
    };

    const rescheduleAppointment = async (appointmentId, newDate, newTime, newDoctor) => {
        setAppointments(prev => prev.map(app =>
            app.id === appointmentId ? {
                ...app,
                date: newDate || app.date,
                time: newTime,
                doctorName: newDoctor || app.doctorName,
                status: 'scheduled'
            } : app
        ));

        await receptionService.updateAppointment(appointmentId, {
            date: newDate,
            time: newTime,
            doctorName: newDoctor,
            status: 'scheduled'
        });

        showNotification('Appointment rescheduled successfully');
        fetchReceptionData();
    };

    const cancelAppointment = async (appointmentId) => {
        const app = appointments.find(a => a.id === appointmentId);
        setAppointments(prev => prev.map(a =>
            a.id === appointmentId ? { ...a, status: 'cancelled' } : a
        ));

        await receptionService.cancelAppointment(appointmentId);

        if (app && queue.doctors[app.doctorName]) {
            setQueue(prev => {
                const docState = prev.doctors[app.doctorName];
                if (!docState) return prev;

                const updatedWaiting = (docState.waiting || []).filter(p => p.name !== app.patientName);
                const updatedQueue = {
                    ...prev,
                    doctors: {
                        ...prev.doctors,
                        [app.doctorName]: {
                            ...docState,
                            waiting: updatedWaiting
                        }
                    }
                };
                receptionService.updateQueueState(updatedQueue);
                return updatedQueue;
            });
        }
        showNotification('Appointment cancelled');
        fetchReceptionData();
    };

    // QUEUE LOGIC: Call Next
    const callNext = (doctorName) => {
        setQueue(prev => {
            const docState = prev.doctors[doctorName];
            if (!docState || !docState.waiting || docState.waiting.length === 0) return prev;

            const nextPatient = docState.waiting[0];

            const updatedQueue = {
                ...prev,
                doctors: {
                    ...prev.doctors,
                    [doctorName]: {
                        ...docState,
                        status: 'BUSY',
                        current: nextPatient,
                        waiting: docState.waiting.slice(1)
                    }
                }
            };
            receptionService.updateQueueState(updatedQueue);
            return updatedQueue;
        });
        showNotification(`Called next patient for ${doctorName}`);
    };

    // QUEUE LOGIC: Mark Completed
    const markCompleted = (doctorName) => {
        setQueue(prev => {
            const docState = prev.doctors[doctorName];
            if (!docState || !docState.current) return prev;

            const updatedQueue = {
                ...prev,
                doctors: {
                    ...prev.doctors,
                    [doctorName]: {
                        ...docState,
                        status: 'AVAILABLE',
                        current: null
                    }
                }
            };
            receptionService.updateQueueState(updatedQueue);
            return updatedQueue;
        });
        showNotification(`Consultation completed for ${doctorName}`);
    };

    return (
        <ReceptionContext.Provider value={{
            appointments,
            queue,
            invoices,
            doctorsList,
            overviewStats,
            loading,
            notifications,
            refreshData: fetchReceptionData,
            registerNewPatient,
            checkInPatient,
            rescheduleAppointment,
            cancelAppointment,
            updateInvoiceItem,
            markInvoiceAsPaid,
            callNext,
            markCompleted
        }}>
            {children}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease'
                    }}>
                        {n.message}
                    </div>
                ))}
            </div>
        </ReceptionContext.Provider>
    );
};

