import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';
import { InlineLoader } from '../../common/Loader';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onClose(true); // true = success
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }, 1000);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '16px',
                width: '400px', maxWidth: '95%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid var(--doctor-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            padding: '0.5rem', backgroundColor: 'var(--doctor-bg)',
                            borderRadius: '8px', color: 'var(--doctor-primary)'
                        }}>
                            <Lock size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--doctor-text-main)', margin: 0 }}>
                            Change Password
                        </h2>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--doctor-text-muted)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    {error && (
                        <div style={{
                            padding: '0.75rem', backgroundColor: '#fef2f2',
                            border: '1px solid #fee2e2', borderRadius: '8px',
                            color: 'var(--doctor-danger)', fontSize: '0.875rem',
                            marginBottom: '1rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="form-input"
                                style={{ width: '100%' }}
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="form-input"
                                style={{ width: '100%' }}
                                placeholder="Min. 8 characters"
                            />
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                style={{ width: '100%' }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div style={{
                        marginTop: '1.5rem', display: 'flex',
                        justifyContent: 'flex-end', gap: '0.75rem'
                    }}>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="action-btn btn-outline"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="action-btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? <InlineLoader size="18px" text="Updating..." /> : <><Lock size={16} /> Update Password</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
