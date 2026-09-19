import React from 'react';
import { Users, Calendar, FileText, Activity, Clock, ArrowRight, AlertCircle } from 'lucide-react';

const DoctorDashboard = ({ setActiveTab }) => {
    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header className="glass-header">
                <h1 style={{ fontSize: '2rem', color: 'var(--doctor-text-main)', marginBottom: '0.5rem' }}>Good Morning, Dr. Smith</h1>
                <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Here's what's happening in your clinic today.</p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Appointments</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--doctor-secondary)', color: 'var(--doctor-primary)' }}>
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>8</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Today</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Patients Waiting</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f0fdf4', color: 'var(--doctor-success)' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>3</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Now</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Pending Reports</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: 'var(--doctor-warning)' }}>
                            <FileText size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>12</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>To Review</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Avg. Consult Time</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f8fafc', color: 'var(--doctor-text-muted)' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>14m</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Next Up */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Up Next</h3>
                        <button className="action-btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} onClick={() => setActiveTab('appointments')}>View Schedule</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="doctor-card" style={{ margin: 0, borderLeft: '4px solid var(--doctor-primary)' }}>
                            <div className="doctor-card-header">
                                <span className="text-value" style={{ color: 'var(--doctor-primary)' }}>09:00 AM</span>
                                <span className="status-badge status-pending">In 5 mins</span>
                            </div>
                            <h4 className="text-lg">Sarah Johnson</h4>
                            <p className="text-label">Severe migraine and sensitivity to light</p>
                        </div>

                        <div className="doctor-card" style={{ margin: 0 }}>
                            <div className="doctor-card-header">
                                <span className="text-value">09:30 AM</span>
                                <span className="status-badge status-pending">Pending</span>
                            </div>
                            <h4 className="text-lg">Michael Chen</h4>
                            <p className="text-label">Follow-up for hypertension</p>
                        </div>
                    </div>
                </div>

                {/* Notifications / Activity */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Activity</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--doctor-success)', flexShrink: 0 }}>
                                <FileText size={16} />
                            </div>
                            <div>
                                <p className="text-value" style={{ fontSize: '0.9rem' }}>Lab Results Received</p>
                                <p className="text-label" style={{ fontSize: '0.8rem' }}>Patient #8821 • 10 mins ago</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--doctor-primary)', flexShrink: 0 }}>
                                <Activity size={16} />
                            </div>
                            <div>
                                <p className="text-value" style={{ fontSize: '0.9rem' }}>Emergency Admit</p>
                                <p className="text-label" style={{ fontSize: '0.8rem' }}>Trauma Center • 25 mins ago</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                                <AlertCircle size={16} />
                            </div>
                            <div>
                                <p className="text-value" style={{ fontSize: '0.9rem' }}>Critical Vitals Alert</p>
                                <p className="text-label" style={{ fontSize: '0.8rem' }}>ICU Bed 4 • 1h ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
