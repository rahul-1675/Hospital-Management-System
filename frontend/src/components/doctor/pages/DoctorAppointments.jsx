import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, AlertCircle, CheckCircle, FileText, Activity, Save, X, ChevronRight, History, RefreshCw, CalendarX } from 'lucide-react';
import { doctorService } from '../../../services/doctor.service';
import CancelAppointmentModal from '../modals/CancelAppointmentModal';

const DoctorAppointments = ({ appointments = [], setAppointments, onRefresh, loading }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Default select the first appointment if none is selected
    useEffect(() => {
        if (appointments.length > 0 && (!selectedId || !appointments.some(a => a.id === selectedId))) {
            setSelectedId(appointments[0].id);
        }
    }, [appointments, selectedId]);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // Derived state
    const selectedAppointment = appointments.find(app => app.id === selectedId) || appointments[0];

    // Handlers
    const handleStartConsultation = async () => {
        if (!selectedAppointment) return;

        const updatedAppointments = appointments.map(app =>
            app.id === selectedAppointment.id
                ? { ...app, status: 'in-consultation' }
                : app
        );
        setAppointments(updatedAppointments);

        try {
            await doctorService.updateConsultation(selectedAppointment.id, { status: 'in-consultation' });
            showToast('Consultation started');
        } catch (err) {
            console.warn('Failed to update consultation status:', err);
        }
    };

    const handleNotesChange = (e) => {
        const val = e.target.value;
        const updatedAppointments = appointments.map(app =>
            app.id === selectedAppointment.id
                ? { ...app, notes: val }
                : app
        );
        setAppointments(updatedAppointments);
    };

    const handleSaveDraft = async () => {
        if (!selectedAppointment) return;
        setSaving(true);
        try {
            await doctorService.updateConsultation(selectedAppointment.id, {
                status: selectedAppointment.status,
                notes: selectedAppointment.notes
            });
            showToast('Clinical notes draft saved');
        } catch (err) {
            console.warn('Failed to save draft:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleCompleteClick = () => {
        if (!selectedAppointment?.notes?.trim()) {
            alert("Please enter clinical notes before marking consultation as completed.");
            return;
        }
        setShowCompleteConfirm(true);
    };

    const confirmCompletion = async () => {
        if (!selectedAppointment) return;
        setSaving(true);

        const updatedAppointments = appointments.map(app =>
            app.id === selectedAppointment.id
                ? { ...app, status: 'completed', completedAt: new Date().toISOString() }
                : app
        );
        setAppointments(updatedAppointments);
        setShowCompleteConfirm(false);

        try {
            await doctorService.updateConsultation(selectedAppointment.id, {
                status: 'completed',
                notes: selectedAppointment.notes
            });
            showToast('Consultation finalized and completed successfully');
            if (onRefresh) onRefresh();
        } catch (err) {
            console.warn('Failed to finalize consultation:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelAppointment = async (id, reason) => {
        setSaving(true);
        try {
            const res = await doctorService.cancelAppointment(id, reason);
            if (res && res.success !== false) {
                const updated = appointments.map(app =>
                    app.id === id ? { ...app, status: 'cancelled', cancellationReason: reason } : app
                );
                setAppointments(updated);
                showToast('Appointment cancelled successfully');
                if (onRefresh) onRefresh();
            } else {
                showToast('Failed to cancel appointment');
            }
        } catch (err) {
            console.warn('Failed to cancel appointment:', err);
            showToast('Error cancelling appointment');
        } finally {
            setSaving(false);
        }
    };

    const renderStatusBadge = (status = 'pending') => {
        const s = (status || 'pending').toLowerCase();
        return <span className={`status-badge status-${s}`}>{s.replace('-', ' ')}</span>;
    };

    return (
        <div className="split-view-container" style={{ position: 'relative' }}>
            {/* Left Panel: List */}
            <div className="list-panel">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--doctor-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="text-lg">Today's Schedule</h2>
                        <p className="text-label">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    </div>
                    {onRefresh && (
                        <button
                            className="action-btn btn-outline"
                            onClick={onRefresh}
                            style={{ padding: '0.4rem 0.6rem' }}
                            title="Refresh Schedule"
                        >
                            <RefreshCw size={14} className={loading ? 'spin' : ''} />
                        </button>
                    )}
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--doctor-text-muted)' }}>
                            Loading appointments...
                        </div>
                    ) : appointments.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--doctor-text-muted)' }}>
                            No appointments found for today.
                        </div>
                    ) : (
                        appointments.map(app => (
                            <div
                                key={app.id}
                                className={`doctor-card ${selectedAppointment?.id === app.id ? 'active' : ''}`}
                                style={{ opacity: app.status === 'completed' ? 0.65 : 1 }}
                                onClick={() => {
                                    setSelectedId(app.id);
                                    setShowHistory(false);
                                }}
                            >
                                <div className="doctor-card-header">
                                    <span className="time-slot">{app.time}</span>
                                    {renderStatusBadge(app.status)}
                                </div>
                                <div>
                                    <h4 className="text-value">{app.patientName}</h4>
                                    <p className="text-label">{app.age ? `${app.age} yrs` : 'Patient'} • {app.gender || 'Standard'}</p>
                                </div>
                                <p className="text-label" style={{ marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {app.reason}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Detail / Workspace */}
            <div className="detail-panel">
                {selectedAppointment ? (
                    <>
                        {/* Header */}
                        <div className="detail-header glass-header" style={{ marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{selectedAppointment.patientName}</h2>
                                <p className="text-label" style={{ fontSize: '1rem', margin: 0 }}>
                                    Patient Record • {selectedAppointment.age ? `${selectedAppointment.age} Years` : 'Adult'} • {selectedAppointment.gender || 'Patient'}
                                </p>
                            </div>
                            {renderStatusBadge(selectedAppointment.status)}
                        </div>

                        {/* Consultation Workspace vs Standard View */}
                        {selectedAppointment.status === 'in-consultation' ? (
                            <div className="consultation-workspace detail-card" style={{ padding: '2rem' }}>
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Activity size={20} color="#f59e0b" />
                                    <div>
                                        <h4 style={{ color: '#9a3412', margin: 0 }}>Consultation in Progress</h4>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#c2410c' }}>Active Session • Please enter clinical notes & treatment details</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <h3 className="section-title"><AlertCircle size={20} /> Reason for Visit</h3>
                                        <p className="text-value" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--doctor-border)' }}>
                                            {selectedAppointment.reason}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="section-title"><Activity size={20} /> Recorded Vitals</h3>
                                        <p className="text-value" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--doctor-border)' }}>
                                            {selectedAppointment.vitals || 'BP: 120/80 • HR: 72 bpm'}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 className="section-title" style={{ color: 'var(--doctor-primary)' }}>
                                        <FileText size={20} /> Clinical Notes & Observations
                                    </h3>
                                    <textarea
                                        value={selectedAppointment.notes || ''}
                                        onChange={handleNotesChange}
                                        placeholder="Enter clinical observations, diagnosis, and treatment plan..."
                                        autoFocus
                                        style={{
                                            width: '100%',
                                            minHeight: '200px',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--doctor-border)',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                            outlineColor: 'var(--doctor-primary)'
                                        }}
                                    />
                                    {(!selectedAppointment.notes || !selectedAppointment.notes.trim()) && (
                                        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>Notes are required to complete consultation.</p>
                                    )}
                                </div>

                                {/* Action Bar */}
                                <div style={{
                                    display: 'flex', gap: '1rem', padding: '1.5rem',
                                    background: 'white', borderTop: '1px solid var(--doctor-border)',
                                    position: 'sticky', bottom: '-2rem', margin: '0 -2rem -2rem -2rem',
                                    marginTop: 'auto', borderRadius: '0 0 16px 16px'
                                }}>
                                    <button
                                        className="action-btn btn-outline"
                                        onClick={handleSaveDraft}
                                        disabled={saving}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Save size={18} /> {saving ? 'Saving...' : 'Save Draft'}
                                    </button>
                                    <div style={{ flex: 1 }}></div>
                                    <button
                                        className="action-btn btn-outline"
                                        onClick={() => setShowHistory(true)}
                                    >
                                        View History
                                    </button>
                                    <button
                                        className="action-btn btn-primary"
                                        style={{ backgroundColor: !selectedAppointment.notes?.trim() ? '#94a3b8' : 'var(--doctor-success)' }}
                                        onClick={handleCompleteClick}
                                        disabled={!selectedAppointment.notes?.trim() || saving}
                                    >
                                        Mark Completed
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Standard Detail View (Pending / Completed)
                            <div>
                                <div className="detail-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', padding: '1.5rem' }}>
                                    <div>
                                        <h3 className="section-title"><AlertCircle size={20} /> Reason for Visit</h3>
                                        <p className="text-value">{selectedAppointment.reason}</p>
                                    </div>
                                    <div>
                                        <h3 className="section-title"><Activity size={20} /> Vitals</h3>
                                        <p className="text-value">{selectedAppointment.vitals || 'BP: 120/80 • HR: 72 bpm'}</p>
                                    </div>
                                </div>

                                {(selectedAppointment.status === 'completed' || selectedAppointment.notes) && (
                                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--doctor-border)' }}>
                                        <h3 className="section-title"><FileText size={20} /> Doctor's Clinical Notes</h3>
                                        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--doctor-text-main)' }}>{selectedAppointment.notes || "No notes recorded."}</p>
                                    </div>
                                )}

                                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--doctor-secondary)', borderRadius: '8px' }}>
                                    <h3 className="section-title" style={{ color: 'var(--doctor-primary)' }}><Clock size={20} /> Patient Information</h3>
                                    <p style={{ margin: 0 }}>{selectedAppointment.history || `OPD Registered Consultation`}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--doctor-border)' }}>
                                    {selectedAppointment.status === 'completed' ? (
                                        <button className="action-btn btn-outline" disabled style={{ opacity: 0.6, flex: 1 }}>
                                            Consultation Completed
                                        </button>
                                    ) : selectedAppointment.status === 'cancelled' ? (
                                        <button className="action-btn btn-outline" disabled style={{ opacity: 0.6, flex: 1, color: '#ef4444', borderColor: '#fca5a5' }}>
                                            Appointment Cancelled
                                        </button>
                                    ) : (
                                        <>
                                            <button className="action-btn btn-primary" style={{ flex: 1 }} onClick={handleStartConsultation}>
                                                Start Consultation
                                            </button>
                                            <button
                                                className="action-btn btn-outline"
                                                onClick={() => setShowCancelModal(true)}
                                                style={{ color: '#ef4444', borderColor: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                            >
                                                <CalendarX size={16} /> Cancel Appointment
                                            </button>
                                        </>
                                    )}
                                    <button className="action-btn btn-outline" onClick={() => setShowHistory(true)}>
                                        View History
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--doctor-text-muted)' }}>
                        Select an appointment from the list to view clinical details
                    </div>
                )}
            </div>

            {/* History Slide-over Panel */}
            {showHistory && selectedAppointment && (
                <div style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0, width: '400px',
                    background: 'white', borderLeft: '1px solid var(--doctor-border)',
                    boxShadow: '-4px 0 15px rgba(0,0,0,0.05)',
                    zIndex: 20, display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--doctor-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                        <h3 style={{ margin: 0, color: 'var(--doctor-text-main)' }}>Medical History</h3>
                        <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--doctor-text-muted)' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {selectedAppointment.pastVisits && selectedAppointment.pastVisits.length > 0 ? (
                                selectedAppointment.pastVisits.map((visit, idx) => (
                                    <div key={idx} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--doctor-border)' }}>
                                        <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--doctor-primary)' }}></div>
                                        <p className="text-label" style={{ marginBottom: '0.25rem' }}>{visit.date}</p>
                                        <h4 className="text-value">{visit.diagnosis}</h4>
                                        <p className="text-label">Dr. {visit.doctor}</p>
                                        {visit.prescription && (
                                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                💊 {visit.prescription}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-label" style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    No previous hospital visits recorded for this patient.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showCompleteConfirm && (
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
                            <div style={{ width: '48px', height: '48px', background: '#ecfdf5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <CheckCircle size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Complete Consultation?</h3>
                            <p className="text-label">This will finalize the consultation, save the clinical notes, and update the patient record.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="action-btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => setShowCompleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="action-btn btn-primary"
                                style={{ flex: 1, backgroundColor: 'var(--doctor-success)' }}
                                onClick={confirmCompletion}
                            >
                                Confirm Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Appointment Modal */}
            {showCancelModal && selectedAppointment && (
                <CancelAppointmentModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    appointment={selectedAppointment}
                    onConfirm={handleCancelAppointment}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    backgroundColor: '#10b981', color: 'white',
                    padding: '1rem 1.5rem', borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    zIndex: 2000
                }}>
                    <CheckCircle size={20} />
                    <span style={{ fontWeight: '600' }}>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;

