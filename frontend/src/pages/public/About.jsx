import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    Activity,
    Award,
    HeartPulse,
    Microscope,
    Clock,
    Users,
    Building2,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';

const INFRASTRUCTURE = [
    {
        title: "24/7 Level-1 Trauma Center",
        desc: "Equipped with instant resus suites, dedicated emergency imaging, and round-the-clock anesthesiologists.",
        icon: Clock,
        highlight: "Under 8 min average ER triage"
    },
    {
        title: "Advanced Robotic OT Suites",
        desc: "Minimally invasive surgical theatres featuring high-definition 3D laparoscopy and da Vinci surgical systems.",
        icon: Microscope,
        highlight: "99.8% surgical success rate"
    },
    {
        title: "Digital Pathology & Diagnostics",
        desc: "Automated blood analyzers, 3T MRI, 128-slice CT scans with real-time EMR cloud sync in minutes.",
        icon: Activity,
        highlight: "Same-day verified lab reports"
    },
    {
        title: "Smart Intensive Care (ICU/NICU)",
        desc: "Continuous central telemetry monitoring, positive-pressure isolation pods, and dedicated critical care intensivists.",
        icon: HeartPulse,
        highlight: "1:1 Dedicated nurse-patient ratio"
    }
];

const ACCREDITATIONS = [
    "Joint Commission International (JCI) Accredited",
    "National Accreditation Board for Hospitals (NABH)",
    "College of American Pathologists (CAP) Certified Labs",
    "100% HIPAA & ISO 27001 Data Security Certified"
];

const About = () => {
    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #090e1a 0%, #0d1527 50%, #080d19 100%)',
            color: '#ffffff',
            paddingBottom: '5rem'
        }}>
            <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Header */}
            <div style={{ padding: '4rem 1rem 3rem', textAlign: 'center', color: '#ffffff' }}>
                <div className="container" style={{ maxWidth: '850px' }}>
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
                        <Award size={14} />
                        <span>Excellence in Healthcare Since 2012</span>
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                        fontWeight: '800',
                        color: '#ffffff',
                        marginBottom: '1.25rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Pioneering Compassionate Care & <br />
                        <span style={{ color: '#38bdf8' }}>Clinical Excellence</span>
                    </h1>

                    <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.6', margin: '0 auto' }}>
                        ProHealth Hospital is a multi-specialty healthcare institution dedicated to delivering world-class medical treatments through innovative technology and empathetic patient care.
                    </p>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="container" style={{ marginBottom: '3.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0284c7' }}>500+</div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>Bed Capacity</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Multi-specialty wards & ICUs</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0284c7' }}>150+</div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>Super Specialists</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Across 28 departments</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0284c7' }}>98.9%</div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>Patient Approval</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Over 40k+ verified reviews</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0284c7' }}>24/7</div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>Emergency Care</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Dedicated trauma unit</div>
                    </div>
                </div>
            </div>

            {/* Infrastructure Highlights */}
            <div className="container" style={{ marginBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff' }}>
                        Medical Infrastructure & Facilities
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                        State-of-the-art diagnostic and clinical equipment designed for patient comfort and surgical precision.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {INFRASTRUCTURE.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: '16px',
                                    padding: '1.75rem',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: '#e0f2fe',
                                        color: '#0284c7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.25rem'
                                    }}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                                        {item.desc}
                                    </p>
                                </div>
                                <div style={{
                                    marginTop: '1.5rem',
                                    paddingTop: '0.75rem',
                                    borderTop: '1px solid #f1f5f9',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    color: '#059669',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                }}>
                                    <CheckCircle2 size={14} />
                                    <span>{item.highlight}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Accreditations Banner */}
            <div className="container">
                <div style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                            Quality & Safety Accreditations
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                            {ACCREDITATIONS.map((acc, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                    <ShieldCheck size={18} color="#34d399" />
                                    <span>{acc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link to="/patient">
                        <button style={{
                            padding: '0.85rem 1.75rem',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                            color: '#ffffff',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                        }}>
                            <span>Find a Specialist</span>
                            <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>
            </div>
            </div>
        </div>
    );
};

export default About;
