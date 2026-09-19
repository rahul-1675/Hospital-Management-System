import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Calendar, User, Phone, Stethoscope, Clock, ShieldCheck, Ticket, Download } from 'lucide-react';
import hospitalVideo from '../../utils/hospital.mp4';
import { receptionService } from '../../services/reception.service';

const PatientForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDoctor = location.state?.doctor || null;

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        symptoms: '',
        preferredDate: new Date().toISOString().split('T')[0],
        preferredSlot: '10:00 AM',
        department: selectedDoctor ? selectedDoctor.department : 'General Medicine',
        doctorName: selectedDoctor ? selectedDoctor.name : 'Dr. Robert King'
    });

    const [submitted, setSubmitted] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const token = `OPD-${Math.floor(100 + Math.random() * 900)}`;
        const booking = {
            ...formData,
            id: Date.now(),
            token,
            status: 'scheduled',
            patientName: formData.name,
            time: formData.preferredSlot,
            date: formData.preferredDate
        };

        try {
            await receptionService.createAppointment(booking);
        } catch (err) {
            console.warn('Booking submitted locally:', err);
        }

        setBookingDetails(booking);
        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            {/* Background Video */}
            <video
                src={hospitalVideo}
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0
                }}
            />

            {/* Dark Gradient Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(2, 132, 199, 0.75) 100%)',
                zIndex: 1
            }} />

            {/* Content Container */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '640px' }}>
                {submitted && bookingDetails ? (
                    /* DIGITAL OPD TOKEN CONFIRMATION PASS */
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: '#ecfdf5',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            border: '2px solid #a7f3d0'
                        }}>
                            <CheckCircle2 size={36} />
                        </div>

                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.85rem',
                            borderRadius: '9999px',
                            background: '#e0f2fe',
                            color: '#0284c7',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            marginBottom: '0.5rem'
                        }}>
                            CONFIRMED APPOINTMENT
                        </span>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>
                            Registration Complete
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            Please present your digital token at the reception desk upon arrival.
                        </p>

                        {/* Token Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: '#ffffff',
                            borderRadius: '16px',
                            padding: '1.75rem',
                            textAlign: 'left',
                            marginBottom: '2rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Token Number</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8' }}>{bookingDetails.token}</div>
                                </div>
                                <Ticket size={32} color="#38bdf8" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
                                <div>
                                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>Patient Name</span>
                                    <strong style={{ color: '#ffffff' }}>{bookingDetails.name}</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>Consulting Doctor</span>
                                    <strong style={{ color: '#38bdf8' }}>{bookingDetails.doctorName}</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>Department</span>
                                    <span style={{ color: '#ffffff' }}>{bookingDetails.department}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>Slot Time</span>
                                    <span style={{ color: '#34d399', fontWeight: '600' }}>{bookingDetails.preferredDate} ({bookingDetails.preferredSlot})</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => window.print()}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: '10px',
                                    background: '#f1f5f9',
                                    color: '#334155',
                                    fontWeight: '600',
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer'
                                }}
                            >
                                Print Token
                            </button>
                            <button
                                onClick={() => navigate('/patient')}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Back to Directory
                            </button>
                        </div>
                    </div>
                ) : (
                    /* BOOKING FORM */
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.96)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.8)'
                    }}>
                        <button
                            onClick={() => navigate('/patient')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#64748b',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                marginBottom: '1.25rem',
                                padding: 0,
                                background: 'transparent'
                            }}
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Specialists</span>
                        </button>

                        <div style={{ marginBottom: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.4rem' }}>
                                Book OPD Consultation
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                                Fast-track registration with instant confirmation token.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                    Patient Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Alex Morgan"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: '1.5px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                        Age *
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        min="1"
                                        max="120"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="e.g. 34"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.95rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.95rem',
                                            background: '#ffffff',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                        Phone Contact *
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        required
                                        value={formData.contact}
                                        onChange={handleChange}
                                        placeholder="+1 555-0199"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.95rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                        Preferred Slot
                                    </label>
                                    <select
                                        name="preferredSlot"
                                        value={formData.preferredSlot}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.95rem',
                                            background: '#ffffff',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="09:00 AM">09:00 AM - Morning</option>
                                        <option value="10:00 AM">10:00 AM - Morning</option>
                                        <option value="11:30 AM">11:30 AM - Morning</option>
                                        <option value="02:00 PM">02:00 PM - Afternoon</option>
                                        <option value="04:30 PM">04:30 PM - Evening</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                        Doctor Assigned
                                    </label>
                                    <input
                                        type="text"
                                        name="doctorName"
                                        value={formData.doctorName}
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1.5px solid #e2e8f0',
                                            background: '#f8fafc',
                                            fontWeight: '600',
                                            color: '#0284c7',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1.5px solid #e2e8f0',
                                            background: '#f8fafc',
                                            color: '#475569',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                                    Chief Complaints & Symptoms
                                </label>
                                <textarea
                                    name="symptoms"
                                    rows={3}
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    placeholder="Briefly describe what you're experiencing (e.g. fever, headache for 2 days)..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: '1.5px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    color: '#ffffff',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    border: 'none',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                                    transition: 'all 0.2s',
                                    marginTop: '0.5rem'
                                }}
                            >
                                {submitting ? 'Generating OPD Pass...' : 'Confirm Consultation Booking'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientForm;
