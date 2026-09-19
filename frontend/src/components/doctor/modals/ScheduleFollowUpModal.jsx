import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';

const ScheduleFollowUpModal = ({ isOpen, onClose, patientName, onConfirm }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        reason: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onConfirm({
                ...formData,
                patientName,
                status: 'Scheduled',
                type: 'Follow-up'
            });
            setIsSubmitting(false);
            onClose();
            setFormData({ date: '', time: '', reason: '', notes: '' });
        }, 800);
    };

    // Get tomorrow's date for min attribute
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '16px',
                width: '500px', maxWidth: '95%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid var(--doctor-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--doctor-text-main)' }}>Schedule Follow-up</h2>
                        <p className="text-label">For patient: {patientName}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--doctor-text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                                Date <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                min={minDate}
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="search-input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                                Time <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="time"
                                name="time"
                                required
                                value={formData.time}
                                onChange={handleChange}
                                className="search-input"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                            Reason <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                            name="reason"
                            required
                            value={formData.reason}
                            onChange={handleChange}
                            className="search-input"
                            style={{ width: '100%' }}
                        >
                            <option value="">Select reason...</option>
                            <option value="Routine Checkup">Routine Checkup</option>
                            <option value="Review Test Results">Review Test Results</option>
                            <option value="Treatment Monitoring">Treatment Monitoring</option>
                            <option value="Post-Singery Review">Post-Surgery Review</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--doctor-text-main)' }}>
                            Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="search-input"
                            placeholder="Additional instructions..."
                            rows={3}
                            style={{ width: '100%', resize: 'none' }}
                        />
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
                            {isSubmitting ? 'Scheduling...' : <><Check size={18} /> Confirm Appointment</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleFollowUpModal;
