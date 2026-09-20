import React, { useState } from 'react';
import { X, AlertTriangle, Clock, Loader2 } from 'lucide-react';

const CancelAppointmentModal = ({ isOpen, onClose, appointment, onConfirm }) => {
    const [reason, setReason] = useState('Doctor Unavailable / Emergency');
    const [customNote, setCustomNote] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const finalReason = customNote.trim() ? `${reason} - ${customNote.trim()}` : reason;
        await onConfirm(appointment.id || appointment._id, finalReason);
        setLoading(false);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease'
        }}>
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '480px',
                padding: '2rem',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: '#fee2e2', color: '#dc2626',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AlertTriangle size={22} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            Cancel Appointment
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={20} />
                    </button>
                </div>

                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                    You are cancelling the appointment for <strong>{appointment.patientName}</strong> scheduled at <strong>{appointment.time || appointment.timeSlot || 'Scheduled time'}</strong>.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                            Cancellation Reason *
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="form-select"
                            style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        >
                            <option value="Doctor Unavailable / Emergency">Doctor Unavailable / Emergency Surgery</option>
                            <option value="Patient Rescheduled / Requested Cancellation">Patient Rescheduled / Requested</option>
                            <option value="Clinical Priority Triage">Clinical Priority Triage</option>
                            <option value="Clinic Schedule Adjusted">Clinic Schedule Adjusted</option>
                            <option value="Other Clinical Reason">Other Reason</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            rows={3}
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            placeholder="Provide any instructions for the patient or front desk..."
                            className="form-input"
                            style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="action-btn btn-outline"
                            style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#dc2626',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.6rem 1.25rem',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            {loading ? <Loader2 size={16} className="spin" /> : null}
                            Confirm Cancellation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CancelAppointmentModal;
