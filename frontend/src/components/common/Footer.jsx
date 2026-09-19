import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Clock, Award, ArrowUpRight, Activity } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Footer = () => {
    return (
        <footer style={{
            position: 'relative',
            zIndex: 20,
            backgroundColor: '#ffffff',
            color: '#0f172a',
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.05)',
            paddingTop: '4.5rem',
            paddingBottom: '2.5rem',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
                {/* 4-Column Main Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3.5rem'
                }}>
                    {/* Column 1: Brand & Mission */}
                    <div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <BrandLogo size={50} href="/" />
                        </div>

                        <p style={{
                            color: '#475569',
                            fontSize: '0.92rem',
                            lineHeight: '1.65',
                            marginBottom: '1.5rem',
                            fontWeight: 400
                        }}>
                            Next-generation Hospital Management System engineered to elevate clinical precision, streamline multi-specialty queues, and deliver connected healthcare.
                        </p>

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            color: '#0284c7',
                            fontSize: '0.82rem',
                            fontWeight: '700'
                        }}>
                            <Award size={15} />
                            <span>NABH & JCI Accredited Hospital</span>
                        </div>
                    </div>

                    {/* Column 2: Patient Services */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></span>
                            <h4 style={{ color: '#0f172a', fontSize: '1.05rem', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>
                                Patient Services
                            </h4>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <li>
                                <Link
                                    to="/patient"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Find a Specialist</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/patient/form"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Book OPD Appointment</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/feedback"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Patient Reviews & Ratings</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Hospital Infrastructure & ICUs</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Medical Portals */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></span>
                            <h4 style={{ color: '#0f172a', fontSize: '1.05rem', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>
                                Clinical Portals
                            </h4>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <li>
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Doctor Console</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Receptionist & Queue Desk</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Pharmacy & Dispensary</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#334155',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <span>Executive Administration</span>
                                    <ArrowUpRight size={14} color="#0284c7" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Emergency & Contact */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                            <h4 style={{ color: '#0f172a', fontSize: '1.05rem', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>
                                Emergency & Help Desk
                            </h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.45rem',
                                    borderRadius: '8px',
                                    background: '#f0f9ff',
                                    color: '#0284c7',
                                    border: '1px solid #bae6fd',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={16} />
                                </div>
                                <span style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: 500 }}>
                                    123 Health Avenue, Medical District, NY 10001
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.45rem',
                                    borderRadius: '8px',
                                    background: '#f0f9ff',
                                    color: '#0284c7',
                                    border: '1px solid #bae6fd',
                                    flexShrink: 0
                                }}>
                                    <Phone size={16} />
                                </div>
                                <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>
                                    +1 (800) 123-4567 / (800) 911-ER
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.45rem',
                                    borderRadius: '8px',
                                    background: '#f0f9ff',
                                    color: '#0284c7',
                                    border: '1px solid #bae6fd',
                                    flexShrink: 0
                                }}>
                                    <Mail size={16} />
                                </div>
                                <span style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 500 }}>
                                    care@prohealth-hms.com
                                </span>
                            </div>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                background: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                color: '#059669',
                                fontSize: '0.85rem',
                                fontWeight: '700'
                            }}>
                                <Clock size={15} />
                                <span>24/7 Trauma & Emergency Center Open</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Compliance */}
                <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    fontSize: '0.88rem',
                    color: '#64748b'
                }}>
                    <p style={{ margin: 0, color: '#475569', fontWeight: 500 }}>
                        © {new Date().getFullYear()} ProHealth Hospital Management System. All clinical rights reserved.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700 }}>
                            <ShieldCheck size={16} />
                            <span>HIPAA Certified & 256-Bit Encrypted</span>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700 }}>
                            <Activity size={16} />
                            <span>Real-Time Cloud Sync</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
