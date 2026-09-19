import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Mail, Phone, MapPin, BadgeCheck, Edit, Save, Lock, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../modals/ChangePasswordModal';

const ReceptionProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [toast, setToast] = useState(null);

    const [profileData, setProfileData] = useState({
        name: user?.name || 'Reception Staff',
        role: 'Senior Receptionist',
        email: user?.email || 'reception@hospital.com',
        phone: '+1 (555) 012-3456',
        id: user?.id || 'REC-1001',
        shift: 'Morning Shift',
        shiftTime: '08:00 AM - 04:00 PM',
        department: 'Front Desk & Admissions'
    });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        showToast('Profile updated successfully');
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const handlePasswordChangeResult = (success) => {
        setShowPasswordModal(false);
        if (success) {
            showToast('Password changed successfully');
        }
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
                className="detail-card profile-card"
                style={{
                    maxWidth: '800px',
                    width: '100%',
                    padding: '0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    animation: 'floatUp 0.5s ease-out'
                }}
            >
                {/* Header Background */}
                <div style={{ height: '120px', background: 'linear-gradient(to right, var(--reception-primary), var(--reception-primary-hover))', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}></div>

                <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'white',
                        padding: '4px',
                        position: 'absolute',
                        top: '-60px',
                        left: '2rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: 'var(--reception-text-muted)'
                        }}>
                            {profileData.name.charAt(0)}
                        </div>
                    </div>

                    <div style={{ paddingTop: '1rem', paddingLeft: '140px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: '60px' }}>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', width: '300px' }}
                                />
                            ) : (
                                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{profileData.name}</h1>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--reception-text-muted)' }}>
                                <BadgeCheck size={18} color="var(--reception-primary)" />
                                <span style={{ fontWeight: 500 }}>{profileData.role}</span>
                            </div>
                        </div>
                        <span className="status-badge status-checked-in" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Active Status</span>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3 className="section-title" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '0.5rem' }}>Contact Information</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px', color: 'var(--reception-text-muted)' }}>
                                        <Mail size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="text-label">Email Address</p>
                                        {isEditing ? (
                                            <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.25rem 0.5rem' }} />
                                        ) : (
                                            <p className="text-value">{profileData.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px', color: 'var(--reception-text-muted)' }}>
                                        <Phone size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="text-label">Phone Number</p>
                                        {isEditing ? (
                                            <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.25rem 0.5rem' }} />
                                        ) : (
                                            <p className="text-value">{profileData.phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px', color: 'var(--reception-text-muted)' }}>
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-label">Employee ID</p>
                                        <p className="text-value">{profileData.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="section-title" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '0.5rem' }}>Shift Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <div style={{ padding: '1rem', border: '1px solid var(--reception-border)', borderRadius: '8px' }}>
                                    <p className="text-label">Current Shift</p>
                                    <p className="text-lg" style={{ color: 'var(--reception-primary)' }}>{profileData.shift}</p>
                                    <p className="text-value" style={{ marginTop: '0.25rem' }}>{profileData.shiftTime}</p>
                                </div>
                                <div style={{ padding: '1rem', border: '1px solid var(--reception-border)', borderRadius: '8px' }}>
                                    <p className="text-label">Department</p>
                                    <p className="text-value">{profileData.department}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--reception-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleLogout}
                                className="action-btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}
                            >
                                <LogOut size={16} /> Logout
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="action-btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--reception-text-muted)' }}
                            >
                                <Lock size={16} /> Change Password
                            </button>
                        </div>

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
            </div>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={handlePasswordChangeResult}
            />

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

export default ReceptionProfile;
