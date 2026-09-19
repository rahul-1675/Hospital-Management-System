import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useReception } from '../../../context/ReceptionContext';

const ReceptionAppointments = () => {
    const { appointments, checkInPatient, rescheduleAppointment, cancelAppointment } = useReception();
    const [selectedAppointment, setSelectedAppointment] = useState(appointments[0]);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    // Reschedule form state
    const [rescheduleData, setRescheduleData] = useState({
        date: '',
        time: '',
        doctor: ''
    });

    // Update selected appt if it changes in context (e.g. status status)
    const currentSelected = appointments.find(a => a.id === selectedAppointment?.id) || selectedAppointment;

    const handleCheckIn = () => {
        if (currentSelected) {
            checkInPatient(currentSelected.id);
        }
    };

    const openReschedule = () => {
        if (currentSelected) {
            setRescheduleData({
                date: new Date().toISOString().split('T')[0], // Today
                time: currentSelected.time,
                doctor: currentSelected.doctorName
            });
            setIsRescheduleModalOpen(true);
        }
    };

    const handleRescheduleSubmit = (e) => {
        e.preventDefault();
        rescheduleAppointment(currentSelected.id, rescheduleData.date, rescheduleData.time, rescheduleData.doctor);
        setIsRescheduleModalOpen(false);
    };

    return (
        <div className="split-view-container" style={{ position: 'relative' }}>
            {/* Left Panel: List */}
            <div className="list-panel">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--reception-border)' }}>
                    <h2 className="text-lg">Today's Schedule</h2>
                    <p className="text-label">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                    {appointments.map(app => (
                        <div
                            key={app.id}
                            className={`reception-card ${currentSelected?.id === app.id ? 'active' : ''}`}
                            onClick={() => setSelectedAppointment(app)}
                        >
                            <div className="reception-card-header">
                                <span style={{ fontWeight: 600, color: 'var(--reception-text-main)' }}>{app.time}</span>
                                <span className={`status-badge status-${app.status}`}>{app.status.replace('-', ' ')}</span>
                            </div>
                            <div>
                                <h4 className="text-value">{app.patientName}</h4>
                                <p className="text-label">{app.doctorName} • {app.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Detail */}
            <div className="detail-panel">
                {currentSelected ? (
                    <div className="detail-card">
                        <div className="detail-header" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{currentSelected.patientName}</h2>
                                <p className="text-label" style={{ fontSize: '1.1rem' }}>
                                    {currentSelected.type} With {currentSelected.doctorName}
                                </p>
                            </div>
                            <div className={`status-badge status-${currentSelected.status}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                {currentSelected.status.replace('-', ' ')}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            <div>
                                <h3 className="section-title"><Clock size={20} /> Time & Contact</h3>
                                <p className="text-value" style={{ marginBottom: '0.5rem' }}>{currentSelected.time}</p>
                                <p className="text-value">{currentSelected.contact}</p>
                            </div>
                            <div>
                                <h3 className="section-title"><AlertCircle size={20} /> Visit Reason</h3>
                                <p className="text-value">{currentSelected.details}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--reception-border)', paddingTop: '2rem' }}>
                            {currentSelected.status === 'scheduled' ? (
                                <>
                                    <button className="action-btn btn-primary" style={{ flex: 1 }} onClick={handleCheckIn}>
                                        <CheckCircle size={18} /> Check In Patient
                                    </button>
                                    <button className="action-btn btn-outline" style={{ flex: 1 }} onClick={openReschedule}>
                                        Reschedule
                                    </button>
                                </>
                            ) : (
                                <button className="action-btn btn-outline" disabled style={{ flex: 1, opacity: 0.5 }}>
                                    Status: {currentSelected.status.replace('-', ' ')}
                                </button>
                            )}

                            {currentSelected.status !== 'cancelled' && currentSelected.status !== 'checked-in' && (
                                <button
                                    className="action-btn btn-danger"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                            cancelAppointment(currentSelected.id);
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
                        Select an appointment to view details
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
                    <div style={{ width: '400px', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Reschedule Appointment</h2>
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
                                <label className="form-label">New Time</label>
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
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label className="form-label">Assign Doctor</label>
                                <select
                                    className="form-select"
                                    value={rescheduleData.doctor}
                                    onChange={e => setRescheduleData({ ...rescheduleData, doctor: e.target.value })}
                                >
                                    <option value="Dr. Smith">Dr. Smith</option>
                                    <option value="Dr. Jones">Dr. Jones</option>
                                    <option value="Dr. Williams">Dr. Williams</option>
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
