import React, { useState } from 'react';
import { useStaff } from '../../../context/StaffContext';
import { Edit, Lock, Save, Check, User, Phone, Briefcase, MapPin, Shield, Heart } from 'lucide-react';
import ChangePasswordModal from '../modals/ChangePasswordModal';

const StaffProfile = () => {
    const { staff, updateProfile } = useStaff();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [toast, setToast] = useState(null);

    // Local state for editing to avoid context flicker until save
    const [formData, setFormData] = useState({
        name: staff.name,
        phone: staff.phone,
        email: staff.email,
        emergencyContact: 'John Doe (+1 555-0000)', // Default placeholder if not in context
        shiftPreference: 'Morning'
    });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
        showToast('Profile updated successfully');
    };

    const handlePasswordChangeResult = (success) => {
        setShowPasswordModal(false);
        if (success) {
            showToast('Password changed successfully');
        }
    };

    return (
        <div style={{ padding: '2rem', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Background decorative elements matching Doctor Profile */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, var(--doctor-secondary) 0%, transparent 100%)', zIndex: 0 }}></div>

            <div
                className="detail-card profile-card"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    zIndex: 1,
                    boxShadow: 'var(--doctor-shadow-lg)',
                    animation: 'floatUp 0.5s ease-out'
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
                    <div style={{
                        width: '120px', height: '120px', margin: '0 auto 1.5rem',
                        borderRadius: '50%', background: 'var(--doctor-primary)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem', fontWeight: 'bold', border: '4px solid white',
                        boxShadow: 'var(--doctor-shadow)'
                    }}>
                        {staff.name.charAt(0)}
                    </div>
                    {isEditing ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="search-input"
                                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', width: '300px', margin: '0 auto', display: 'block' }}
                            />
                        </div>
                    ) : (
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--doctor-text-main)' }}>{staff.name}</h1>
                    )}

                    <p style={{ color: 'var(--doctor-text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{staff.role} • {staff.department}</p>
                    <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>ID: {staff.id}</span>
                </div>

                {/* Body */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '0 1rem 1rem' }}>
                    {/* Contact Info */}
                    <div>
                        <h3 className="section-title" style={{ borderBottom: '1px solid var(--doctor-border)', paddingBottom: '0.5rem' }}>Contact Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="search-input" style={{ width: '100%' }}
                                    />
                                ) : (
                                    <p className="text-value" style={{ fontSize: '1.05rem' }}>{staff.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                        className="search-input" style={{ width: '100%' }}
                                    />
                                ) : (
                                    <p className="text-value" style={{ fontSize: '1.05rem' }}>{staff.phone}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Emergency Contact</label>
                                {isEditing ? (
                                    <input
                                        type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange}
                                        className="search-input" style={{ width: '100%' }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Heart size={16} color="#ef4444" />
                                        <p className="text-value" style={{ fontSize: '1.05rem' }}>{formData.emergencyContact}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Work Details */}
                    <div>
                        <h3 className="section-title" style={{ borderBottom: '1px solid var(--doctor-border)', paddingBottom: '0.5rem' }}>Work Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Department</label>
                                <p className="text-value" style={{ fontSize: '1.05rem', color: 'var(--doctor-text-muted)' }}>{staff.department}</p>
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Shift Preference</label>
                                {isEditing ? (
                                    <select
                                        name="shiftPreference"
                                        value={formData.shiftPreference}
                                        onChange={handleInputChange}
                                        className="search-input"
                                        style={{ width: '100%' }}
                                    >
                                        <option>Morning</option>
                                        <option>Afternoon</option>
                                        <option>Night</option>
                                    </select>
                                ) : (
                                    <p className="text-value" style={{ fontSize: '1.05rem' }}>{formData.shiftPreference}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Current Status</label>
                                <span className={`status-badge ${staff.shift.status === 'ON' ? 'status-checked-in' : 'status-pending'}`}>
                                    {staff.shift.status === 'ON' ? 'Active Duty' : 'Off Duty'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--doctor-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="action-btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--doctor-text-muted)' }}
                    >
                        <Lock size={16} /> Change Password
                    </button>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                className="action-btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="action-btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Edit size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ChangePasswordModal isOpen={showPasswordModal} onClose={handlePasswordChangeResult} />

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    backgroundColor: '#10b981', color: 'white',
                    padding: '1rem 1.5rem', borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    zIndex: 2000, animation: 'slideUp 0.3s ease-out'
                }}>
                    <Check size={20} />
                    <span style={{ fontWeight: '600' }}>{toast}</span>
                </div>
            )}

            <style>
                {`
                    @keyframes floatUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .profile-card {
                        transition: transform 0.3s ease;
                    }
                    @media (min-width: 1024px) {
                        .profile-card:hover {
                            transform: translateY(-5px);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default StaffProfile;
