import React, { useState } from 'react';
import { useStaff } from '../../../context/StaffContext';
import { Play, Pause, CheckCircle, ClipboardList, AlertTriangle } from 'lucide-react';

const StaffTasks = () => {
    const { tasks, startTask, pauseTask, completeTask } = useStaff();
    const [filter, setFilter] = useState('active'); // active, completed
    const [confirmationId, setConfirmationId] = useState(null);

    const confirmCompletion = () => {
        if (confirmationId) {
            completeTask(confirmationId);
            setConfirmationId(null);
        }
    };

    // Tasks are already in the staff object in context
    const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
    const displayedTasks = filter === 'completed' ? completedTasks : activeTasks;

    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'status-checked-in';
            case 'PAUSED': return 'status-in-consultation';
            case 'COMPLETED': return 'status-completed';
            default: return 'status-pending';
        }
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header className="glass-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--doctor-text-main)', marginBottom: '0.5rem' }}>My Tasks</h1>
                    <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Manage your assigned duties</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
                    <button
                        className={filter === 'active' ? 'action-btn btn-primary' : 'action-btn btn-ghost'}
                        onClick={() => setFilter('active')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                        Active ({activeTasks.length})
                    </button>
                    <button
                        className={filter === 'completed' ? 'action-btn btn-primary' : 'action-btn btn-ghost'}
                        onClick={() => setFilter('completed')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                        History ({completedTasks.length})
                    </button>
                </div>
            </header>

            <div className="patient-grid">
                {displayedTasks.map(task => {
                    const statusClass = getStatusClass(task.status);
                    const isActive = task.status === 'ACTIVE';

                    return (
                        <div key={task.id} className={`doctor-card ${isActive ? 'active' : ''}`} style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1rem' }}>
                            <div className="doctor-card-header">
                                <span className={`status-badge ${task.priority === 'High' ? 'status-in-consultation' : 'status-pending'}`} style={{ fontSize: '0.7rem' }}>
                                    {task.priority.toUpperCase()}
                                </span>
                                <span className={`status-badge ${statusClass}`}>
                                    {task.status}
                                </span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <p className="text-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>{task.type}</p>
                                <h3 className="text-lg" style={{ marginBottom: '0.5rem' }}>{task.title}</h3>
                                <p className="text-label" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{task.details}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                {task.status !== 'COMPLETED' ? (
                                    <>
                                        {isActive ? (
                                            <button
                                                className="action-btn"
                                                style={{ flex: 1, backgroundColor: '#fff7ed', color: '#d97706', border: '1px solid #fdba74', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                                onClick={() => pauseTask(task.id)}
                                            >
                                                <Pause size={16} /> Pause
                                            </button>
                                        ) : (
                                            <button
                                                className="action-btn btn-primary"
                                                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                                onClick={() => startTask(task.id)}
                                            >
                                                <Play size={16} /> Start
                                            </button>
                                        )}

                                        <button
                                            className="action-btn btn-outline"
                                            style={{ flex: 1, color: '#10b981', borderColor: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                            onClick={() => setConfirmationId(task.id)}
                                        >
                                            <CheckCircle size={16} /> Done
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--doctor-success)', width: '100%', justifyContent: 'center', padding: '0.5rem', background: '#f0fdf4', borderRadius: '8px' }}>
                                        <CheckCircle size={16} />
                                        <span style={{ fontWeight: 600 }}>Completed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {displayedTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--doctor-text-muted)' }}>
                    <ClipboardList size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <h3 className="text-lg">No tasks found</h3>
                    <p className="text-label">Your task list is empty.</p>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmationId && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="detail-card" style={{ width: '400px', maxWidth: '90%', animation: 'slideUp 0.3s ease' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '50px', height: '50px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-lg" style={{ marginBottom: '0.5rem' }}>Complete Task?</h3>
                            <p className="text-label">Are you sure you want to mark this task as completed?</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmationId(null)}>Cancel</button>
                            <button className="action-btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#16a34a' }} onClick={confirmCompletion}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffTasks;
