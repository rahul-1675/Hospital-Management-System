import React, { useState, useEffect } from 'react';
import { Users, Calendar, FileText, Activity, Clock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { doctorService } from '../../../services/doctor.service';

const DoctorDashboard = ({ setActiveTab, onRefresh }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        todayAppointments: 0,
        patientsWaiting: 0,
        pendingReports: 0,
        avgConsultTime: '15m',
        upNext: [],
        activity: []
    });
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            setLoading(true);
            const res = await doctorService.getDashboardStats();
            if (res) {
                setStats(res);
            }
        } catch (err) {
            console.warn('Failed to load doctor dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const doctorDisplayName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Doctor';

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header className="glass-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--doctor-text-main)', marginBottom: '0.5rem' }}>
                        Good Day, {doctorDisplayName}
                    </h1>
                    <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>
                        Here's your live clinical queue and patient schedule overview.
                    </p>
                </div>
                <button
                    className="action-btn btn-outline"
                    onClick={() => {
                        loadStats();
                        if (onRefresh) onRefresh();
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
                </button>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem', marginTop: '1.5rem' }}>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Appointments</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--doctor-secondary)', color: 'var(--doctor-primary)' }}>
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>
                            {stats.todayAppointments}
                        </span>
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
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>
                            {stats.patientsWaiting}
                        </span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Now</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Pending Reviews</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: 'var(--doctor-warning)' }}>
                            <FileText size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>
                            {stats.pendingReports}
                        </span>
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
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>
                            {stats.avgConsultTime || '15m'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Next Up */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Up Next</h3>
                        <button className="action-btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} onClick={() => setActiveTab('appointments')}>
                            View Schedule
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.upNext && stats.upNext.length > 0 ? (
                            stats.upNext.map((item, idx) => (
                                <div key={item.id || idx} className="doctor-card" style={{ margin: 0, borderLeft: idx === 0 ? '4px solid var(--doctor-primary)' : '' }}>
                                    <div className="doctor-card-header">
                                        <span className="text-value" style={{ color: idx === 0 ? 'var(--doctor-primary)' : 'inherit' }}>{item.time}</span>
                                        <span className={`status-badge status-${item.status || 'pending'}`}>{item.status || 'scheduled'}</span>
                                    </div>
                                    <h4 className="text-lg">{item.patientName}</h4>
                                    <p className="text-label">{item.reason}</p>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--doctor-text-muted)', background: '#f8fafc', borderRadius: '8px' }}>
                                No upcoming appointments queued right now.
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications / Activity */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Live Activity</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {stats.activity && stats.activity.length > 0 ? (
                            stats.activity.map((act, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: act.type === 'result' ? '#f0fdf4' : act.type === 'alert' ? '#fef2f2' : '#e0f2fe',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: act.type === 'result' ? 'var(--doctor-success)' : act.type === 'alert' ? '#ef4444' : 'var(--doctor-primary)',
                                        flexShrink: 0
                                    }}>
                                        {act.type === 'result' ? <FileText size={16} /> : act.type === 'alert' ? <AlertCircle size={16} /> : <Activity size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-value" style={{ fontSize: '0.9rem' }}>{act.title}</p>
                                        <p className="text-label" style={{ fontSize: '0.8rem' }}>{act.detail} • {act.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--doctor-text-muted)' }}>
                                All systems normal.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

