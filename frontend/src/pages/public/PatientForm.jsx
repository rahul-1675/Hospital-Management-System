import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import hospitalVideo from '../../utils/hospital.mp4';

const PatientForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialDoctor = location.state?.doctor || null;

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contact: '',
        symptoms: '',
        department: initialDoctor ? initialDoctor.department : '',
        doctor: initialDoctor ? initialDoctor.name : ''
    });

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // If arrived without selecting a doctor, that's fine, user can fill it in.
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate local storage submission
        console.log("Patient Registration:", formData);
        setSubmitted(true);
        setTimeout(() => {
            navigate('/patient'); // Go back to portal after success
        }, 3000);
    };

    return (
        <div className="booking-wrapper">
            {/* Background Video */}
            <video
                src={hospitalVideo}
                autoPlay
                loop
                muted
                playsInline
                className="booking-video-bg"
            />

            {/* Overlay */}
            <div className="booking-overlay"></div>

            {/* Content Container */}
            <div className="booking-content">
                {/* Form Card */}
                {submitted ? (
                    <div className="booking-card success">
                        <h2 style={{ color: '#059669' }}>Success!</h2>
                        <p style={{ color: '#065f46', fontSize: '1.1rem' }}>Your registration is confirmed.</p>
                        <p style={{ marginTop: '1rem', fontWeight: 600, color: '#047857' }}>Redirecting...</p>
                    </div>
                ) : (
                    <div className="booking-card">
                        <button
                            onClick={() => navigate('/patient')}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#64748b',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                padding: 0,
                                fontWeight: 500
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#0284c7'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                        >
                            <ArrowLeft size={16} />
                            Back to Portal
                        </button>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 className="text-xl font-bold text-brand-primary">Book Consultation</h2>
                            <p className="text-muted mt-2">Fill in your details to secure an appointment.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Age</label>
                                    <input
                                        required
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Age"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2">
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select
                                        required
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Phone"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department / Doctor</label>
                                <input
                                    type="text"
                                    value={`${formData.doctor ? formData.doctor + ' - ' : ''}${formData.department || 'General Checkup'}`}
                                    disabled
                                    className="form-input"
                                    style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Reason for Visit</label>
                                <textarea
                                    required
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    rows="3"
                                    className="form-textarea"
                                    placeholder="Briefly describe symptoms..."
                                ></textarea>
                            </div>

                            <Button type="submit" className="w-full mt-4" style={{ width: '100%' }}>
                                Confirm Booking
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientForm;
