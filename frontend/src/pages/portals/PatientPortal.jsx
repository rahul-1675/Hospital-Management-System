import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    User
} from 'lucide-react';
import HomeBg from '../../assets/Home.png';

const SPECIALISTS = [
    {
        id: 1,
        name: "Dr. Sarah Smith",
        specialization: "Senior Cardiologist",
        department: "Cardiology",
        experience: "14+ Years Exp",
        rating: 4.9,
        reviewsCount: 128,
        availability: "Available Today, 9:00 AM - 2:00 PM",
        status: "Available",
        fee: "$65",
        room: "OPD Room 102"
    },
    {
        id: 2,
        name: "Dr. James Wilson",
        specialization: "Chief Neurologist",
        department: "Neurology",
        experience: "18+ Years Exp",
        rating: 4.95,
        reviewsCount: 210,
        availability: "Available Today, 11:00 AM - 4:00 PM",
        status: "Available",
        fee: "$80",
        room: "OPD Room 204"
    },
    {
        id: 3,
        name: "Dr. Emily Chen",
        specialization: "Consultant Pediatrician",
        department: "Pediatrics",
        experience: "9+ Years Exp",
        rating: 4.88,
        reviewsCount: 94,
        availability: "Available Tomorrow, 8:00 AM - 1:00 PM",
        status: "Next Slot Tomorrow",
        fee: "$50",
        room: "Child Clinic 101"
    },
    {
        id: 4,
        name: "Dr. Michael Brown",
        specialization: "Orthopedic & Joint Surgeon",
        department: "Orthopedics",
        experience: "15+ Years Exp",
        rating: 4.92,
        reviewsCount: 165,
        availability: "Available Today, 10:00 AM - 3:00 PM",
        status: "Available",
        fee: "$70",
        room: "Ortho Suite 305"
    },
    {
        id: 5,
        name: "Dr. Lisa Taylor",
        specialization: "Senior Dermatologist",
        department: "Dermatology",
        experience: "11+ Years Exp",
        rating: 4.85,
        reviewsCount: 82,
        availability: "Available Thu, 9:00 AM - 5:00 PM",
        status: "Schedule Ahead",
        fee: "$55",
        room: "Derma Lab 108"
    },
    {
        id: 6,
        name: "Dr. Robert King",
        specialization: "Lead General Physician",
        department: "General Medicine",
        experience: "20+ Years Exp",
        rating: 4.97,
        reviewsCount: 340,
        availability: "Available Daily, 8:00 AM - 8:00 PM",
        status: "Available",
        fee: "$45",
        room: "Primary Care 100"
    }
];

const DEPT_FILTERS = ["All", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "General Medicine"];

const PatientPortal = () => {
    const navigate = useNavigate();
    const [selectedDept, setSelectedDept] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDoctors = useMemo(() => {
        return SPECIALISTS.filter(doc => {
            const matchesDept = selectedDept === "All" || doc.department === selectedDept;
            const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.department.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDept && matchesSearch;
        });
    }, [selectedDept, searchTerm]);

    const handleConsult = (doctor) => {
        navigate('/patient/form', { state: { doctor } });
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.88)), url(${HomeBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            paddingBottom: '5rem'
        }}>
            {/* Header Hero */}
            <section style={{ padding: '3.5rem 1rem 2rem', textAlign: 'center', color: '#ffffff' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 1rem',
                        borderRadius: '9999px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        <Sparkles size={14} />
                        <span>Instant Consultation Booking</span>
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                        fontWeight: '800',
                        color: '#ffffff',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Find Your Doctor & <span style={{ color: '#38bdf8' }}>Book Online</span>
                    </h1>

                    <p style={{ color: '#e2e8f0', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 2rem' }}>
                        Browse top-tier specialists, check real-time OPD availability, and lock in your consultation in seconds.
                    </p>

                    {/* Search Bar */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '14px',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                        maxWidth: '620px',
                        margin: '0 auto'
                    }}>
                        <Search size={20} color="#64748b" style={{ marginLeft: '0.5rem' }} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by doctor name, symptom, or specialty..."
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                padding: '0.5rem',
                                fontSize: '1rem',
                                color: '#0f172a'
                            }}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', padding: '0.25rem 0.5rem' }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Department Filter Pills */}
            <div className="container" style={{ marginBottom: '2rem' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    {DEPT_FILTERS.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            style={{
                                padding: '0.5rem 1.1rem',
                                borderRadius: '9999px',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                border: selectedDept === dept ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                                background: selectedDept === dept ? '#38bdf8' : 'rgba(15, 23, 42, 0.65)',
                                color: selectedDept === dept ? '#0f172a' : '#ffffff',
                                backdropFilter: 'blur(10px)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* DOCTOR CARDS GRID */}
            <div className="container">
                {filteredDoctors.length === 0 ? (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        padding: '3rem',
                        textAlign: 'center',
                        maxWidth: '500px',
                        margin: '2rem auto'
                    }}>
                        <Stethoscope size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>No Specialists Found</h3>
                        <p style={{ color: '#64748b' }}>Try adjusting your search keywords or category filters.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {filteredDoctors.map((doc) => (
                            <div
                                key={doc.id}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.96)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: '18px',
                                    padding: '1.75rem',
                                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                            >
                                <div>
                                    {/* Top Header info */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '14px',
                                                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#ffffff',
                                                fontWeight: '700',
                                                fontSize: '1.2rem',
                                                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
                                            }}>
                                                <User size={26} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                                    {doc.name}
                                                </h3>
                                                <p style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: '600', margin: 0 }}>
                                                    {doc.specialization}
                                                </p>
                                            </div>
                                        </div>

                                        <span style={{
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '9999px',
                                            background: '#ecfdf5',
                                            color: '#059669',
                                            border: '1px solid #a7f3d0',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}>
                                            {doc.fee}
                                        </span>
                                    </div>

                                    {/* Rating & Meta */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.65rem 0.85rem',
                                        background: '#f8fafc',
                                        borderRadius: '10px',
                                        marginBottom: '1rem',
                                        fontSize: '0.82rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{doc.rating}</span>
                                            <span style={{ color: '#64748b' }}>({doc.reviewsCount})</span>
                                        </div>
                                        <span style={{ color: '#cbd5e1' }}>•</span>
                                        <span style={{ color: '#475569', fontWeight: '500' }}>{doc.experience}</span>
                                        <span style={{ color: '#cbd5e1' }}>•</span>
                                        <span style={{ color: '#475569', fontWeight: '500' }}>{doc.room}</span>
                                    </div>

                                    {/* Availability */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#334155', marginBottom: '1.25rem' }}>
                                        <Clock size={16} color="#0284c7" />
                                        <span>{doc.availability}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleConsult(doc)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                        color: '#ffffff',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Calendar size={16} />
                                    <span>Book Consultation</span>
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientPortal;
