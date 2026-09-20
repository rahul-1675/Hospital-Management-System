import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Edit2, Lock, Save, Check, Star, MessageSquare, ShieldCheck, Mail, Phone, Stethoscope, Award, MapPin, DollarSign, Loader2 } from 'lucide-react';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import { reviewService } from '../../../services/review.service';
import { doctorService } from '../../../services/doctor.service';

const DoctorProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ totalReviews: 0, averageRating: 5.0 });
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial state matching the user context or defaults
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Dr. Sarah Smith',
        department: user?.department || 'Cardiology',
        id: user?.staffId || user?.id || 'DOC001',
        email: user?.email || 'dr.smith@hms.com',
        phone: user?.phone || '+1 (555) 123-4567',
        specialization: 'Cardiologist (MD)',
        experience: '12 Years',
        roomNumber: 'Room 104',
        consultationFee: 65
    });

    useEffect(() => {
        const fetchDocProfile = async () => {
            const data = await doctorService.getDoctorProfile(user?.email);
            if (data) {
                setProfileData(prev => ({
                    ...prev,
                    ...data,
                    name: data.name || user?.name || prev.name,
                    email: data.email || user?.email || prev.email,
                    phone: data.phone || user?.phone || prev.phone,
                    department: data.department || user?.department || prev.department
                }));
            }
        };
        fetchDocProfile();
    }, [user]);

    useEffect(() => {
        const loadDocReviews = async () => {
            const docId = user?.doctorId || user?.id || user?._id || 'doc-1';
            setLoadingReviews(true);
            try {
                const res = await reviewService.getDoctorReviews(docId);
                const list = Array.isArray(res) ? res : (res?.data || []);
                setReviews(list);
                if (res?.stats) {
                    setStats(res.stats);
                } else if (list.length > 0) {
                    const sum = list.reduce((acc, r) => acc + (r.rating || 0), 0);
                    setStats({ totalReviews: list.length, averageRating: Number((sum / list.length).toFixed(1)) });
                }
            } catch (err) {
                console.warn('Could not load doctor reviews:', err);
            } finally {
                setLoadingReviews(false);
            }
        };
        loadDocReviews();
    }, [user]);

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

    const handleSave = async () => {
        setSaving(true);
        try {
            await doctorService.updateDoctorProfile({
                ...profileData,
                email: user?.email || profileData.email
            });
            setIsEditing(false);
            showToast('Clinical profile updated successfully');
        } catch (err) {
            showToast('Failed to save profile updates');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChangeResult = (success) => {
        setShowPasswordModal(false);
        if (success) {
            showToast('Password changed successfully');
        }
    };

    return (
        <div style={{ padding: '1.75rem', height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '10px',
                    zIndex: 9999,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <Check size={18} color="#10b981" />
                    {toast}
                </div>
            )}

            <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Main Profile Header Card */}
                <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '18px',
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 800,
                                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                            }}>
                                {profileData.name.replace('Dr. ', '').charAt(0) || 'D'}
                            </div>
                            <div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        style={{ fontSize: '1.25rem', fontWeight: 800, padding: '0.4rem 0.6rem', width: '260px' }}
                                    />
                                ) : (
                                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                                        {profileData.name}
                                    </h2>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.35rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, background: '#e0f2fe', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                                        {profileData.department}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                                        ID: {profileData.id}
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                        <ShieldCheck size={12} /> Active Physician
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {isEditing ? (
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="action-btn"
                                    style={{
                                        background: '#0284c7',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '0.55rem 1.1rem',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                                    Save Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="action-btn btn-outline"
                                    style={{
                                        padding: '0.55rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        borderColor: '#cbd5e1'
                                    }}
                                >
                                    <Edit2 size={15} /> Edit Info
                                </button>
                            )}
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="action-btn btn-outline"
                                style={{
                                    padding: '0.55rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    borderColor: '#cbd5e1'
                                }}
                            >
                                <Lock size={15} /> Password
                            </button>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                        {/* Email */}
                        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                                <Mail size={14} /> Email Address
                            </div>
                            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                                {profileData.email}
                            </span>
                        </div>

                        {/* Phone */}
                        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                                <Phone size={14} /> Contact Phone
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.88rem', width: '100%' }}
                                />
                            ) : (
                                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                                    {profileData.phone}
                                </span>
                            )}
                        </div>

                        {/* Specialization */}
                        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                                <Stethoscope size={14} /> Specialization & Degrees
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="specialization"
                                    value={profileData.specialization}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.88rem', width: '100%' }}
                                />
                            ) : (
                                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                                    {profileData.specialization}
                                </span>
                            )}
                        </div>

                        {/* Experience */}
                        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                                <Award size={14} /> Clinical Experience
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="experience"
                                    value={profileData.experience}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.88rem', width: '100%' }}
                                />
                            ) : (
                                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                                    {profileData.experience}
                                </span>
                            )}
                        </div>

                        {/* Clinic Room */}
                        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                                <MapPin size={14} /> Assigned Consultation Room
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={profileData.roomNumber}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.88rem', width: '100%' }}
                                />
                            ) : (
                                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                                    {profileData.roomNumber}
                                </span>
                            )}
                        </div>

                        {/* Consultation Fee */}
                        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                                <DollarSign size={14} /> Consultation Fee
                            </div>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={profileData.consultationFee}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.88rem', width: '100%' }}
                                />
                            ) : (
                                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                                    ${profileData.consultationFee} / session
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ratings and Reviews Card */}
                <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                Verified Patient Reviews & Rating
                            </h3>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                                Aggregate feedback from completed patient consultations
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', padding: '0.4rem 0.8rem', borderRadius: '10px' }}>
                            <Star size={16} fill="#f59e0b" color="#f59e0b" />
                            <span style={{ fontWeight: 800, color: '#92400e', fontSize: '1rem' }}>
                                {stats.averageRating || '5.0'}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600 }}>
                                ({stats.totalReviews} reviews)
                            </span>
                        </div>
                    </div>

                    {loadingReviews ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                            <Loader2 size={24} className="spin" style={{ margin: '0 auto' }} />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '0.88rem' }}>
                            <MessageSquare size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                            <p style={{ margin: 0 }}>No verified patient reviews recorded yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                            {reviews.map((rev, idx) => (
                                <div key={rev._id || rev.id || idx} style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>{rev.patientName || 'Verified Patient'}</span>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < (rev.rating || 5) ? '#f59e0b' : '#e2e8f0'} color={i < (rev.rating || 5) ? '#f59e0b' : '#cbd5e1'} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                                        {rev.comment || 'Excellent physician care and clear treatment plan.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showPasswordModal && (
                <ChangePasswordModal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={() => handlePasswordChangeResult(true)}
                />
            )}
        </div>
    );
};

export default DoctorProfile;
