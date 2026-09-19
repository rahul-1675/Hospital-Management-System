import React, { useState } from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';

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
            backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '24px',
                width: '440px', maxWidth: '95%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '2rem 2rem 1.5rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.6rem', background: '#fef2f2', borderRadius: '12px', color: '#ef4444' }}>
                            <ShieldCheck size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Security Access</h2>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        style={{
                            background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b',
                            width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                        onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '0 2rem 2rem' }}>
                    <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Update your account password to maintain security standards.</p>

                    {error && (
                        <div style={{
                            padding: '1rem', marginBottom: '1.5rem', borderRadius: '12px',
                            backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 600,
                            border: '1px solid #fecaca'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.81rem', color: '#475569', textTransform: 'uppercase' }}>
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                width: '100%', padding: '0.875rem 1rem', borderRadius: '12px',
                                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem',
                                outline: 'none', transition: 'all 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.81rem', color: '#475569', textTransform: 'uppercase' }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            style={{
                                width: '100%', padding: '0.875rem 1rem', borderRadius: '12px',
                                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem',
                                outline: 'none', transition: 'all 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.81rem', color: '#475569', textTransform: 'uppercase' }}>
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                width: '100%', padding: '0.875rem 1rem', borderRadius: '12px',
                                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem',
                                outline: 'none', transition: 'all 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="action-btn btn-outline"
                            style={{ flex: 1, justifyContent: 'center', fontWeight: '700' }}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="action-btn btn-primary"
                            style={{ flex: 2, justifyContent: 'center', fontWeight: '700', gap: '0.75rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : <><Lock size={18} /> Update Password</>}
                        </button>
                    </div>
                </form>
            </div>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default ChangePasswordModal;
