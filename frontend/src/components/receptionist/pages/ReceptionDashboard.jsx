import React, { useState } from 'react';
import { Calendar, UserCheck, Users, Activity, CheckCircle, AlertTriangle, X, FileText, Bell, ChevronRight, User, PlusCircle, CreditCard } from 'lucide-react';
import { useReception } from '../../../context/ReceptionContext';
import { useAuth } from '../../../hooks/useAuth';

const ReceptionDashboard = ({ setActiveTab }) => {
    const { user } = useAuth();
    const { appointments, queue, overviewStats, doctorsList } = useReception();
    const [urgentItems, setUrgentItems] = useState([]);
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [notificationSuccess, setNotificationSuccess] = useState(false);

    // Dynamic calculations from context
    const totalToday = appointments.length || overviewStats.todayAppointments || 0;
    const totalCheckedIn = appointments.filter(a => ['checked-in', 'confirmed'].includes((a.status || '').toLowerCase())).length || overviewStats.checkedIn || 0;
    
    // Count waiting across all doctors
    let totalWaiting = 0;
    if (queue && queue.doctors) {
        Object.values(queue.doctors).forEach(d => {
            if (d && Array.isArray(d.waiting)) totalWaiting += d.waiting.length;
        });
    }
    if (totalWaiting === 0 && overviewStats.inQueue) totalWaiting = overviewStats.inQueue;

    const availableDocsCount = doctorsList.filter(d => d.isAvailableToday !== false).length || overviewStats.availableDoctors || 1;
    const totalDocsCount = doctorsList.length || overviewStats.totalDoctors || 1;

    // Filtered lists
    const pendingItems = urgentItems.filter(item => item.status === 'pending');

    // Handlers
    const handleNotifyClick = () => {
        setShowNotifyModal(true);
    };

    const confirmNotify = () => {
        setUrgentItems(prev => prev.map(item =>
            item.type === 'delay' ? { ...item, status: 'resolved' } : item
        ));
        setShowNotifyModal(false);
        setNotificationSuccess(true);
        setTimeout(() => setNotificationSuccess(false), 3000);
    };

    const handleWebRegistrationAction = (action) => {
        setUrgentItems(prev => prev.map(item =>
            item.id === selectedRegistration?.id ? { ...item, status: 'resolved' } : item
        ));
        setSelectedRegistration(null);
    };

    // Calculate department queue summary from real appointments
    const departmentSummary = {};
    appointments.forEach(a => {
        const dept = a.department || 'General Medicine';
        departmentSummary[dept] = (departmentSummary[dept] || 0) + 1;
    });

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', position: 'relative' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--reception-text-main)', marginBottom: '0.5rem', fontWeight: 800 }}>Front Desk Overview</h1>
                    <p className="text-label" style={{ fontSize: '1.05rem' }}>
                        Welcome back, <strong>{user?.name || 'Reception Staff'}</strong>. Live clinic operations & patient intake.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="action-btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '10px' }}
                        onClick={() => setActiveTab('registration')}
                    >
                        <PlusCircle size={18} /> New Patient Intake
                    </button>
                    <button
                        className="action-btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '10px' }}
                        onClick={() => setActiveTab('queue')}
                    >
                        <Users size={18} /> Manage Queue
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div
                    className="detail-card"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => setActiveTab('appointments')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label" style={{ fontWeight: 600 }}>Today's Appointments</span>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--reception-secondary)', color: 'var(--reception-primary)' }}>
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--reception-text-main)' }}>{totalToday}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem', fontWeight: 500 }}>Scheduled</span>
                    </div>
                </div>

                <div
                    className="detail-card"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => setActiveTab('appointments')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label" style={{ fontWeight: 600 }}>Patients Checked In</span>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: '#f0fdf4', color: 'var(--reception-success)' }}>
                            <UserCheck size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--reception-text-main)' }}>{totalCheckedIn}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem', fontWeight: 500 }}>Arrived</span>
                    </div>
                </div>

                <div
                    className="detail-card"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => setActiveTab('queue')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label" style={{ fontWeight: 600 }}>Patients Waiting</span>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: '#fff7ed', color: 'var(--reception-warning)' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--reception-text-main)' }}>{totalWaiting}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem', fontWeight: 500 }}>In Queue</span>
                    </div>
                </div>

                <div
                    className="detail-card"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => setActiveTab('queue')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label" style={{ fontWeight: 600 }}>Available Doctors</span>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: '#f8fafc', color: 'var(--reception-text-muted)' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--reception-text-main)' }}>{availableDocsCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem', fontWeight: 500 }}>/ {totalDocsCount} On Duty</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Immediate Actions & Today's Patients */}
                <div className="detail-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title" style={{ margin: 0 }}>Recent Patient Check-ins</h3>
                        <button
                            className="action-btn btn-outline"
                            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
                            onClick={() => setActiveTab('appointments')}
                        >
                            View All Appointments <ChevronRight size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {appointments.length > 0 ? (
                            appointments.slice(0, 4).map(app => (
                                <div
                                    key={app.id || app._id}
                                    className="reception-card"
                                    style={{
                                        margin: 0,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: '#ffffff',
                                        border: '1px solid var(--reception-border)',
                                        borderRadius: '12px',
                                        padding: '1rem 1.25rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '42px', height: '42px', borderRadius: '50%',
                                            background: '#f1f5f9',
                                            color: '#0284c7',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700
                                        }}>
                                            {app.patientName ? app.patientName.charAt(0).toUpperCase() : 'P'}
                                        </div>
                                        <div>
                                            <h4 className="text-lg" style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{app.patientName}</h4>
                                            <p className="text-label" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
                                                {app.doctorName} • {app.department || 'General'} • {app.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span className={`status-badge status-${(app.status || 'scheduled').toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                                            {app.status ? app.status.replace('-', ' ') : 'scheduled'}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                                            #{app.queueToken || 'OPD-101'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--reception-text-muted)', border: '1px dashed var(--reception-border)', borderRadius: '12px' }}>
                                <CheckCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5, color: '#10b981' }} />
                                <p style={{ margin: 0, fontWeight: 500 }}>No appointments registered yet today.</p>
                                <button
                                    className="action-btn btn-primary"
                                    style={{ marginTop: '1rem', fontSize: '0.85rem' }}
                                    onClick={() => setActiveTab('registration')}
                                >
                                    Register First Patient
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Queue Summary by Department */}
                <div className="detail-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title" style={{ margin: 0 }}>Department Queues</h3>
                        <button className="action-btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }} onClick={() => setActiveTab('queue')}>Live Status</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.keys(departmentSummary).length > 0 ? (
                            Object.entries(departmentSummary).map(([dept, count]) => (
                                <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--reception-border)' }}>
                                    <span className="text-value" style={{ fontWeight: 600 }}>{dept}</span>
                                    <span className="text-value text-green" style={{ color: count > 0 ? 'var(--reception-success)' : 'var(--reception-text-muted)', fontWeight: 700, background: count > 0 ? '#f0fdf4' : '#f8fafc', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.85rem' }}>
                                        {count} Patient{count === 1 ? '' : 's'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--reception-border)' }}>
                                    <span className="text-value">Cardiology</span>
                                    <span className="text-value" style={{ color: 'var(--reception-text-muted)' }}>0 Waiting</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--reception-border)' }}>
                                    <span className="text-value">General Medicine</span>
                                    <span className="text-value" style={{ color: 'var(--reception-text-muted)' }}>0 Waiting</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0' }}>
                                    <span className="text-value">Pediatrics</span>
                                    <span className="text-value" style={{ color: 'var(--reception-text-muted)' }}>0 Waiting</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                            <CreditCard size={18} color="#0284c7" /> Front Desk Billing
                        </div>
                        <p className="text-label" style={{ fontSize: '0.82rem', margin: 0 }}>
                            Quickly issue and record consultation receipts from the billing section.
                        </p>
                        <button
                            className="action-btn btn-outline"
                            style={{ width: '100%', marginTop: '0.85rem', fontSize: '0.82rem', justifyContent: 'center' }}
                            onClick={() => setActiveTab('billing')}
                        >
                            Open Billing Desk
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionDashboard;

