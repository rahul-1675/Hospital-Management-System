import React, { createContext, useContext, useState, useEffect } from 'react';
import { receptionService } from '../services/reception.service';

const ReceptionContext = createContext();

export const useReception = () => {
    return useContext(ReceptionContext);
};

// Initial Data
const initialAppointments = [
    {
        id: 1,
        time: '09:00 AM',
        patientName: 'Alice Springs',
        doctorName: 'Dr. Smith',
        type: 'New Visit',
        status: 'scheduled',
        details: 'Initial consultation for persistent headaches.',
        contact: '+1 555-0101',
        department: 'General Med'
    },
    {
        id: 2,
        time: '09:15 AM',
        patientName: 'Bob Martin',
        doctorName: 'Dr. Jones',
        type: 'Follow-up',
        status: 'checked-in',
        details: 'Post-surgery checkup.',
        contact: '+1 555-0102',
        department: 'Cardiology'
    },
    {
        id: 3,
        time: '09:30 AM',
        patientName: 'Charlie Davis',
        doctorName: 'Dr. Smith',
        type: 'New Visit',
        status: 'cancelled',
        details: 'Cancelled by patient.',
        contact: '+1 555-0103',
        department: 'General Med'
    },
    {
        id: 4,
        time: '10:00 AM',
        patientName: 'Diana Prince',
        doctorName: 'Dr. Williams',
        type: 'New Visit',
        status: 'scheduled',
        details: 'Annual physical.',
        contact: '+1 555-0104',
        department: 'General Med'
    }
];

const initialQueueState = {
    doctors: {
        'Dr. Smith': {
            status: 'BUSY',
            department: 'General Med',
            current: {
                token: 'A-101',
                name: 'Liam Wilson',
                time: '10:00 AM'
            },
            waiting: []
        },
        'Dr. Jones': {
            status: 'AVAILABLE',
            department: 'Cardiology',
            current: null,
            waiting: [
                {
                    token: 'A-102',
                    name: 'Bob Martin',
                    time: '09:15 AM'
                }
            ]
        },
        'Dr. Williams': {
            status: 'AVAILABLE',
            department: 'General Med',
            current: null,
            waiting: []
        }
    }
};

const initialInvoices = [
    {
        id: 'INV-2023-001',
        patient: 'Sarah Johnson',
        date: '2023-10-25',
        status: 'Paid',
        items: [
            { description: 'Consultation - Dr. Smith', amount: 50.00 },
            { description: 'Blood Test (CBC)', amount: 100.00 }
        ]
    },
    {
        id: 'INV-2023-002',
        patient: 'Michael Chen',
        date: '2023-10-25',
        status: 'Pending',
        items: [
            { description: 'Pharmacy - Amoxicillin', amount: 45.00 }
        ]
    },
    {
        id: 'INV-2023-003',
        patient: 'Emma Davis',
        date: '2023-10-24',
        status: 'Unpaid',
        items: [
            { description: 'X-Ray - Chest', amount: 150.00 },
            { description: 'Consultation - Dr. Jones', amount: 150.00 }
        ]
    },
];

export const ReceptionProvider = ({ children }) => {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [queue, setQueue] = useState(initialQueueState);
    const [invoices, setInvoices] = useState(initialInvoices);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchReceptionData = async () => {
            const fetchedAppointments = await receptionService.getAppointments();
            if (fetchedAppointments && fetchedAppointments.length > 0) setAppointments(fetchedAppointments);

            const fetchedQueue = await receptionService.getQueueState();
            if (fetchedQueue && fetchedQueue.doctors) setQueue(fetchedQueue);

            const fetchedInvoices = await receptionService.getInvoices();
            if (fetchedInvoices && fetchedInvoices.length > 0) setInvoices(fetchedInvoices);
        };
        fetchReceptionData();
    }, []);

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
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

    const checkInPatient = (appointmentId) => {
        const appointment = appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        setAppointments(prev => prev.map(app =>
            app.id === appointmentId ? { ...app, status: 'checked-in' } : app
        ));
        receptionService.updateAppointment(appointmentId, { status: 'checked-in' });

        setQueue(prev => {
            const docName = appointment.doctorName;
            const docState = prev.doctors[docName] || {
                status: 'AVAILABLE',
                department: appointment.department || 'General',
                current: null,
                waiting: []
            };

            const newToken = `${docName.charAt(4) || 'D'}-${100 + Math.floor(Math.random() * 900)}`;
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
                        waiting: [...docState.waiting, newPatient]
                    }
                }
            };
            receptionService.updateQueueState(updatedQueue);
            return updatedQueue;
        });

        showNotification(`Checked in ${appointment.patientName}`);
    };

    const rescheduleAppointment = (appointmentId, newDate, newTime, newDoctor) => {
        setAppointments(prev => prev.map(app =>
            app.id === appointmentId ? {
                ...app,
                time: newTime,
                doctorName: newDoctor || app.doctorName,
                status: 'scheduled'
            } : app
        ));
        receptionService.updateAppointment(appointmentId, {
            time: newTime,
            doctorName: newDoctor,
            status: 'scheduled'
        });
        showNotification('Appointment rescheduled successfully');
    };

    const cancelAppointment = (appointmentId) => {
        const app = appointments.find(a => a.id === appointmentId);
        setAppointments(prev => prev.map(a =>
            a.id === appointmentId ? { ...a, status: 'cancelled' } : a
        ));
        receptionService.cancelAppointment(appointmentId);

        if (app) {
            setQueue(prev => {
                const docState = prev.doctors[app.doctorName];
                if (!docState) return prev;

                const updatedWaiting = docState.waiting.filter(p => p.name !== app.patientName);
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
    };

    // QUEUE LOGIC: Call Next
    const callNext = (doctorName) => {
        setQueue(prev => {
            const docState = prev.doctors[doctorName];
            if (!docState || docState.waiting.length === 0) return prev;

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
            notifications,
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
