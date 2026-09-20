import React, { useState } from 'react';
import { X, UserMinus, ShieldAlert, Loader2 } from 'lucide-react';

const RequestPatientRemovalModal = ({ isOpen, onClose, patient, onSubmit }) => {
    const [reason, setReason] = useState('Treatment Completed');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !patient) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit({
            patientId: patient.id || patient._id,
            patientName: patient.name,
            reason,
            notes: notes.trim()
        });
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
                maxWidth: '500px',
                padding: '2rem',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: '#fef3c7', color: '#d97706',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <UserMinus size={22} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                                Request Patient Removal
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                                Requires Administrator Review & Approval
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                    color: '#334155'
                }}>
                    <div style={{ fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <ShieldAlert size={14} /> Hospital Protocol Requirement
                    </div>
                    <span>To maintain medical integrity and audit compliance, patient removal/discharge from active clinical records must be authorized by a Hospital Administrator.</span>
                </div>

                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                    Patient: <strong>{patient.name}</strong> (ID: {patient.id || 'N/A'})
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                            Removal / Discharge Reason *
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="form-select"
                            style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        >
                            <option value="Treatment Completed">Treatment Completed & Discharged</option>
                            <option value="Patient Discharged">Standard OPD Discharge</option>
                            <option value="Transferred to Another Facility">Transferred to Another Facility</option>
                            <option value="Inactive / Non-responsive">Inactive / Non-responsive Record</option>
                            <option value="Duplicate Profile">Duplicate Patient Profile</option>
                            <option value="Other">Other Clinical Reason</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                            Clinical Justification & Notes for Admin
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Explain reason for removal request to the Administrator..."
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#d97706',
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
                            Submit Request to Admin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestPatientRemovalModal;
