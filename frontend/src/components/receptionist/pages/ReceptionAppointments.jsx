import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, ArrowRight, UserPlus } from 'lucide-react';
import { useReception } from '../../../context/ReceptionContext';

const ReceptionAppointments = () => {
    const { appointments, doctorsList, checkInPatient, rescheduleAppointment, cancelAppointment } = useReception();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    // Reschedule form state
    const [rescheduleData, setRescheduleData] = useState({
        date: '',
        time: '10:00 AM',
        doctor: ''
    });

    // Update selected appt if it changes in context (e.g. status)
    const currentSelected = selectedAppointment
        ? (appointments.find(a => (a.id || a._id) === (selectedAppointment.id || selectedAppointment._id)) || selectedAppointment)
        : (appointments[0] || null);

    const handleCheckIn = () => {
        if (currentSelected) {
            checkInPatient(currentSelected.id || currentSelected._id);
        }
    };

    const openReschedule = () => {
        if (currentSelected) {
            setRescheduleData({
                date: currentSelected.date || new Date().toISOString().split('T')[0],
                time: currentSelected.time || '10:00 AM',
                doctor: currentSelected.doctorName || (doctorsList[0]?.name || 'Dr. Sarah Smith')
            });
            setIsRescheduleModalOpen(true);
        }
    };

    const handleRescheduleSubmit = (e) => {
        e.preventDefault();
        rescheduleAppointment(currentSelected.id || currentSelected._id, rescheduleData.date, rescheduleData.time, rescheduleData.doctor);
        setIsRescheduleModalOpen(false);
    };

    return (
        <div className="split-view-container" style={{ position: 'relative' }}>
            {/* Left Panel: List */}
            <div className="list-panel">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--reception-border)' }}>
                    <h2 className="text-lg" style={{ margin: 0, fontWeight: 700 }}>Today's Clinical Schedule</h2>
                    <p className="text-label" style={{ margin: '0.25rem 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div>
                    {appointments.length > 0 ? (
                        appointments.map(app => (
                            <div
                                key={app.id || app._id}
                                className={`reception-card ${currentSelected && (currentSelected.id === app.id || currentSelected._id === app._id) ? 'active' : ''}`}
                                onClick={() => setSelectedAppointment(app)}
                            >
                                <div className="reception-card-header">
                                    <span style={{ fontWeight: 600, color: 'var(--reception-text-main)' }}>{app.time}</span>
                                    <span className={`status-badge status-${(app.status || 'scheduled').toLowerCase()}`}>
                                        {(app.status || 'scheduled').replace('-', ' ')}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-value">{app.patientName}</h4>
                                    <p className="text-label">{app.doctorName} • {app.department || app.type}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--reception-text-muted)' }}>
                            <Calendar size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                            <p style={{ margin: 0, fontWeight: 600 }}>No Appointments Yet</p>
                            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Walk-in patients registered at the intake desk will appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Detail */}
            <div className="detail-panel">
                {currentSelected ? (
                    <div className="detail-card" style={{ padding: '2rem' }}>
                        <div className="detail-header" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>{currentSelected.patientName}</h2>
                                <p className="text-label" style={{ fontSize: '1.05rem' }}>
                                    {currentSelected.type || 'Consultation'} with <strong>{currentSelected.doctorName}</strong> ({currentSelected.department || 'General'})
                                </p>
                            </div>
                            <div className={`status-badge status-${(currentSelected.status || 'scheduled').toLowerCase()}`} style={{ fontSize: '0.95rem', padding: '0.5rem 1.1rem' }}>
                                {(currentSelected.status || 'scheduled').replace('-', ' ')}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            <div>
                                <h3 className="section-title"><Clock size={20} /> Appointment Slot & Contact</h3>
                                <p className="text-value" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Time: {currentSelected.time}</p>
                                <p className="text-value" style={{ marginBottom: '0.5rem' }}>Phone: {currentSelected.contact || 'Not Provided'}</p>
                                {currentSelected.queueToken && (
                                    <p className="text-value" style={{ color: '#0284c7', fontWeight: 700 }}>Queue Token: #{currentSelected.queueToken}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="section-title"><AlertCircle size={20} /> Clinical Reason & Symptoms</h3>
                                <p className="text-value" style={{ lineHeight: '1.6' }}>{currentSelected.details || 'General clinical assessment and health checkup.'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--reception-border)', paddingTop: '2rem' }}>
                            {['scheduled', 'booked'].includes((currentSelected.status || '').toLowerCase()) ? (
                                <>
                                    <button className="action-btn btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={handleCheckIn}>
                                        <CheckCircle size={18} /> Check In Patient
                                    </button>
                                    <button className="action-btn btn-outline" style={{ flex: 1, padding: '0.75rem' }} onClick={openReschedule}>
                                        Reschedule
                                    </button>
                                </>
                            ) : (
                                <button className="action-btn btn-outline" disabled style={{ flex: 1, opacity: 0.7, padding: '0.75rem' }}>
                                    Status: {(currentSelected.status || '').replace('-', ' ').toUpperCase()}
                                </button>
                            )}

                            {currentSelected.status !== 'cancelled' && (
                                <button
                                    className="action-btn btn-danger"
                                    style={{ padding: '0.75rem 1.25rem' }}
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                            cancelAppointment(currentSelected.id || currentSelected._id);
                                        }
                                    }}
                                >
                                    <XCircle size={18} /> Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--reception-text-muted)' }}>
                        Select an appointment from the schedule list to view details
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            {isRescheduleModalOpen && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '420px', background: 'white', borderRadius: '14px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.35rem', fontWeight: 700 }}>Reschedule Appointment</h2>
                        <form onSubmit={handleRescheduleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">New Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    required
                                    value={rescheduleData.date}
                                    onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">New Time Slot</label>
                                <select
                                    className="form-select"
                                    required
                                    value={rescheduleData.time}
                                    onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                >
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="09:30 AM">09:30 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="10:30 AM">10:30 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="11:30 AM">11:30 AM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="02:30 PM">02:30 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label className="form-label">Assign Attending Doctor</label>
                                <select
                                    className="form-select"
                                    value={rescheduleData.doctor}
                                    onChange={e => setRescheduleData({ ...rescheduleData, doctor: e.target.value })}
                                >
                                    {doctorsList.length > 0 ? (
                                        doctorsList.map(doc => (
                                            <option key={doc._id || doc.id} value={doc.name}>
                                                {doc.name} ({doc.department || 'General'})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="Dr. Sarah Smith">Dr. Sarah Smith (Cardiology)</option>
                                    )}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="action-btn btn-outline" onClick={() => setIsRescheduleModalOpen(false)}>Cancel</button>
                                <button type="submit" className="action-btn btn-primary">Confirm Reschedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionAppointments;

