import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    Clock,
    MapPin,
    Phone,
    ArrowRight,
    Search,
    Stethoscope,
    Calendar,
    Star,
    CheckCircle2,
    Shield,
    Sparkles,
    User,
    Building2,
    SlidersHorizontal,
    RefreshCw,
    MessageSquare,
    ClipboardList,
    AlertCircle
} from 'lucide-react';
import DepthCarousel from '../../components/ui/DepthCarousel';
import PeekRating from '../../components/ui/PeekRating';
import ReviewModal from '../../components/reviews/ReviewModal';
import Button from '../../components/common/Button';
import { InlineLoader, Loader } from '../../components/common/Loader';
import { doctorService } from '../../services/doctor.service';
import { hospitalService } from '../../services/hospital.service';
import { appointmentService } from '../../services/appointment.service';
import { reviewService } from '../../services/review.service';
import AnimatedGlassBackground from '../../components/common/AnimatedGlassBackground';

const FALLBACK_DOCTOR_IMAGES = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1594824813586-4e5251a37c95?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600'
];

const PatientPortal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    // Active View Tab: 'directory' | 'appointments' | 'reviews'
    const [activeTab, setActiveTab] = useState('directory');

    // Data State
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Patient Appointments & Reviews Data
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [patientReviews, setPatientReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Review Modal State
    const [selectedAptForReview, setSelectedAptForReview] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHospital, setSelectedHospital] = useState('All');
    const [selectedDept, setSelectedDept] = useState('All');

    // Fetch initial directory data
    const loadDirectoryData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [hospRes, specRes, docRes] = await Promise.all([
                hospitalService.getHospitals(),
                hospitalService.getSpecialties(),
                doctorService.getDoctors()
            ]);

            setHospitals(Array.isArray(hospRes) ? hospRes : hospRes?.data || []);
            setSpecialties(Array.isArray(specRes) ? specRes : specRes?.data || []);
            
            const rawDocs = Array.isArray(docRes) ? docRes : docRes?.data || [];
            setDoctors(rawDocs);
        } catch (err) {
            console.error('Error loading directory data:', err);
            setError('Failed to load specialists directory. Please retry.');
        } finally {
            setLoading(false);
        }
    };

    // Load Patient Appointments & Reviews
    const loadPatientData = async () => {
        if (!isAuthenticated) return;
        setLoadingAppointments(true);
        setLoadingReviews(true);
        try {
            const [apts, revs] = await Promise.all([
                appointmentService.getPatientAppointments(),
                reviewService.getPatientReviews()
            ]);
            setAppointments(Array.isArray(apts) ? apts : apts?.data || []);
            setPatientReviews(Array.isArray(revs) ? revs : revs?.data || []);
        } catch (err) {
            console.warn('Error loading patient data:', err);
        } finally {
            setLoadingAppointments(false);
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        loadDirectoryData();
    }, []);

    useEffect(() => {
        loadPatientData();
    }, [isAuthenticated]);

    // Set of reviewed appointment IDs
    const reviewedAppointmentIds = useMemo(() => {
        const set = new Set();
        patientReviews.forEach(r => {
            const aptId = r.appointment?._id || r.appointment?.id || r.appointment;
            if (aptId) set.add(aptId.toString());
        });
        return set;
    }, [patientReviews]);

    // Department / Specialization list for filter pills
    const departmentOptions = useMemo(() => {
        const unique = new Set(['All']);
        specialties.forEach(s => {
            if (s.name) unique.add(s.name);
            if (s.department) unique.add(s.department);
        });
        doctors.forEach(d => {
            if (d.department) unique.add(d.department);
            if (d.specialty?.name) unique.add(d.specialty.name);
            if (d.specialtyName) unique.add(d.specialtyName);
        });
        return Array.from(unique);
    }, [specialties, doctors]);

    // Filter doctors based on hospital, department, and search
    const filteredDoctors = useMemo(() => {
        return doctors.filter(doc => {
            // Hospital filter
            const docHospitalId = doc.hospital?._id || doc.hospital?.id || doc.hospital || '';
            const docHospitalName = doc.hospital?.name || doc.hospitalName || '';
            const matchesHospital = selectedHospital === 'All' ||
                docHospitalId === selectedHospital ||
                docHospitalName === selectedHospital;

            // Department / Specialization filter
            const docDept = (doc.department || doc.specialty?.name || doc.specialtyName || '').toLowerCase();
            const matchesDept = selectedDept === 'All' || docDept === selectedDept.toLowerCase();

            // Search query
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch = !q ||
                (doc.name && doc.name.toLowerCase().includes(q)) ||
                (doc.department && doc.department.toLowerCase().includes(q)) ||
                (doc.specialization && doc.specialization.toLowerCase().includes(q)) ||
                (doc.qualifications && doc.qualifications.toLowerCase().includes(q)) ||
                (docHospitalName && docHospitalName.toLowerCase().includes(q));

            return matchesHospital && matchesDept && matchesSearch;
        });
    }, [doctors, selectedHospital, selectedDept, searchQuery]);

    // Map filtered doctors into DepthCarousel items
    const carouselItems = useMemo(() => {
        return filteredDoctors.map((doc, idx) => {
            const fallbackImg = FALLBACK_DOCTOR_IMAGES[idx % FALLBACK_DOCTOR_IMAGES.length];
            const experienceYears = doc.experienceYears || 10;
            const hospitalName = doc.hospital?.name || doc.hospitalName || 'ProHealth Central Hospital';
            const specialization = doc.specialty?.name || doc.specialtyName || doc.department || 'Specialist Physician';

            return {
                _id: doc._id || doc.id,
                id: doc._id || doc.id,
                name: doc.name,
                specialization,
                department: doc.department || specialization,
                experienceYears,
                experience: `${experienceYears}+ Years Exp`,
                hospitalName,
                hospitalId: doc.hospital?._id || doc.hospital?.id || doc.hospital || '',
                rating: doc.rating || 4.9,
                reviewsCount: doc.reviewsCount || 120,
                consultationFee: doc.consultationFee || 50,
                fee: `$${doc.consultationFee || 50}`,
                roomNumber: doc.roomNumber || 'OPD Room 101',
                availabilityStatus: doc.isAvailableToday !== false ? 'Available Today' : 'Schedule Ahead',
                image: doc.image || doc.photo || fallbackImg,
                rawDoctor: doc
            };
        });
    }, [filteredDoctors]);

    // Handle Book Appointment Click
    const handleBookAppointment = (selectedDoctorItem) => {
        const doctorId = selectedDoctorItem._id || selectedDoctorItem.id;
        const hospitalId = selectedDoctorItem.hospitalId || selectedDoctorItem.hospital?._id || '';

        const bookingPayload = {
            doctorId,
            hospitalId,
            doctorName: selectedDoctorItem.name,
            specialization: selectedDoctorItem.specialization,
            department: selectedDoctorItem.department,
            hospitalName: selectedDoctorItem.hospitalName,
            consultationFee: selectedDoctorItem.consultationFee,
            fee: selectedDoctorItem.fee,
            roomNumber: selectedDoctorItem.roomNumber,
            image: selectedDoctorItem.image,
            doctor: selectedDoctorItem
        };

        // Directly navigate to patient booking form so patients can book directly
        navigate('/patient/form', {
            state: {
                ...bookingPayload,
                doctor: bookingPayload
            }
        });
    };

    const handleOpenReviewModal = (apt) => {
        setSelectedAptForReview(apt);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmitted = () => {
        loadPatientData();
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '4rem', background: '#ffffff', backgroundColor: '#ffffff', color: '#0f172a' }}>
            <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '1.5rem' }}>
                {/* Header & Tab Selector */}
                <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 1.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '9999px',
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        color: '#0284c7',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '0.85rem'
                    }}>
                        <Sparkles size={16} color="#0284c7" />
                        <span>Verified Medical Specialists & Patient Portal</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.9rem, 3.8vw, 2.65rem)',
                        fontWeight: '900',
                        color: '#0f172a',
                        lineHeight: 1.2,
                        marginBottom: '0.75rem',
                        letterSpacing: '-0.02em'
                    }}>
                        {activeTab === 'directory' ? 'Find Top Specialists & Book Consultations' :
                         activeTab === 'appointments' ? 'My Consultations & Appointments' :
                         'My Feedback & Reviews'}
                    </h1>

                    {/* Navigation Sub-Tabs */}
                    <div style={{
                        display: 'inline-flex',
                        maxWidth: '100%',
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        background: '#ffffff',
                        padding: '5px',
                        borderRadius: '9999px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        marginTop: '0.5rem'
                    }}>
                        <button
                            onClick={() => setActiveTab('directory')}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '9999px',
                                border: 'none',
                                background: activeTab === 'directory' ? '#0284c7' : 'transparent',
                                color: activeTab === 'directory' ? '#ffffff' : '#334155',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Stethoscope size={16} />
                            <span>Find Doctors</span>
                        </button>

                        {isAuthenticated && (
                            <>
                                <button
                                    onClick={() => setActiveTab('appointments')}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: activeTab === 'appointments' ? '#0284c7' : 'transparent',
                                        color: activeTab === 'appointments' ? '#ffffff' : '#334155',
                                        fontWeight: 700,
                                        fontSize: '0.88rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <ClipboardList size={16} />
                                    <span>My Appointments ({appointments.length})</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: activeTab === 'reviews' ? '#0284c7' : 'transparent',
                                        color: activeTab === 'reviews' ? '#ffffff' : '#334155',
                                        fontWeight: 700,
                                        fontSize: '0.88rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <MessageSquare size={16} />
                                    <span>My Reviews ({patientReviews.length})</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* TAB 1: DOCTOR DIRECTORY */}
                {activeTab === 'directory' && (
                    <>
                        {/* Filter Toolbar Section - Crisp White Card */}
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '18px',
                            padding: '1.25rem',
                            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
                            marginBottom: '1.25rem'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                gap: '1rem',
                                alignItems: 'center'
                            }}>
                                {/* Search Input */}
                                <div style={{ position: 'relative' }}>
                                    <Search
                                        size={18}
                                        color="#0284c7"
                                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by doctor name, specialty..."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                                            borderRadius: '10px',
                                            background: '#f8fafc',
                                            border: '1.5px solid #cbd5e1',
                                            color: '#0f172a',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Hospital Selector */}
                                <div style={{ position: 'relative' }}>
                                    <Building2
                                        size={18}
                                        color="#0284c7"
                                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                                    />
                                    <select
                                        value={selectedHospital}
                                        onChange={(e) => setSelectedHospital(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                                            borderRadius: '10px',
                                            background: '#f8fafc',
                                            border: '1.5px solid #cbd5e1',
                                            color: '#0f172a',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="All">All Partner Hospitals</option>
                                        {hospitals.map(h => (
                                            <option key={h._id || h.id} value={h._id || h.id || h.name}>
                                                {h.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reset / Count Stats */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>
                                        Showing <strong style={{ color: '#0284c7' }}>{filteredDoctors.length}</strong> available doctors
                                    </span>
                                    {(searchQuery || selectedHospital !== 'All' || selectedDept !== 'All') && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedHospital('All');
                                                setSelectedDept('All');
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                padding: '0.4rem 0.75rem',
                                                borderRadius: '8px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                                color: '#ef4444',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <RefreshCw size={13} />
                                            <span>Reset</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Department Filter Pills */}
                            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                {departmentOptions.map((dept) => {
                                    const isSelected = selectedDept.toLowerCase() === dept.toLowerCase();
                                    return (
                                        <button
                                            key={dept}
                                            onClick={() => setSelectedDept(dept)}
                                            style={{
                                                padding: '0.4rem 0.9rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                border: isSelected ? '1px solid #0284c7' : '1px solid #cbd5e1',
                                                background: isSelected ? '#0284c7' : '#f1f5f9',
                                                color: isSelected ? '#ffffff' : '#334155',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                                            }}
                                        >
                                            {dept}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DOCTOR SELECTION SECTION: DEPTH CAROUSEL */}
                        <div style={{ margin: '0.5rem 0 3rem', minHeight: '490px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                                    <InlineLoader size="42px" text="Loading hospital specialists and real-time availability..." />
                                </div>
                            ) : error ? (
                                <div style={{
                                    background: '#ffffff',
                                    border: '1px solid #fecaca',
                                    borderRadius: '16px',
                                    padding: '2.5rem 1.5rem',
                                    textAlign: 'center',
                                    maxWidth: '520px',
                                    margin: '1.5rem auto',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                }}>
                                    <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '1.25rem' }}>{error}</p>
                                    <button
                                        onClick={loadDirectoryData}
                                        style={{
                                            padding: '0.65rem 1.25rem',
                                            borderRadius: '10px',
                                            background: '#0284c7',
                                            color: '#ffffff',
                                            fontWeight: 700,
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Retry Connection
                                    </button>
                                </div>
                            ) : carouselItems.length === 0 ? (
                                <div style={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '20px',
                                    padding: '3rem 2rem',
                                    textAlign: 'center',
                                    maxWidth: '560px',
                                    margin: '1.5rem auto',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                }}>
                                    <Stethoscope size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                                        No Specialists Found
                                    </h3>
                                    <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                                        No doctors matched your current filter. Try resetting filters to explore all available clinicians.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <DepthCarousel
                                        items={carouselItems}
                                        cardWidth={290}
                                        cardHeight={390}
                                        depth={180}
                                        spread={75}
                                        tilt={16}
                                        tiltDirection="right"
                                        perspective={1200}
                                        visibleCards={4}
                                        falloff={0.2}
                                        blur={5}
                                        autoplay={false}
                                        loop={carouselItems.length > 1}
                                        onBook={handleBookAppointment}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* TAB 2: MY APPOINTMENTS */}
                {activeTab === 'appointments' && (
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        color: '#0f172a'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                                    My Consultation History
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                                    Track appointments and share verified reviews for completed visits.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={loadPatientData}
                                style={{ borderRadius: '8px' }}
                            >
                                <RefreshCw size={14} />
                                <span>Refresh</span>
                            </Button>
                        </div>

                        {loadingAppointments ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                                <InlineLoader size="36px" text="Loading appointments..." />
                            </div>
                        ) : appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                                <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem' }}>
                                    No Appointments Booked Yet
                                </h4>
                                <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                                    Discover verified specialists across our partner hospitals and book your first OPD visit.
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => setActiveTab('directory')}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Browse Specialists
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {appointments.map((apt) => {
                                    const aptId = (apt._id || apt.id || '').toString();
                                    const isCompleted = apt.status === 'COMPLETED';
                                    const isReviewed = reviewedAppointmentIds.has(aptId);
                                    const docName = apt.doctor?.name || apt.doctorName || 'Doctor';
                                    const hospName = apt.hospital?.name || apt.hospitalName || 'ProHealth Hospital';

                                    return (
                                        <div
                                            key={aptId}
                                            style={{
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '14px',
                                                padding: '1.25rem',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '46px',
                                                    height: '46px',
                                                    borderRadius: '12px',
                                                    background: 'rgba(2, 132, 199, 0.1)',
                                                    color: '#0284c7',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Stethoscope size={24} />
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                                        {docName}
                                                    </h4>
                                                    <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '3px' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Building2 size={13} color="#0284c7" />
                                                            {hospName}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Calendar size={13} color="#0284c7" />
                                                            {apt.date} • {apt.timeSlot}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge & Review Action */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.35rem 0.85rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 700,
                                                    background: isCompleted ? '#ecfdf5' : apt.status === 'CONFIRMED' ? '#f0f9ff' : '#fef2f2',
                                                    color: isCompleted ? '#065f46' : apt.status === 'CONFIRMED' ? '#0369a1' : '#b91c1c',
                                                    border: `1px solid ${isCompleted ? '#a7f3d0' : apt.status === 'CONFIRMED' ? '#bae6fd' : '#fecaca'}`
                                                }}>
                                                    {apt.status}
                                                </span>

                                                {/* Review Action strictly for completed appointments */}
                                                {isCompleted && (
                                                    isReviewed ? (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '0.4rem 0.85rem',
                                                            borderRadius: '8px',
                                                            background: '#fef3c7',
                                                            color: '#92400e',
                                                            fontSize: '0.82rem',
                                                            fontWeight: 700
                                                        }}>
                                                            <Star size={13} fill="#f5b400" color="#f5b400" />
                                                            <span>Reviewed</span>
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleOpenReviewModal(apt)}
                                                            style={{
                                                                borderRadius: '8px',
                                                                padding: '0.45rem 1rem',
                                                                fontSize: '0.82rem',
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            <MessageSquare size={14} />
                                                            <span>Leave a Review</span>
                                                        </Button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: MY REVIEWS */}
                {activeTab === 'reviews' && (
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        color: '#0f172a'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                                    My Submitted Reviews
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                                    Verified feedback you have contributed to help other patients.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={loadPatientData}
                                style={{ borderRadius: '8px' }}
                            >
                                <RefreshCw size={14} />
                                <span>Refresh</span>
                            </Button>
                        </div>

                        {loadingReviews ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                                <InlineLoader size="36px" text="Loading your reviews..." />
                            </div>
                        ) : patientReviews.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                                <MessageSquare size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem' }}>
                                    No Reviews Written Yet
                                </h4>
                                <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                                    You haven't reviewed any completed visits yet. Complete an appointment to share your rating.
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => setActiveTab('appointments')}
                                    style={{ borderRadius: '8px' }}
                                >
                                    View Completed Appointments
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                                {patientReviews.map((rev) => (
                                    <div
                                        key={rev._id || rev.id}
                                        style={{
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '14px',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: '0.75rem'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                                                        {rev.doctor?.name || rev.doctorName || 'Doctor'}
                                                    </h4>
                                                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                                        {rev.hospital?.name || rev.hospitalName}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                                                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>

                                            <div style={{ margin: '0.35rem 0 0.65rem' }}>
                                                <PeekRating
                                                    value={rev.rating}
                                                    count={5}
                                                    shape="star"
                                                    readOnly={true}
                                                    size={18}
                                                    activeColor="#f5b400"
                                                    idleColor="#e2e8f0"
                                                />
                                            </div>

                                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                                                "{rev.comment}"
                                            </p>
                                        </div>

                                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                <CheckCircle2 size={12} />
                                                Verified Visit
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                                                Status: <strong style={{ color: '#0284c7' }}>{rev.status || 'PUBLISHED'}</strong>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setSelectedAptForReview(null);
                }}
                appointment={selectedAptForReview}
                onSuccess={handleReviewSubmitted}
            />
        </div>
    );
};

export default PatientPortal;
