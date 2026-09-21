import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneCall, ShieldCheck, UserCheck, Stethoscope, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import BrandLogo from './BrandLogo';
import GooeyNav from '../ui/GooeyNav';
import { RectangleButtons } from '../../shaders/RectangleButtons';
import '../../shaders/threeui.css';

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

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Find Doctors", href: "/doctors" },
        { label: "About HMS", href: "/about" },
        { label: "Patient Reviews", href: "/reviews" }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        if (path === '/doctors') return location.pathname === '/doctors' || location.pathname === '/patient';
        if (path === '/reviews') return location.pathname === '/reviews' || location.pathname === '/feedback';
        return location.pathname === path || location.pathname.startsWith(path);
    };

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 999,
            transition: 'all 0.3s ease',
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: isScrolled ? '1px solid rgba(2, 132, 199, 0.15)' : '1px solid #e2e8f0',
            boxShadow: isScrolled ? '0 10px 25px -5px rgba(15, 23, 42, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            {/* Top Micro-Bar for Emergency Status */}
            <div style={{
                background: '#ffffff',
                color: '#0f172a',
                borderBottom: '1px solid #f1f5f9',
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
                height: '70px',
                gap: '1.5rem'
            }}>
                {/* Official Brand Logo */}
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <BrandLogo size={44} href="/" />
                </div>

                {/* Desktop Gooey Navigation */}
                <div className="hidden md-flex" style={{ alignItems: 'center', justifyContent: 'center', flex: '1 1 auto', margin: '0 1rem' }}>
                    <GooeyNav
                        items={navItems}
                        particleCount={15}
                        particleDistances={[90, 10]}
                        particleR={100}
                        initialActiveIndex={0}
                        animationTime={600}
                        timeVariance={300}
                        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                    />
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md-flex" style={{ alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    <Link to="/doctors">
                        <button className="btn btn-outline" style={{
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.85rem',
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
                        <Link to={(() => {
                            const role = (user.role || '').toUpperCase();
                            if (role === 'ADMIN') return '/portal/admin';
                            if (role === 'DOCTOR') return '/portal/doctor';
                            if (role === 'RECEPTION' || role === 'RECEPTIONIST') return '/portal/receptionist';
                            if (role === 'PHARMACY') return '/portal/pharmacy';
                            if (role === 'STAFF') return '/portal/staff';
                            return '/patient';
                        })()}>
                            <button className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}>
                                <UserCheck size={16} />
                                <span>{user.role === 'ADMIN' || user.role === 'admin' ? 'Admin Console' : `Portal (${user.role})`}</span>
                            </button>
                        </Link>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link to="/register">
                                <button className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px', color: '#0f172a', borderColor: '#cbd5e1' }}>
                                    <span>Register</span>
                                </button>
                            </Link>
                            <Link to="/login" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                                <RectangleButtons
                                    variant="floating-dots-cta"
                                    mode="dark"
                                    hue={0}
                                    saturation={1.00}
                                    brightness={1.00}
                                    style={{ width: '130px', height: '38px', borderRadius: '8px' }}
                                />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Right Controls: Compact Sign In + Hamburger */}
                <div className="mobile-toggle" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    {!user && (
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', borderRadius: '8px' }}>
                                Sign In
                            </button>
                        </Link>
                    )}
                    {user && (
                        <Link to={(() => {
                            const role = (user.role || '').toUpperCase();
                            if (role === 'ADMIN') return '/portal/admin';
                            if (role === 'DOCTOR') return '/portal/doctor';
                            if (role === 'RECEPTION' || role === 'RECEPTIONIST') return '/portal/receptionist';
                            if (role === 'PHARMACY') return '/portal/pharmacy';
                            if (role === 'STAFF') return '/portal/staff';
                            return '/patient';
                        })()}>
                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', borderRadius: '8px' }}>
                                Portal
                            </button>
                        </Link>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                        style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            padding: '0.45rem',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #e2e8f0',
                    padding: '1.25rem 1.25rem 1.5rem',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                    color: isActive(item.href) ? '#0284c7' : '#334155',
                                    background: isActive(item.href) ? '#f0f9ff' : 'transparent',
                                    textDecoration: 'none'
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.75rem 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                <button className="btn btn-outline" style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', borderRadius: '10px', borderColor: '#0284c7', color: '#0284c7', fontWeight: '700' }}>
                                    <Stethoscope size={16} />
                                    <span>Book Specialist Visit</span>
                                </button>
                            </Link>

                            {!user ? (
                                <>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                        <button className="btn btn-outline" style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', borderRadius: '10px', color: '#0f172a', borderColor: '#cbd5e1', fontWeight: '600' }}>
                                            Register Patient Account
                                        </button>
                                    </Link>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                        <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', borderRadius: '10px', fontWeight: '700' }}>
                                            <ShieldCheck size={16} />
                                            <span>Staff / Patient Sign In</span>
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <Link to={(() => {
                                    const role = (user.role || '').toUpperCase();
                                    if (role === 'ADMIN') return '/portal/admin';
                                    if (role === 'DOCTOR') return '/portal/doctor';
                                    if (role === 'RECEPTION' || role === 'RECEPTIONIST') return '/portal/receptionist';
                                    if (role === 'PHARMACY') return '/portal/pharmacy';
                                    if (role === 'STAFF') return '/portal/staff';
                                    return '/patient';
                                })()} onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', borderRadius: '10px', fontWeight: '700' }}>
                                        <UserCheck size={16} />
                                        <span>Open {user.role} Dashboard</span>
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
