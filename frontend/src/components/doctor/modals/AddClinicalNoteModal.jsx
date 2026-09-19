import React, { useState } from 'react';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';

const AddClinicalNoteModal = ({ isOpen, onClose, patientName, onSave }) => {
    const [formData, setFormData] = useState({
        diagnosis: '',
        symptoms: '',
        notes: '',
        prescription: '',
        needsFollowUp: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
        if (!formData.symptoms.trim()) newErrors.symptoms = 'Symptoms are required';
        if (!formData.notes.trim()) newErrors.notes = 'Clinical notes are required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onSave({
                ...formData,
                date: new Date().toISOString(),
                doctor: 'Dr. Smith' // In a real app, from auth context
            });
            setIsSubmitting(false);
            onClose();
            // Reset form
            setFormData({
                diagnosis: '',
                symptoms: '',
                notes: '',
                prescription: '',
                needsFollowUp: false
            });
        }, 800);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '16px',
                width: '600px', maxWidth: '95%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid var(--doctor-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--doctor-text-main)' }}>Add Clinical Note</h2>
                        <p className="text-label">For patient: {patientName}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--doctor-text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                            Diagnosis <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            className="search-input"
                            placeholder="e.g. Acute Bronchitis"
                            style={{ width: '100%', borderColor: errors.diagnosis ? '#ef4444' : '' }}
                        />
                        {errors.diagnosis && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.diagnosis}</p>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                                Symptoms <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                className="search-input"
                                placeholder="List reported symptoms..."
                                rows={4}
                                style={{ width: '100%', resize: 'none', borderColor: errors.symptoms ? '#ef4444' : '' }}
                            />
                            {errors.symptoms && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.symptoms}</p>}
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                                Clinical Notes <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="search-input"
                                placeholder="Observations & examination details..."
                                rows={4}
                                style={{ width: '100%', resize: 'none', borderColor: errors.notes ? '#ef4444' : '' }}
                            />
                            {errors.notes && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.notes}</p>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                            Prescription
                        </label>
                        <textarea
                            name="prescription"
                            value={formData.prescription}
                            onChange={handleChange}
                            className="search-input"
                            placeholder="Medications, dosage, and instructions..."
                            rows={3}
                            style={{ width: '100%', resize: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <input
                            type="checkbox"
                            id="needsFollowUp"
                            name="needsFollowUp"
                            checked={formData.needsFollowUp}
                            onChange={handleChange}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        <label htmlFor="needsFollowUp" style={{ fontWeight: '500', color: 'var(--doctor-text-main)', cursor: 'pointer' }}>
                            Schedule Follow-up Required
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="action-btn btn-outline"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="action-btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Clinical Note</>}
                        </button>
                    </div>
                </form>
            </div>
            <style>
                {`
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default AddClinicalNoteModal;
