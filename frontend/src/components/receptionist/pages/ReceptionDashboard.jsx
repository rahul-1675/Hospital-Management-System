import React, { useState } from 'react';
import { Calendar, UserCheck, Users, Activity, CheckCircle, AlertTriangle, X, FileText, Bell, ChevronRight, User } from 'lucide-react';

const initialUrgentItems = [
    {
        id: 1,
        type: 'delay',
        title: 'Dr. Smith is delayed',
        details: 'Notify 3 patients waiting in queue',
        priority: 'high',
        status: 'pending'
    },
    {
        id: 2,
        type: 'registration',
        title: 'New Web Registration',
        details: 'Kieran White - Needs insurance verification',
        priority: 'medium',
        status: 'pending',
        patientData: {
            name: 'Kieran White',
            age: 34,
            phone: '+1 (555) 012-3456',
            email: 'kieran.white@example.com',
            source: 'Web Portal',
            generatedId: 'WEB-8821',
            insuranceProvider: 'BlueCross',
            policyNumber: 'BC-99887766'
        }
    }
];

const ReceptionDashboard = ({ setActiveTab }) => {
    const [urgentItems, setUrgentItems] = useState(initialUrgentItems);
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [notificationSuccess, setNotificationSuccess] = useState(false);

    // Filtered lists
    const pendingItems = urgentItems.filter(item => item.status === 'pending');

    // Handlers
    const handleNotifyClick = () => {
        setShowNotifyModal(true);
    };

    const confirmNotify = () => {
        // Update item status
        setUrgentItems(prev => prev.map(item =>
            item.type === 'delay' ? { ...item, status: 'resolved' } : item
        ));
        setShowNotifyModal(false);
        setNotificationSuccess(true);
        setTimeout(() => setNotificationSuccess(false), 3000); // Hide toast after 3s
    };

    const handleWebRegistrationAction = (action) => {
        // Mark item as resolved
        setUrgentItems(prev => prev.map(item =>
            item.id === selectedRegistration.id ? { ...item, status: 'resolved' } : item
        ));
        setSelectedRegistration(null);
        // Could show a specific toast here too
        alert(`Registration ${action} successfully.`);
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', position: 'relative' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--reception-text-main)', marginBottom: '0.5rem' }}>Front Desk Overview</h1>
                <p className="text-label" style={{ fontSize: '1.1rem' }}>Welcome back, Sarah. Here represents the current clinic status.</p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Today's Appointments</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--reception-secondary)', color: 'var(--reception-primary)' }}>
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>42</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Scheduled</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Patients Checked In</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f0fdf4', color: 'var(--reception-success)' }}>
                            <UserCheck size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>18</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Arrived</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Patients Waiting</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: 'var(--reception-warning)' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>5</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>In Queue</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Available Doctors</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f8fafc', color: 'var(--reception-text-muted)' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>8</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>/ 12 Total</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Immediate Actions */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Urgent Actions</h3>
                        {notificationSuccess && (
                            <span style={{ color: 'var(--reception-success)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                                <CheckCircle size={14} /> Patients notified successfully
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pendingItems.length > 0 ? pendingItems.map(item => (
                            <div
                                key={item.id}
                                className="reception-card"
                                style={{
                                    margin: 0,
                                    borderLeft: `4px solid ${item.type === 'delay' ? 'var(--reception-warning)' : '#3b82f6'}`,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: item.type === 'delay' ? '#fffbeb' : 'white'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: item.type === 'delay' ? '#fef3c7' : '#dbeafe',
                                        color: item.type === 'delay' ? '#d97706' : '#2563eb',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {item.type === 'delay' ? <Bell size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="text-lg" style={{ fontSize: '1rem' }}>{item.title}</h4>
                                        <p className="text-label">{item.details}</p>
                                    </div>
                                </div>
                                {item.type === 'delay' ? (
                                    <button
                                        className="action-btn btn-outline"
                                        style={{ fontSize: '0.875rem', borderColor: '#d97706', color: '#d97706' }}
                                        onClick={handleNotifyClick}
                                    >
                                        Notify Patients
                                    </button>
                                ) : (
                                    <button
                                        className="action-btn btn-primary"
                                        style={{ fontSize: '0.875rem' }}
                                        onClick={() => setSelectedRegistration(item)}
                                    >
                                        Review Profile
                                    </button>
                                )}
                            </div>
                        )) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--reception-text-muted)', border: '1px dashed var(--reception-border)', borderRadius: '8px' }}>
                                <CheckCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p>All urgent matters resolved. Great job!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Queue Summary */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Queue Status</h3>
                        <button className="action-btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }} onClick={() => setActiveTab('queue')}>View All</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--reception-border)' }}>
                            <span className="text-value">Cardiology</span>
                            <span className="text-value text-green" style={{ color: 'var(--reception-success)' }}>2 Waiting</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--reception-border)' }}>
                            <span className="text-value">General Med</span>
                            <span className="text-value text-orange" style={{ color: 'var(--reception-warning)' }}>5 Waiting</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span className="text-value">Pediatrics</span>
                            <span className="text-value" style={{ color: 'var(--reception-text-muted)' }}>Empty</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notify Modal */}
            {showNotifyModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white', width: '400px', borderRadius: '12px',
                        padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '48px', height: '48px', background: '#fff7ed', color: '#d97706', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <AlertTriangle size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Notify Patients?</h3>
                            <p className="text-label">This will send a delay alert to <strong>3 patients</strong> waiting for Dr. Smith.</p>
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--reception-text-main)' }}>
                                "Your appointment with Dr. Smith is delayed. Thank you for your patience."
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="action-btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => setShowNotifyModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="action-btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={confirmNotify}
                            >
                                Confirm Notify
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Web Registration Panel */}
            {selectedRegistration && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.25)', zIndex: 100,
                    display: 'flex', justifyContent: 'flex-end'
                }}>
                    <div style={{
                        width: '500px', height: '100%', background: 'white',
                        boxShadow: '-10px 0 25px rgba(0,0,0,0.1)',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--reception-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Review Registration</h3>
                                <p className="text-label">Web Source • {selectedRegistration.patientData.generatedId}</p>
                            </div>
                            <button onClick={() => setSelectedRegistration(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--reception-text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={32} color="#64748b" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedRegistration.patientData.name}</h2>
                                    <p className="text-label">{selectedRegistration.patientData.age} Years • {selectedRegistration.patientData.phone}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <h4 className="text-label" style={{ marginBottom: '0.5rem' }}>Contact Email</h4>
                                    <p className="text-value">{selectedRegistration.patientData.email}</p>
                                </div>
                                <div>
                                    <h4 className="text-label" style={{ marginBottom: '0.5rem' }}>Insurance Details (Pending Verification)</h4>
                                    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <span className="text-label" style={{ fontSize: '0.8rem' }}>Provider</span>
                                                <div className="text-value">{selectedRegistration.patientData.insuranceProvider}</div>
                                            </div>
                                            <div>
                                                <span className="text-label" style={{ fontSize: '0.8rem' }}>Policy Number</span>
                                                <div className="text-value">{selectedRegistration.patientData.policyNumber}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--reception-border)', display: 'flex', gap: '1rem' }}>
                            <button
                                className="action-btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => handleWebRegistrationAction('marked as pending')}
                            >
                                Mark Pending
                            </button>
                            <button
                                className="action-btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={() => handleWebRegistrationAction('approved')}
                            >
                                Approve Registration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionDashboard;
