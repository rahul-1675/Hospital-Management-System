import React, { useState } from 'react';
import { useStaff } from '../../../context/StaffContext';
import { Calendar, Clock, RefreshCw, Eye, EyeOff, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const StaffSchedule = () => {
    const { schedule, requestSwap, toggleAvailability } = useStaff();
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [swapReason, setSwapReason] = useState('');

    const handleSwapClick = (shift) => {
        setSelectedShift(shift);
        setSwapReason('');
        setSwapModalOpen(true);
    };

    const submitSwap = (e) => {
        e.preventDefault();
        requestSwap(selectedShift.id, swapReason);
        setSwapModalOpen(false);
    };

    const isPast = (dateStr) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr < today;
    };

    const isCurrent = (dateStr) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header className="glass-header">
                <h1 style={{ fontSize: '2rem', color: 'var(--doctor-text-main)', marginBottom: '0.5rem' }}>Work Schedule</h1>
                <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Review your upcoming shifts and manage your availability</p>
            </header>

            <div className="patient-grid">
                {schedule.map(shift => {
                    const past = isPast(shift.date);
                    const current = isCurrent(shift.date);
                    const cardClass = `doctor-card ${current ? 'active' : ''}`;

                    return (
                        <div key={shift.id} className={cardClass} style={{ margin: 0, opacity: past ? 0.7 : 1 }}>
                            <div className="doctor-card-header" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={18} color="var(--doctor-primary)" />
                                    <span className="text-value" style={{ fontWeight: 700 }}>
                                        {new Date(shift.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                {current && <span className="status-badge status-checked-in">Today</span>}
                                {past && <span className="status-badge status-pending">Past</span>}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Clock size={16} color="var(--doctor-text-muted)" />
                                    <span style={{ fontSize: '0.95rem', color: 'var(--doctor-text-main)' }}>{shift.start} - {shift.end}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <MapPin size={16} color="var(--doctor-text-muted)" />
                                    <span style={{ fontSize: '0.95rem', color: 'var(--doctor-text-main)' }}>Ward A-101</span>
                                </div>
                                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--doctor-border)' }}>
                                    <span className={`status-badge ${shift.swapRequested ? 'status-in-consultation' : 'status-completed'}`} style={{ display: 'inline-block' }}>
                                        {shift.swapRequested ? 'Swap Pending' : 'Confirmed'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button
                                    className="action-btn btn-outline"
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                    onClick={() => !past && !shift.swapRequested && handleSwapClick(shift)}
                                    disabled={past || shift.swapRequested}
                                >
                                    <RefreshCw size={14} /> Swap
                                </button>
                                <button
                                    className="action-btn"
                                    style={{
                                        flex: 1, padding: '0.5rem', fontSize: '0.875rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                                        background: shift.available ? 'var(--doctor-secondary)' : '#fef2f2',
                                        color: shift.available ? 'var(--doctor-primary)' : '#ef4444'
                                    }}
                                    onClick={() => !past && toggleAvailability(shift.id)}
                                    disabled={past}
                                >
                                    {shift.available ? <Eye size={14} /> : <EyeOff size={14} />}
                                    {shift.available ? 'Avail' : 'Busy'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Swap Modal */}
            {swapModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="detail-card" style={{ width: '450px', maxWidth: '95%', animation: 'slideUp 0.3s ease' }}>
                        <div style={{ borderBottom: '1px solid var(--doctor-border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '0.5rem', background: '#fff7ed', borderRadius: '8px', color: 'var(--doctor-warning)' }}>
                                <RefreshCw size={20} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--doctor-text-main)' }}>Request Shift Swap</h2>
                        </div>

                        <div style={{ background: 'var(--doctor-bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--doctor-border)' }}>
                            <p className="text-label" style={{ marginBottom: '0.25rem' }}>Target Shift</p>
                            <p style={{ fontWeight: 700, margin: 0, color: 'var(--doctor-text-main)' }}>
                                {new Date(selectedShift?.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--doctor-text-muted)' }}>{selectedShift?.start} - {selectedShift?.end}</p>
                        </div>

                        <form onSubmit={submitSwap}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Reason for Request</label>
                                <textarea
                                    className="search-input"
                                    style={{ width: '100%', minHeight: '100px', resize: 'none' }}
                                    placeholder="Please provide a brief reason..."
                                    required
                                    value={swapReason}
                                    onChange={(e) => setSwapReason(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" className="action-btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSwapModalOpen(false)}>Cancel</button>
                                <button type="submit" className="action-btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffSchedule;
