import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, PhoneCall, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import BrandLogo from './BrandLogo';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/patient', label: 'Find Doctors' },
        { path: '/about', label: 'About HMS' },
        { path: '/feedback', label: 'Patient Reviews' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 999,
            transition: 'all 0.3s ease',
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: isScrolled ? '1px solid rgba(2, 132, 199, 0.15)' : '1px solid #e2e8f0',
            boxShadow: isScrolled ? '0 10px 25px -5px rgba(15, 23, 42, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            {/* Top Micro-Bar for Emergency Status */}
            <div style={{
                background: '#ffffff',
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '600'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="pulse-indicator" style={{ backgroundColor: '#10b981' }}></span>
                        <span style={{ color: '#0f172a' }}>24/7 Emergency Admissions Open</span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span style={{ color: '#0284c7' }}>Average ER Wait: &lt; 8 mins</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <a href="tel:8001234567" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>
                            <PhoneCall size={13} color="#0284c7" />
                            <span>Emergency: (800) 123-4567</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '70px'
            }}>
                {/* Official Brand Logo */}
                <BrandLogo size={52} href="/" />

                {/* Desktop Navigation Links */}
                <nav className="hidden md-flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.92rem',
                                fontWeight: isActive(link.path) ? '700' : '600',
                                color: isActive(link.path) ? '#0284c7' : '#475569',
                                background: isActive(link.path) ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(link.path)) e.currentTarget.style.color = '#0284c7';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(link.path)) e.currentTarget.style.color = '#475569';
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link to="/patient">
                        <button className="btn btn-outline" style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.88rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            borderColor: '#0284c7',
                            color: '#0284c7',
                            fontWeight: '600'
                        }}>
                            <Stethoscope size={15} />
                            <span>Book Visit</span>
                        </button>
                    </Link>

                    {user ? (
                        <Link to="/portal">
                            <button className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem', borderRadius: '8px' }}>
                                <UserCheck size={16} />
                                <span>Portal ({user.role})</span>
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <button className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem', borderRadius: '8px' }}>
                                <ShieldCheck size={16} />
                                <span>Staff Login</span>
                            </button>
                        </Link>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none',
                            padding: '0.4rem',
                            color: '#0f172a'
                        }}
                        className="mobile-toggle"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #e2e8f0',
                    padding: '1rem 1.5rem 1.5rem',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    color: isActive(link.path) ? '#0284c7' : '#334155',
                                    background: isActive(link.path) ? '#f0f9ff' : 'transparent'
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
