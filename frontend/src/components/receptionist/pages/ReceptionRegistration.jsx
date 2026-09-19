import React, { useState } from 'react';
import { UserPlus, Save, X } from 'lucide-react';

const ReceptionRegistration = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        symptoms: '',
        department: '',
        doctor: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log('Registering patient:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        // Reset form logic would go here
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div className="detail-card" style={{ maxWidth: '800px', width: '100%' }}>
                <div className="detail-header" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <UserPlus size={32} color="var(--reception-primary)" />
                        New Patient Registration
                    </h1>
                    <p className="text-label" style={{ marginTop: '0.5rem' }}>Enter patient details for quick intake. All fields marked * are required.</p>
                </div>

                {submitted ? (
                    <div style={{ padding: '2rem', background: '#f0fdf4', border: '1px solid var(--reception-success)', borderRadius: '8px', textAlign: 'center', color: 'var(--reception-text-main)', marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--reception-success)', marginBottom: '0.5rem' }}>Registration Successful!</h3>
                        <p>Patient has been added to the system and queue.</p>
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
                                <input type="number" name="age" className="form-input" required value={formData.age} onChange={handleChange} placeholder="e.g. 30" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender *</label>
                                <select name="gender" className="form-select" required value={formData.gender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} placeholder="e.g. +1 555-0000" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email (Optional)</label>
                                <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="e.g. john@example.com" />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">Address (Optional)</label>
                            <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} placeholder="Full residential address" />
                        </div>

                        <h3 className="section-title" style={{ marginTop: '2rem' }}>Visit Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <select name="department" className="form-select" required value={formData.department} onChange={handleChange}>
                                    <option value="">Select Department</option>
                                    <option value="General">General Medicine</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Preferred Doctor (Optional)</label>
                                <select name="doctor" className="form-select" value={formData.doctor} onChange={handleChange}>
                                    <option value="">Any Available</option>
                                    <option value="Dr. Smith">Dr. Smith</option>
                                    <option value="Dr. Jones">Dr. Jones</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '3rem' }}>
                            <label className="form-label">Symptoms / Reason for Visit *</label>
                            <textarea name="symptoms" className="form-input" rows={3} required value={formData.symptoms} onChange={handleChange} placeholder="Brief description of symptoms..." style={{ resize: 'vertical' }}></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="action-btn btn-outline" onClick={() => setFormData({})}>
                                <X size={20} /> Clear Form
                            </button>
                            <button type="submit" className="action-btn btn-primary" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                                <Save size={20} /> Register Patient
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReceptionRegistration;
