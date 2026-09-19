import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Edit, Lock, Save, Camera, Check } from 'lucide-react';
import ChangePasswordModal from '../modals/ChangePasswordModal';

const DoctorProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [toast, setToast] = useState(null);

    // Initial state matching the user context or defaults
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Dr. Smith',
        department: 'Cardiology Department',
        id: user?.id || 'DOC-001',
        email: user?.email || 'dr.smith@hms.com',
        phone: '+1 (555) 123-4567',
        specialization: 'Cardiologist (MD)',
        experience: '12 Years'
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
        // Simulate API save
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

            {/* Background decorative elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, var(--doctor-secondary) 0%, transparent 100%)', zIndex: 0 }}></div>

            <div
                className="detail-card profile-card"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    zIndex: 1,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        {profileData.name.charAt(0)}
                    </div>
                    {isEditing ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                className="search-input"
                                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', width: '300px', margin: '0 auto', display: 'block' }}
                            />
                        </div>
                    ) : (
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{profileData.name}</h1>
                    )}

                    <p style={{ color: 'var(--doctor-text-muted)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{profileData.department}</p>
                    <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>ID: {profileData.id}</span>
                </div>

                {/* Body */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '0 1rem 1rem' }}>
                    {/* Personal Info */}
                    <div>
                        <h3 className="section-title" style={{ borderBottom: '1px solid var(--doctor-border)', paddingBottom: '0.5rem' }}>Personal Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email" name="email" value={profileData.email} onChange={handleInputChange}
                                        className="search-input" style={{ width: '100%' }}
                                    />
                                ) : (
                                    <p className="text-value" style={{ fontSize: '1.05rem' }}>{profileData.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel" name="phone" value={profileData.phone} onChange={handleInputChange}
                                        className="search-input" style={{ width: '100%' }}
                                    />
                                ) : (
                                    <p className="text-value" style={{ fontSize: '1.05rem' }}>{profileData.phone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div>
                        <h3 className="section-title" style={{ borderBottom: '1px solid var(--doctor-border)', paddingBottom: '0.5rem' }}>Professional Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Specialization</label>
                                {isEditing ? (
                                    <input
                                        type="text" name="specialization" value={profileData.specialization} onChange={handleInputChange}
                                        className="search-input" style={{ width: '100%' }}
                                    />
                                ) : (
                                    <p className="text-value" style={{ fontSize: '1.05rem' }}>{profileData.specialization}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Years of Experience</label>
                                {isEditing ? (
                                    <input
                                        type="text" name="experience" value={profileData.experience} onChange={handleInputChange}
                                        className="search-input" style={{ width: '100%' }}
                                    />
                                ) : (
                                    <p className="text-value" style={{ fontSize: '1.05rem' }}>{profileData.experience}</p>
                                )}
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

export default DoctorProfile;
