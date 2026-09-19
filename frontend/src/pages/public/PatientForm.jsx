import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    ArrowLeft,
    CheckCircle2,
    Calendar,
    User,
    Phone,
    Stethoscope,
    Clock,
    ShieldCheck,
    Ticket,
    Download,
    Building2,
    AlertCircle,
    MapPin,
    DollarSign,
    Sparkles,
    Check
} from 'lucide-react';
import hospitalVideo from '../../utils/hospital.mp4';
import { doctorService } from '../../services/doctor.service';
import { appointmentService } from '../../services/appointment.service';
import { InlineLoader } from '../../components/common/Loader';

const PatientForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Doctor & Hospital data passed from DepthCarousel
    const selectedDoctor = location.state?.doctor || location.state?.bookingPayload || null;
    const doctorId = selectedDoctor?._id || selectedDoctor?.id || selectedDoctor?.doctorId || '';
    const hospitalId = selectedDoctor?.hospitalId || selectedDoctor?.hospital?._id || selectedDoctor?.hospital?.id || selectedDoctor?.hospital || '';

    // Form & Booking State
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [selectedSlot, setSelectedSlot] = useState('');
    
    // Live availability slots from backend
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState(null);

    // Patient Form Details (Pre-filled from auth state if logged in)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
        age: '',
        gender: 'Male',
        symptoms: '',
        notes: ''
    });

    // Submission states
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [confirmedAppointment, setConfirmedAppointment] = useState(null);

    // Fetch live slots whenever selectedDate or doctorId changes
    useEffect(() => {
        if (!doctorId) return;

        const fetchSlots = async () => {
            setLoadingSlots(true);
            setSlotsError(null);
            try {
                const res = await doctorService.getDoctorAvailability(doctorId, selectedDate);
                const slotsData = res?.slots || [];
                setAvailableSlots(slotsData);

                // Auto-select first available slot if current selectedSlot is invalid
                const firstAvail = slotsData.find(s => s.isAvailable);
                if (firstAvail) {
                    setSelectedSlot(firstAvail.slot || firstAvail.time12 || firstAvail.time24);
                } else {
                    setSelectedSlot('');
                }
            } catch (err) {
                console.error('Failed to load slots:', err);
                setSlotsError('Could not load slots for this date.');
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [doctorId, selectedDate]);

    // Handle patient input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Appointment Confirmation & Submission to MongoDB
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!selectedSlot) {
            setSubmitError('Please select an available time slot.');
            return;
        }

        setSubmitting(true);

        const appointmentPayload = {
            doctorId,
            hospitalId: hospitalId || '6aaea47fabaa906ff397da51', // fallback to primary hospital if empty
            specialtyId: selectedDoctor?.specialty?._id || selectedDoctor?.specialtyId,
            department: selectedDoctor?.department || selectedDoctor?.specialization || 'General Medicine',
            date: selectedDate,
            timeSlot: selectedSlot,
            patientName: formData.name,
            patientEmail: formData.email,
            patientPhone: formData.contact,
            patientAge: Number(formData.age) || 30,
            patientGender: formData.gender,
            symptoms: formData.symptoms,
            notes: formData.notes
        };

        try {
            const res = await appointmentService.createAppointment(appointmentPayload);
            const savedData = res?.data || res?.appointment || res;

            setConfirmedAppointment({
                ...savedData,
                appointmentNumber: savedData.appointmentNumber || `APT-${Date.now().toString().slice(-6)}`,
                queueToken: savedData.queueToken || `OPD-${Math.floor(100 + Math.random() * 900)}`,
                doctorName: selectedDoctor?.name || 'Dr. Specialist',
                hospitalName: selectedDoctor?.hospitalName || selectedDoctor?.hospital?.name || 'ProHealth Hospital',
                department: selectedDoctor?.department || selectedDoctor?.specialization || 'General Medicine',
                roomNumber: selectedDoctor?.roomNumber || 'Room 102',
                date: selectedDate,
                timeSlot: selectedSlot,
                fee: selectedDoctor?.fee || `$${selectedDoctor?.consultationFee || 50}`,
                patientName: formData.name
            });

            setSubmitted(true);
        } catch (err) {
            console.error('Failed to confirm appointment:', err);
            setSubmitError(err.response?.data?.message || err.message || 'Failed to book appointment. The slot might already be reserved.');
        } finally {
            setSubmitting(false);
        }
    };

    // Fallback if doctor is not selected
    if (!selectedDoctor) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0a0f1d',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    maxWidth: '480px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
                }}>
                    <Stethoscope size={52} color="#0284c7" style={{ margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>No Doctor Selected</h2>
                    <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                        Please select a specialist from the 3D Doctor Selection rail to book your consultation.
                    </p>
                    <button
                        onClick={() => navigate('/patient')}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '10px',
                            background: '#0284c7',
                            color: '#ffffff',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Browse Specialists
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
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
                background: 'linear-gradient(135deg, rgba(10, 15, 29, 0.92) 0%, rgba(2, 132, 199, 0.82) 100%)',
                zIndex: 1
            }} />

            {/* Main Booking Container */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '820px' }}>
                {submitted && confirmedAppointment ? (
                    /* DIGITAL OPD TOKEN CONFIRMATION PASS */
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.9)'
                    }}>
                        {/* Success Header */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: '#ecfdf5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: '#059669',
                                border: '2px solid #a7f3d0'
                            }}>
                                <CheckCircle2 size={36} />
                            </div>
                            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem' }}>
                                Appointment Confirmed!
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                                Your OPD digital registration token has been verified and saved to the hospital queue.
                            </p>
                        </div>

                        {/* Token Pass Card */}
                        <div style={{
                            background: '#f8fafc',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '18px',
                            padding: '1.75rem',
                            color: '#0f172a',
                            marginBottom: '2rem',
                            boxShadow: '0 8px 24px -6px rgba(15, 23, 42, 0.08)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0284c7', fontWeight: 700 }}>
                                        OPD Queue Token Pass
                                    </span>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                                        {confirmedAppointment.queueToken}
                                    </h3>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Appointment Ref:</span>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        {confirmedAppointment.appointmentNumber}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Consulting Doctor:</span>
                                    <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.15rem 0 0' }}>
                                        {confirmedAppointment.doctorName}
                                    </p>
                                    <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>{confirmedAppointment.department}</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Hospital & Room:</span>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', margin: '0.15rem 0 0' }}>
                                        {confirmedAppointment.hospitalName}
                                    </p>
                                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>{confirmedAppointment.roomNumber}</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Scheduled Time:</span>
                                    <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7', margin: '0.15rem 0 0' }}>
                                        {confirmedAppointment.date}
                                    </p>
                                    <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>{confirmedAppointment.timeSlot}</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Patient:</span>
                                    <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.15rem 0 0' }}>
                                        {confirmedAppointment.patientName}
                                    </p>
                                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>Fee: {confirmedAppointment.fee} (Paid)</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => window.print()}
                                style={{
                                    flex: 1,
                                    padding: '0.85rem',
                                    borderRadius: '12px',
                                    background: '#f1f5f9',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Download size={18} />
                                <span>Print / Download Pass</span>
                            </button>
                            <button
                                onClick={() => navigate('/patient')}
                                style={{
                                    flex: 1,
                                    padding: '0.85rem',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Back to Doctor Directory
                            </button>
                        </div>
                    </div>
                ) : (
                    /* APPOINTMENT BOOKING FORM */
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.9)'
                    }}>
                        {/* Back Navigation */}
                        <button
                            onClick={() => navigate('/patient')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#64748b',
                                fontSize: '0.88rem',
                                fontWeight: '700',
                                marginBottom: '1.25rem',
                                padding: 0,
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Doctor Selection</span>
                        </button>

                        {/* Booking Hierarchy Flow Indicators */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            flexWrap: 'wrap',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#0284c7',
                            marginBottom: '1.5rem',
                            padding: '0.6rem 1rem',
                            background: '#f0f9ff',
                            borderRadius: '12px',
                            border: '1px solid #bae6fd'
                        }}>
                            <span>Doctor</span>
                            <span>→</span>
                            <span>Hospital</span>
                            <span>→</span>
                            <span>Specialization</span>
                            <span>→</span>
                            <span>Available Dates</span>
                            <span>→</span>
                            <span>Available Slots</span>
                            <span>→</span>
                            <span style={{ color: '#0f172a' }}>Confirm Appointment</span>
                        </div>

                        {/* Selected Doctor Summary Card */}
                        <div style={{
                            background: '#f8fafc',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            marginBottom: '2rem',
                            display: 'flex',
                            gap: '1.25rem',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {selectedDoctor.image ? (
                                    <img
                                        src={selectedDoctor.image}
                                        alt={selectedDoctor.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <User size={32} color="#ffffff" />
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            {selectedDoctor.name}
                                        </h3>
                                        <p style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.88rem', margin: '0.1rem 0' }}>
                                            {selectedDoctor.specialization || selectedDoctor.department}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.65rem',
                                        borderRadius: '9999px',
                                        background: '#ecfdf5',
                                        color: '#059669',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        border: '1px solid #a7f3d0'
                                    }}>
                                        Fee: {selectedDoctor.fee || `$${selectedDoctor.consultationFee || 50}`}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Building2 size={14} color="#0284c7" />
                                        {selectedDoctor.hospitalName || 'ProHealth Hospital'}
                                    </span>
                                    <span>•</span>
                                    <span>{selectedDoctor.roomNumber || 'OPD Room 102'}</span>
                                    <span>•</span>
                                    <span>{selectedDoctor.experience || `${selectedDoctor.experienceYears || 10}+ Years Exp`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Error Notice */}
                        {submitError && (
                            <div style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#b91c1c',
                                padding: '0.85rem 1rem',
                                borderRadius: '10px',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <AlertCircle size={18} />
                                <span>{submitError}</span>
                            </div>
                        )}

                        {/* Appointment Booking Form */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                            {/* Step 1: Select Date & Available Time Slot */}
                            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                            Consultation Date *
                                        </label>
                                        <input
                                            type="date"
                                            min={todayStr}
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '10px',
                                                border: '1.5px solid #cbd5e1',
                                                fontSize: '0.95rem',
                                                background: '#ffffff',
                                                color: '#0f172a',
                                                fontWeight: 600,
                                                boxSizing: 'border-box'
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Availability Summary:</span>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7' }}>
                                            {loadingSlots ? 'Checking doctor schedule...' : `${availableSlots.filter(s => s.isAvailable).length} Slots Available on ${selectedDate}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Available Time Slots Grid */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                                        Select Time Slot *
                                    </label>
                                    {loadingSlots ? (
                                        <div style={{ padding: '1rem 0' }}>
                                            <InlineLoader size="24px" text="Fetching real-time slots..." />
                                        </div>
                                    ) : availableSlots.length === 0 ? (
                                        <p style={{ color: '#ef4444', fontSize: '0.88rem', margin: 0 }}>
                                            No slots available for this doctor on {selectedDate}. Please choose another date.
                                        </p>
                                    ) : (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                                            gap: '0.6rem'
                                        }}>
                                            {availableSlots.map((slotItem) => {
                                                const slotLabel = slotItem.slot || slotItem.time12 || slotItem.time24;
                                                const isAvailable = slotItem.isAvailable;
                                                const isSelected = selectedSlot === slotLabel;

                                                return (
                                                    <button
                                                        type="button"
                                                        key={slotLabel}
                                                        disabled={!isAvailable}
                                                        onClick={() => setSelectedSlot(slotLabel)}
                                                        style={{
                                                            padding: '0.6rem 0.4rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.82rem',
                                                            fontWeight: 700,
                                                            textAlign: 'center',
                                                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                            border: isSelected
                                                                ? '2px solid #0284c7'
                                                                : isAvailable
                                                                    ? '1px solid #cbd5e1'
                                                                    : '1px solid #e2e8f0',
                                                            background: isSelected
                                                                ? '#0284c7'
                                                                : isAvailable
                                                                    ? '#ffffff'
                                                                    : '#f1f5f9',
                                                            color: isSelected
                                                                ? '#ffffff'
                                                                : isAvailable
                                                                    ? '#0f172a'
                                                                    : '#94a3b8',
                                                            textDecoration: !isAvailable ? 'line-through' : 'none',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                    >
                                                        {slotLabel}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Patient Information */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
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

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="alex@example.com"
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
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
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
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Age *
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        min="1"
                                        max="120"
                                        required
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="e.g. 32"
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
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
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

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Chief Complaints & Symptoms
                                </label>
                                <textarea
                                    name="symptoms"
                                    rows={2}
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    placeholder="Briefly describe what you are experiencing (e.g. headache, chest discomfort)..."
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || !selectedSlot}
                                style={{
                                    width: '100%',
                                    padding: '0.95rem',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '1.05rem',
                                    border: 'none',
                                    cursor: (submitting || !selectedSlot) ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 6px 18px rgba(2, 132, 199, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    opacity: (!selectedSlot || submitting) ? 0.75 : 1,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {submitting ? (
                                    <InlineLoader size="20px" text="Confirming with Hospital Queue..." />
                                ) : (
                                    <>
                                        <Calendar size={18} />
                                        <span>Confirm Appointment ({selectedDate} @ {selectedSlot || 'Select Slot'})</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientForm;
