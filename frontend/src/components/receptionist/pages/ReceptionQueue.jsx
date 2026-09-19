import React from 'react';
import { Clock, Users, CheckCircle, Play } from 'lucide-react';
import { useReception } from '../../../context/ReceptionContext';

const ReceptionQueue = () => {
    // queue is now the nested object { doctors: { ... } }
    const { queue, callNext, markCompleted } = useReception();

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Live Queue Status</h1>
                    <p className="text-label" style={{ fontSize: '1.1rem' }}>Inline control for patient flow</p>
                </div>
                <div className="status-badge status-waiting" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 1.25rem', fontSize: '1rem' }}>
                    <Clock size={20} />
                    <span>Avg Wait: ~15 mins</span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {Object.entries(queue.doctors).map(([doctorName, docState]) => {
                    const { status, current, waiting, department } = docState;
                    const isBusy = status === 'BUSY';
                    const nextPatient = waiting.length > 0 ? waiting[0] : null;
                    const remainingQueue = waiting.slice(1);
                    const waitingCount = waiting.length;
                    const waitTime = waitingCount * 15;

                    return (
                        <div key={doctorName} className="detail-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Card Header */}
                            <div style={{ padding: '1.25rem', background: 'white', borderBottom: '1px solid var(--reception-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>{doctorName}</h3>
                                        <p className="text-label">{department || 'General'}</p>
                                    </div>
                                    <span
                                        className={`status-badge ${isBusy ? 'status-checking' : 'status-waiting'}`}
                                        style={{
                                            background: isBusy ? '#dcfce7' : '#f1f5f9',
                                            color: isBusy ? '#166534' : '#64748b',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
                                        {isBusy ? 'Busy' : 'Available'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Users size={16} className="text-label" />
                                        <span className="text-value">{waitingCount} Waiting</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={16} className="text-label" />
                                        <span className="text-value">~{waitTime}m Wait</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Patient Section (Zone 1) */}
                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderBottom: '1px solid var(--reception-border)' }}>
                                <p className="text-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                    Current Consultation
                                </p>
                                {current ? (
                                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#14532d', margin: 0 }}>{current.name}</h4>
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', color: '#166534', fontSize: '0.9rem' }}>
                                                    <span style={{ fontWeight: 600 }}>#{current.token}</span>
                                                    <span>•</span>
                                                    <span>{current.time}</span>
                                                </div>
                                            </div>
                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Active</span>
                                        </div>
                                        <button
                                            className="action-btn"
                                            style={{ width: '100%', background: '#16a34a', color: 'white', justifyContent: 'center', padding: '0.6rem' }}
                                            onClick={() => markCompleted(doctorName)}
                                        >
                                            <CheckCircle size={18} /> Mark Completed
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ padding: '1.5rem', border: '2px dashed var(--reception-border)', borderRadius: '8px', textAlign: 'center', color: 'var(--reception-text-muted)' }}>
                                        <p style={{ margin: 0 }}>Room is Empty</p>
                                    </div>
                                )}
                            </div>

                            {/* Queue Section (Zone 2 & 3) */}
                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <p className="text-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                    Next in Line
                                </p>

                                {nextPatient ? (
                                    <>
                                        <div style={{
                                            background: 'white', border: '1px solid var(--reception-border)', borderRadius: '8px', padding: '1rem',
                                            marginBottom: '1rem',
                                            boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--reception-text-main)', margin: 0 }}>{nextPatient.name}</h4>
                                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', color: 'var(--reception-text-muted)', fontSize: '0.9rem' }}>
                                                        <span style={{ fontWeight: 600, color: 'var(--reception-primary)' }}>#{nextPatient.token}</span>
                                                        <span>•</span>
                                                        <span>{nextPatient.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isBusy ? (
                                                <button
                                                    className="action-btn btn-outline"
                                                    disabled
                                                    style={{ width: '100%', justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed', background: '#f8fafc' }}
                                                >
                                                    Wait for Room
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-btn btn-primary"
                                                    style={{ width: '100%', justifyContent: 'center' }}
                                                    onClick={() => callNext(doctorName)}
                                                >
                                                    <Play size={18} fill="currentColor" /> Call Next
                                                </button>
                                            )}
                                        </div>

                                        {/* Remaining Queue */}
                                        {remainingQueue.length > 0 && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <p className="text-label" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>+ {remainingQueue.length} more in queue</p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {remainingQueue.slice(0, 3).map(p => (
                                                        <div key={p.token} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '4px', color: 'var(--reception-text-muted)' }}>
                                                            <span>{p.name}</span>
                                                            <span style={{ fontWeight: 500 }}>#{p.token}</span>
                                                        </div>
                                                    ))}
                                                    {remainingQueue.length > 3 && (
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--reception-text-muted)', textAlign: 'center', padding: '0.25rem' }}>...</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--reception-text-muted)', fontStyle: 'italic' }}>
                                        No patients waiting.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReceptionQueue;
