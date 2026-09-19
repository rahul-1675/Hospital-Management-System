import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Calendar,
    Shield,
    Users,
    ArrowRight,
    HeartPulse,
    Stethoscope,
    Pill,
    Clock,
    PhoneCall,
    Award,
    CheckCircle2,
    Sparkles,
    Building2
} from 'lucide-react';
import HomeBg from '../../assets/Home.png';

const DEPARTMENTS = [
    { name: 'Cardiology', icon: HeartPulse, count: '14 Specialists', desc: 'Comprehensive cardiac care, ECG, angioplasty, and cardiac rehab.', color: '#ef4444', bg: '#fef2f2' },
    { name: 'Neurology & Brain', icon: Activity, count: '9 Specialists', desc: 'Advanced neuro-diagnostics, stroke recovery, and spine surgery.', color: '#8b5cf6', bg: '#f5f3ff' },
    { name: 'Pediatrics & Neonatal', icon: Users, count: '12 Specialists', desc: 'Compassionate pediatric wellness, vaccinations, and NICU care.', color: '#06b6d4', bg: '#ecfeff' },
    { name: 'Orthopedics & Joint', icon: Stethoscope, count: '11 Specialists', desc: 'Joint replacement, trauma care, arthroscopy, and sports therapy.', color: '#f59e0b', bg: '#fffbeb' },
    { name: 'Emergency & Trauma', icon: Clock, count: '24/7 Available', desc: 'Rapid critical triage with dedicated ICU and trauma response teams.', color: '#dc2626', bg: '#fef2f2' },
    { name: 'Pharmacy & Diagnostics', icon: Pill, count: 'In-House 24/7', desc: 'Automated dispensing, accredited pathology, and digital reports.', color: '#10b981', bg: '#ecfdf5' }
];

const STATS = [
    { label: 'Licensed Specialists', value: '150+', change: '+12 this year' },
    { label: 'Patient Consultations', value: '45,000+', change: '99.2% satisfaction' },
    { label: 'Emergency Response', value: '< 6 mins', change: '24/7 Dedicated' },
    { label: 'Clinical Accuracy', value: '99.8%', change: 'JCI Accredited' }
];

const Home = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.85)), url(${HomeBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            paddingBottom: '5rem'
        }}>
            {/* HERO SECTION */}
            <section style={{
                padding: '5rem 1rem 4rem',
                textAlign: 'center',
                color: '#ffffff'
            }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.45rem 1.1rem',
                        borderRadius: '9999px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        color: '#38bdf8',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1.75rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Sparkles size={15} />
                        <span>Next-Generation Intelligent Healthcare Management</span>
                    </div>

                    {/* Main Headline */}
                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                        fontWeight: '800',
                        lineHeight: 1.15,
                        color: '#ffffff',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.03em',
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                        Precision Medicine Meets <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #38bdf8 0%, #34d399 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Seamless Clinical Care
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                        color: '#e2e8f0',
                        maxWidth: '750px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.6,
                        textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                    }}>
                        Connecting patients, doctors, pharmacy, and administration in one unified, real-time healthcare ecosystem.
                    </p>

                    {/* Action Triggers */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '3.5rem'
                    }}>
                        <Link to="/patient">
                            <button style={{
                                padding: '0.9rem 2rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                                color: '#ffffff',
                                fontWeight: '700',
                                fontSize: '1.05rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                boxShadow: '0 10px 25px rgba(2, 132, 199, 0.4)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                <Calendar size={20} />
                                <span>Book an Appointment</span>
                                <ArrowRight size={18} />
                            </button>
                        </Link>
                        <Link to="/about">
                            <button style={{
                                padding: '0.9rem 1.75rem',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.12)',
                                backdropFilter: 'blur(12px)',
                                color: '#ffffff',
                                fontWeight: '600',
                                fontSize: '1.05rem',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                Hospital Facilities
                            </button>
                        </Link>
                    </div>

                    {/* LIVE STATS BAR */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                        gap: '1.25rem',
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(16px)',
                        padding: '1.75rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}>
                        {STATS.map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2.1rem',
                                    fontWeight: '800',
                                    color: '#38bdf8',
                                    lineHeight: 1.1,
                                    marginBottom: '0.35rem'
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                    {stat.change}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DEPARTMENTS SHOWCASE */}
            <section className="container" style={{ marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <span style={{
                        color: '#38bdf8',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        Centers of Clinical Excellence
                    </span>
                    <h2 style={{
                        fontSize: '2.3rem',
                        fontWeight: '800',
                        color: '#ffffff',
                        marginTop: '0.4rem',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        World-Class Specialized Care
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {DEPARTMENTS.map((dept, index) => {
                        const IconComponent = dept.icon;
                        return (
                            <div
                                key={index}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: '16px',
                                    padding: '1.75rem',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.6)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.25s, box-shadow 0.25s'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                        <div style={{
                                            width: '52px',
                                            height: '52px',
                                            borderRadius: '14px',
                                            background: dept.bg,
                                            color: dept.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <IconComponent size={28} />
                                        </div>
                                        <span style={{
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '9999px',
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            fontSize: '0.78rem',
                                            fontWeight: '600'
                                        }}>
                                            {dept.count}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                        {dept.name}
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                                        {dept.desc}
                                    </p>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <Link
                                        to="/patient"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            fontSize: '0.88rem',
                                            fontWeight: '700',
                                            color: '#0284c7'
                                        }}
                                    >
                                        <span>Consult Specialists</span>
                                        <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* TRUST & SECURITY PILLARS */}
            <section className="container" style={{ marginTop: '4.5rem' }}>
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    padding: '3rem 2.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff'
                }}>
                    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        <span style={{ color: '#34d399', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                            Advanced Infrastructure
                        </span>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.4rem' }}>
                            Engineered for Clinical Safety & Reliability
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ color: '#38bdf8', flexShrink: 0 }}>
                                <Shield size={28} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>Bank-Grade Security</h4>
                                <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                                    Role-based access controls and encrypted electronic health records compliant with global healthcare guidelines.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ color: '#34d399', flexShrink: 0 }}>
                                <Activity size={28} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>Live Queue Synchronization</h4>
                                <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                                    Real-time token and OPD queue updates across reception desk, doctor consultation rooms, and patient monitors.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ color: '#fbbf24', flexShrink: 0 }}>
                                <Award size={28} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>Instant Dispensing & Billing</h4>
                                <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                                    Automated pharmacy stock deduction, e-prescriptions, and paperless invoices in seconds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
