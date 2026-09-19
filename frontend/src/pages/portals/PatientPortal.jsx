import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    RefreshCw
} from 'lucide-react';
import HomeBg from '../../assets/Home.png';
import DepthCarousel from '../../components/ui/DepthCarousel';
import { InlineLoader } from '../../components/common/Loader';
import { doctorService } from '../../services/doctor.service';
import { hospitalService } from '../../services/hospital.service';

const FALLBACK_DOCTOR_IMAGES = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1594824813586-4e5251a37c95?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600'
];

const PatientPortal = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // Data State
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHospital, setSelectedHospital] = useState('All');
    const [selectedDept, setSelectedDept] = useState('All');

    // Fetch initial data
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

    useEffect(() => {
        loadDirectoryData();
    }, []);

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

        if (!isAuthenticated) {
            // Unauthenticated: redirect to login preserving booking intent
            navigate('/login', {
                state: {
                    from: { pathname: '/patient/form' },
                    redirect: '/patient/form',
                    bookingPayload,
                    doctor: bookingPayload
                }
            });
            return;
        }

        // Authenticated: navigate to appointment booking page
        navigate('/patient/form', {
            state: {
                ...bookingPayload,
                doctor: bookingPayload
            }
        });
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '5rem', background: '#0a0f1d', color: '#f8fafc' }}>
            {/* Background image & gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '650px',
                    backgroundImage: `url(${HomeBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    opacity: 0.15,
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '650px',
                    background: 'linear-gradient(180deg, rgba(10, 15, 29, 0.4) 0%, #0a0f1d 100%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />

            <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '2.5rem' }}>
                {/* Hero Header */}
                <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '9999px',
                        background: 'rgba(2, 132, 199, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        backdropFilter: 'blur(8px)'
                    }}>
                        <Sparkles size={16} />
                        <span>Verified Medical Specialists & OPD Booking</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                        fontWeight: '900',
                        color: '#ffffff',
                        lineHeight: 1.2,
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Find Top Specialists & Book <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Instant Consultations</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 auto' }}>
                        Browse leading physicians across multi-specialty hospitals. Select a doctor on the 3D rail, review availability, and secure your OPD token in seconds.
                    </p>
                </div>

                {/* Filter Toolbar Section */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                    marginBottom: '2rem'
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
                                color="#38bdf8"
                                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by doctor name, specialty..."
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.6rem',
                                    borderRadius: '12px',
                                    background: 'rgba(10, 15, 29, 0.85)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: '#ffffff',
                                    fontSize: '0.92rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Hospital Selector */}
                        <div style={{ position: 'relative' }}>
                            <Building2
                                size={18}
                                color="#38bdf8"
                                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                            />
                            <select
                                value={selectedHospital}
                                onChange={(e) => setSelectedHospital(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.6rem',
                                    borderRadius: '12px',
                                    background: 'rgba(10, 15, 29, 0.85)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: '#ffffff',
                                    fontSize: '0.92rem',
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
                            <span style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: 600 }}>
                                Showing <strong style={{ color: '#38bdf8' }}>{filteredDoctors.length}</strong> available {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
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
                                        padding: '0.45rem 0.85rem',
                                        borderRadius: '8px',
                                        background: 'rgba(239, 68, 68, 0.15)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        color: '#f87171',
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
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {departmentOptions.map((dept) => {
                            const isSelected = selectedDept.toLowerCase() === dept.toLowerCase();
                            return (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    style={{
                                        padding: '0.45rem 1rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                                        background: isSelected ? '#0284c7' : 'rgba(10, 15, 29, 0.6)',
                                        color: isSelected ? '#ffffff' : '#cbd5e1',
                                        backdropFilter: 'blur(8px)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none'
                                    }}
                                >
                                    {dept}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* DOCTOR SELECTION SECTION: DEPTH CAROUSEL */}
                <div style={{ margin: '2rem 0', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                            <InlineLoader size="42px" text="Loading hospital specialists and real-time availability..." />
                        </div>
                    ) : error ? (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '16px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            maxWidth: '520px',
                            margin: '2rem auto'
                        }}>
                            <p style={{ color: '#f87171', fontWeight: 600, marginBottom: '1.25rem' }}>{error}</p>
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
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '20px',
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            maxWidth: '560px',
                            margin: '2rem auto'
                        }}>
                            <Stethoscope size={52} color="#64748b" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                                No Specialists Found
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                                No doctors matched your current hospital or specialization filter. Try resetting filters to explore all available clinicians.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedHospital('All');
                                    setSelectedDept('All');
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '10px',
                                    background: '#0284c7',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                View All Specialists
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* React Bits DepthCarousel Component */}
                            <DepthCarousel
                                items={carouselItems}
                                depth={220}
                                spread={90}
                                tilt={22}
                                tiltDirection="right"
                                perspective={1400}
                                visibleCards={4}
                                falloff={0.2}
                                blur={6}
                                autoplay={false}
                                loop={carouselItems.length > 1}
                                onBook={handleBookAppointment}
                            />
                        </div>
                    )}
                </div>

                {/* Features & Safe Healthcare Guarantee */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '4rem'
                }}>
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            background: 'rgba(2, 132, 199, 0.15)',
                            color: '#38bdf8'
                        }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 0.35rem' }}>
                                Board-Certified Specialists
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                                Every clinician profile is authenticated with medical council registration and verified clinical credentials.
                            </p>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            background: 'rgba(2, 132, 199, 0.15)',
                            color: '#38bdf8'
                        }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 0.35rem' }}>
                                Real-Time Slot Guarantee
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                                Direct connection to the hospital OPD queuing system prevents double bookings and minimizes waiting room delays.
                            </p>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            background: 'rgba(2, 132, 199, 0.15)',
                            color: '#38bdf8'
                        }}>
                            <Shield size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 0.35rem' }}>
                                Digital OPD Pass & Queue Token
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                                Receive an instant printable OPD confirmation pass with verified QR identification upon booking.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientPortal;
