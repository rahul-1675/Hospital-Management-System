import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Heart, Clock, Award } from 'lucide-react';
import HmsLogo from '../../assets/hms-logo.png';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '4rem',
            paddingBottom: '2rem',
            marginTop: 'auto'
        }}>
            <div className="container">
                {/* 4-Column Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '3rem'
                }}>
                    {/* Brand & About */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img src={HmsLogo} alt="HMS" style={{ height: '22px' }} />
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                                Pro<span style={{ color: '#38bdf8' }}>Health</span> HMS
                            </span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            State-of-the-art Hospital Management System engineered to elevate clinical precision, streamline departmental queues, and empower patient-first care.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem' }}>
                            <Award size={16} />
                            <span>NABH & JCI Accredited Facility</span>
                        </div>
                    </div>

                    {/* Patient Quick Links */}
                    <div>
                        <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>
                            Patient Services
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            <li>
                                <Link to="/patient" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Find a Specialist
                                </Link>
                            </li>
                            <li>
                                <Link to="/patient/form" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Book OPD Appointment
                                </Link>
                            </li>
                            <li>
                                <Link to="/feedback" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Patient Experience & Reviews
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Hospital Infrastructure
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Staff Portals */}
                    <div>
                        <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>
                            Staff Portals
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            <li>
                                <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Doctor Clinical Console
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Receptionist Queue Manager
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Pharmacy & Inventory Hub
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.9rem' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                                    Hospital Administration
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Emergency & Address */}
                    <div>
                        <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>
                            Emergency & Contact
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                <MapPin size={18} color="#38bdf8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                                <span>123 Health Avenue, Medical District, NY 10001</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                <Phone size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                                <span>+1 (800) 123-4567 / (800) 911-ER</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                <Mail size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                                <span>care@prohealth-hms.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                <Clock size={18} color="#10b981" style={{ flexShrink: 0 }} />
                                <span style={{ color: '#10b981', fontWeight: '600' }}>24/7 Trauma & Emergency</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '1.75rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    fontSize: '0.85rem',
                    color: '#64748b'
                }}>
                    <p style={{ margin: 0 }}>
                        © {new Date().getFullYear()} ProHealth Hospital Management System. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <ShieldCheck size={14} color="#10b981" /> HIPAA Compliant & Secure
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
