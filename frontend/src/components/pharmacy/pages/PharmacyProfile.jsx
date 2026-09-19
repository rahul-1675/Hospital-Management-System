import React, { useState } from 'react';
import { User, Mail, Phone, Clock, Lock, Save, Camera } from 'lucide-react';
import { usePharmacy } from '../../../context/PharmacyContext';

const PharmacyProfile = () => {
    const { pharmacistProfile, updateProfile } = usePharmacy();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(pharmacistProfile);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.9)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--pharmacy-shadow)', border: '1px solid var(--pharmacy-border)' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Pharmacist Profile</h1>
                <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>Manage your personal details and account settings</p>
            </header>

            <div style={{ maxWidth: '800px', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
                {/* ID Card Column */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--pharmacy-border)', textAlign: 'center', height: 'fit-content' }}>
                    <div style={{ width: '120px', height: '120px', background: '#e0f2fe', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#0284c7', position: 'relative' }}>
                        {pharmacistProfile.name.charAt(0)}
                        <button style={{ position: 'absolute', bottom: 0, right: 0, background: '#0284c7', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera size={16} />
                        </button>
                    </div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{pharmacistProfile.name}</h2>
                    <p className="text-label" style={{ marginBottom: '1.5rem' }}>ID: {pharmacistProfile.id}</p>

                    <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Clock size={16} className="text-label" />
                            <span style={{ fontSize: '0.9rem' }}>{pharmacistProfile.shift}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#166534' }}>Active Status</span>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--pharmacy-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 className="text-lg">Personal Information</h3>
                        {!isEditing ? (
                            <button className="action-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="action-btn" onClick={() => { setFormData(pharmacistProfile); setIsEditing(false); }}>Cancel</button>
                                <button className="action-btn btn-primary" onClick={handleSave}><Save size={18} /> Save</button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    disabled={!isEditing}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)', background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Employee ID</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    value={formData.id}
                                    disabled
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)', background: '#f1f5f9', cursor: 'not-allowed' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled={!isEditing}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)', background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    disabled={!isEditing}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--pharmacy-border)', background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--pharmacy-border)' }}>
                        <h3 className="text-lg" style={{ marginBottom: '1.5rem' }}>Security</h3>
                        <button className="action-btn" style={{ border: '1px solid var(--pharmacy-border)', background: 'white' }}>Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyProfile;
