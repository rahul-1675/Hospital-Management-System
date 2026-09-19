import React, { useState, useEffect } from 'react';
import { useStaff } from '../../../context/StaffContext';
import { Activity, ClipboardList, Clock, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';

const StaffDashboard = ({ setActiveTab }) => {
    const { staff, tasks } = useStaff();
    const [timeLeft, setTimeLeft] = useState('0h 0m');

    const activeTasks = tasks.filter(t => t.status !== 'COMPLETED').length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const assignedTasks = tasks.length;

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (staff.shift.status !== 'ON') {
                setTimeLeft('Off Duty');
                return;
            }

            const now = Date.now();
            const end = staff.shift.endTime;
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('Shift Ended');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000);
        return () => clearInterval(timer);
    }, [staff.shift]);

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header className="glass-header">
                <h1 style={{ fontSize: '2rem', color: 'var(--doctor-text-main)', marginBottom: '0.5rem' }}>
                    Welcome back, {staff.name.split(' ')[0]}
                </h1>
                <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Here's what's happening today.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {/* KPI 1: Assigned Tasks */}
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Assigned Tasks</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--doctor-secondary)', color: 'var(--doctor-primary)' }}>
                            <ClipboardList size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>{assignedTasks}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Today</span>
                    </div>
                </div>

                {/* KPI 2: Active Tasks */}
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Active Tasks</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: 'var(--doctor-warning)' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>{activeTasks}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Pending</span>
                    </div>
                </div>

                {/* KPI 3: Shift Status */}
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Shift Status</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: staff.shift.status === 'ON' ? '#f0fdf4' : '#f1f5f9', color: staff.shift.status === 'ON' ? 'var(--doctor-success)' : 'var(--doctor-text-muted)' }}>
                            <Briefcase size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>
                            {staff.shift.status === 'ON' ? 'ON DUTY' : 'OFF DUTY'}
                        </span>
                    </div>
                </div>

                {/* KPI 4: Shift Timer */}
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Shift Ends In</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f5f3ff', color: '#8b5cf6' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>{timeLeft}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Current Tasks List */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Current Tasks</h3>
                        <button className="action-btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} onClick={() => setActiveTab('tasks')}>
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tasks.filter(t => t.status !== 'COMPLETED').slice(0, 3).map(task => (
                            <div key={task.id} className={`doctor-card ${task.status === 'ACTIVE' ? 'active' : ''}`} style={{ margin: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div className="doctor-card-header" style={{ marginBottom: '0.25rem', justifyContent: 'flex-start', gap: '0.5rem' }}>
                                        <span className={`status-badge ${task.priority === 'High' ? 'status-in-consultation' : 'status-pending'}`}>
                                            {task.priority} Priority
                                        </span>
                                        {task.status === 'ACTIVE' && (
                                            <span className="status-badge status-checked-in">Started</span>
                                        )}
                                    </div>
                                    <h4 className="text-lg" style={{ fontSize: '1.1rem', margin: 0 }}>{task.title}</h4>
                                    <p className="text-label" style={{ margin: 0, marginTop: '0.25rem' }}>{task.type}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="text-value" style={{ fontSize: '0.9rem' }}>{task.status}</span>
                                </div>
                            </div>
                        ))}
                        {tasks.filter(t => t.status !== 'COMPLETED').length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--doctor-text-muted)' }}>
                                <CheckCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p>All tasks completed for today!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Department Status or Notifications */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Notifications</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--doctor-success)', flexShrink: 0 }}>
                                <Briefcase size={16} />
                            </div>
                            <div>
                                <p className="text-value" style={{ fontSize: '0.9rem' }}>Shift Started</p>
                                <p className="text-label" style={{ fontSize: '0.8rem' }}>Signed in 1h ago</p>
                            </div>
                        </div>
                        {/* Dynamic notifications from context if available, otherwise placeholders that look like Doctor's */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
