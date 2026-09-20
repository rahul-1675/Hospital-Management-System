import React, { useState } from 'react';
import { UserPlus, Save, X, CheckCircle, Loader2, Clock, Check, Trash2, ShieldCheck, Search, Users } from 'lucide-react';
import { useReception } from '../../../context/ReceptionContext';

const ReceptionRegistration = () => {
    const { doctorsList, registerNewPatient, pendingPatients, approvePatient, rejectPatient } = useReception();
    const [activeSubTab, setActiveSubTab] = useState('walkin'); // 'walkin' or 'online-approvals'
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        symptoms: '',
        department: 'Cardiology',
        doctorId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApprovePatient = async (patient) => {
        const pId = patient._id || patient.id || patient.staffId;
        setActionLoadingId(pId);
        await approvePatient(pId);
        setActionLoadingId(null);
    };

    const handleRejectPatient = async (patient) => {
        const pId = patient._id || patient.id || patient.staffId;
        if (!window.confirm(`Reject online registration for ${patient.name}?`)) return;
        setActionLoadingId(pId);
        await rejectPatient(pId);
        setActionLoadingId(null);
    };

    const filteredPending = (pendingPatients || []).filter(p => {
        const q = searchTerm.toLowerCase();
        return (p.name || '').toLowerCase().includes(q) ||
            (p.email || '').toLowerCase().includes(q) ||
            (p.phone || '').includes(q);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const selectedDoc = doctorsList.find(d => (d._id === formData.doctorId || d.id === formData.doctorId));

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            patientName: `${formData.firstName} ${formData.lastName}`.trim(),
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            symptoms: formData.symptoms,
            department: selectedDoc ? selectedDoc.department : formData.department,
            doctorId: formData.doctorId || (doctorsList[0] ? (doctorsList[0]._id || doctorsList[0].id) : null),
            doctorName: selectedDoc ? selectedDoc.name : (doctorsList[0] ? doctorsList[0].name : 'Attending Physician')
        };

        const result = await registerNewPatient(payload);
        setLoading(false);

        if (result && result.success) {
            setSubmitted(true);
            setFormData({
                firstName: '',
                lastName: '',
                age: '',
                gender: 'Male',
                phone: '',
                email: '',
                address: '',
                symptoms: '',
                department: 'Cardiology',
                doctorId: ''
            });
            setTimeout(() => setSubmitted(false), 4000);
        } else {
            setError(result?.message || 'Failed to complete registration.');
        }
    };

    // Filter doctors by selected department if needed
    const filteredDoctors = formData.department
        ? doctorsList.filter(d => !d.department || d.department.toLowerCase().includes(formData.department.toLowerCase()))
        : doctorsList;

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Tab selector */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '800px', width: '100%' }}>
                <button
                    onClick={() => setActiveSubTab('walkin')}
                    className="action-btn"
                    style={{
                        background: activeSubTab === 'walkin' ? '#0284c7' : '#ffffff',
                        color: activeSubTab === 'walkin' ? '#ffffff' : '#334155',
                        border: '1px solid',
                        borderColor: activeSubTab === 'walkin' ? '#0284c7' : '#e2e8f0',
                        fontWeight: 700,
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <UserPlus size={18} />
                    <span>Walk-in Patient Intake</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('online-approvals')}
                    className="action-btn"
                    style={{
                        background: activeSubTab === 'online-approvals' ? '#0284c7' : '#ffffff',
                        color: activeSubTab === 'online-approvals' ? '#ffffff' : '#334155',
                        border: '1px solid',
                        borderColor: activeSubTab === 'online-approvals' ? '#0284c7' : '#e2e8f0',
                        fontWeight: 700,
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Clock size={18} color={activeSubTab === 'online-approvals' ? '#ffffff' : '#d97706'} />
                    <span>Online Patient Approvals</span>
                    {pendingPatients.length > 0 && (
                        <span style={{
                            background: activeSubTab === 'online-approvals' ? '#ffffff' : '#d97706',
                            color: activeSubTab === 'online-approvals' ? '#0284c7' : '#ffffff',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 800
                        }}>
                            {pendingPatients.length}
                        </span>
                    )}
                </button>
            </div>

            {activeSubTab === 'online-approvals' ? (
                <div className="detail-card" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem' }}>
                    <div className="detail-header" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                            <Clock size={28} color="#d97706" />
                            Online Patient Account Approvals
                        </h1>
                        <p className="text-label" style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                            Verify patient registrations created online and activate their accounts for appointment bookings.
                        </p>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by patient name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    {filteredPending.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
                            <Users size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#64748b' }}>No Pending Patient Registrations</h3>
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.88rem' }}>All online patient accounts have been processed.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredPending.map(patient => {
                                const id = patient._id || patient.id || patient.staffId;
                                const isActionLoading = actionLoadingId === id;

                                return (
                                    <div
                                        key={id}
                                        style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '14px',
                                            padding: '1.25rem 1.5rem',
                                            background: '#ffffff',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.25rem', fontWeight: 800
                                            }}>
                                                {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                                    {patient.name}
                                                </h4>
                                                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                                                    <span>{patient.email}</span>
                                                    {patient.phone && <span>• {patient.phone}</span>}
                                                    <span style={{ color: '#d97706', fontWeight: 700 }}>• Pending Approval</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                                            <button
                                                disabled={isActionLoading}
                                                onClick={() => handleApprovePatient(patient)}
                                                className="action-btn"
                                                style={{
                                                    background: '#10b981',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: '0.5rem 0.9rem',
                                                    borderRadius: '8px',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem'
                                                }}
                                            >
                                                <Check size={16} />
                                                <span>Approve & Activate</span>
                                            </button>
                                            <button
                                                disabled={isActionLoading}
                                                onClick={() => handleRejectPatient(patient)}
                                                className="action-btn btn-outline"
                                                style={{
                                                    color: '#ef4444',
                                                    borderColor: '#fca5a5',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="detail-card" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem' }}>
                    <div className="detail-header" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                            <UserPlus size={28} color="var(--reception-primary)" />
                            New Patient Intake & Registration
                        </h1>
                        <p className="text-label" style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                            Register walk-in patients and instantly issue an OPD queue token.
                        </p>
                    </div>

                    {error && (
                        <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#b91c1c', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    {submitted ? (
                        <div style={{ padding: '3rem', background: '#f0fdf4', border: '1px solid var(--reception-success)', borderRadius: '12px', textAlign: 'center', color: 'var(--reception-text-main)', marginBottom: '2rem' }}>
                            <CheckCircle size={48} color="var(--reception-success)" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ color: 'var(--reception-success)', marginBottom: '0.5rem', fontSize: '1.35rem', fontWeight: 700 }}>Registration Successful!</h3>
                            <p style={{ margin: 0, color: '#475569' }}>The patient has been saved to the database and assigned an OPD queue token.</p>
                            <button
                                className="action-btn btn-primary"
                                style={{ marginTop: '1.5rem' }}
                                onClick={() => setSubmitted(false)}
                            >
                                Register Another Patient
                            </button>
                        </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3 className="section-title">Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">First Name *</label>
                                <input type="text" name="firstName" className="form-input" required value={formData.firstName} onChange={handleChange} placeholder="e.g. John" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name *</label>
                                <input type="text" name="lastName" className="form-input" required value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age *</label>
                                <input type="number" name="age" className="form-input" required value={formData.age} onChange={handleChange} placeholder="e.g. 30" min="1" max="120" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender *</label>
                                <select name="gender" className="form-select" required value={formData.gender} onChange={handleChange}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} placeholder="e.g. +1 555-0100" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email (Optional)</label>
                                <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="e.g. john@example.com" />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">Residential Address (Optional)</label>
                            <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} placeholder="Full residential address" />
                        </div>

                        <h3 className="section-title" style={{ marginTop: '2rem' }}>Consultation & Specialty Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Clinical Department *</label>
                                <select name="department" className="form-select" required value={formData.department} onChange={handleChange}>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="General Medicine">General Medicine</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Attending Specialist (Optional)</label>
                                <select name="doctorId" className="form-select" value={formData.doctorId} onChange={handleChange}>
                                    <option value="">Any Available Doctor</option>
                                    {doctorsList.map(doc => (
                                        <option key={doc._id || doc.id} value={doc._id || doc.id}>
                                            {doc.name} ({doc.department || 'Specialist'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '3rem' }}>
                            <label className="form-label">Presenting Symptoms / Reason for Visit *</label>
                            <textarea name="symptoms" className="form-input" rows={3} required value={formData.symptoms} onChange={handleChange} placeholder="Brief clinical summary or reason for intake..." style={{ resize: 'vertical' }}></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                type="button"
                                className="action-btn btn-outline"
                                onClick={() => setFormData({
                                    firstName: '',
                                    lastName: '',
                                    age: '',
                                    gender: 'Male',
                                    phone: '',
                                    email: '',
                                    address: '',
                                    symptoms: '',
                                    department: 'Cardiology',
                                    doctorId: ''
                                })}
                            >
                                <X size={18} /> Clear Form
                            </button>
                            <button
                                type="submit"
                                className="action-btn btn-primary"
                                disabled={loading}
                                style={{ paddingLeft: '2rem', paddingRight: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Register & Generate Token
                            </button>
                        </div>
                    </form>
                )}
            </div>
            )}
        </div>
    );
};

export default ReceptionRegistration;

