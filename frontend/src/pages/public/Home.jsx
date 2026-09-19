import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Shield, Users, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import HomeBg from '../../assets/Home.png';

const Home = () => {
    return (
        <div style={{
            paddingBottom: '4rem',
            backgroundImage: `url(${HomeBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            backgroundAttachment: 'fixed'
        }}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
                        Next-Gen Hospital Management System
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 1, maxWidth: '600px', margin: '0 auto 2.5rem', color: '#f1f5f9', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        Streamline operations, enhance patient care, and manage your facility with intelligence and precision.
                    </p>
                    <div className="flex justify-center gap-md" style={{ gap: '1rem' }}>
                        <Link to="/patient">
                            <Button className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary-color)', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Book Appointment <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button className="btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
                <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)' }}>
                        <div style={{ width: '60px', height: '60px', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Users size={32} color="var(--primary-color)" />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Patient Management</h3>
                        <p>Complete digital records, history tracking, and seamless admission processes.</p>
                    </div>
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)' }}>
                        <div style={{ width: '60px', height: '60px', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Calendar size={32} color="var(--primary-color)" />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Smart Scheduling</h3>
                        <p>Efficient appointment booking, doctor shifting, and queue management systems.</p>
                    </div>
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)' }}>
                        <div style={{ width: '60px', height: '60px', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Shield size={32} color="var(--primary-color)" />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Secure Data</h3>
                        <p>Top-tier encryption and role-based access control to keep medical data safe.</p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="container" style={{ marginTop: '5rem' }}>
                <div className="grid grid-cols-4" style={{ textAlign: 'center', gap: '2rem' }}>
                    <div>
                        <h4 style={{ fontSize: '2.5rem', color: '#38bdf8', marginBottom: '0.5rem', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>500+</h4>
                        <p style={{ fontWeight: 800, color: '#38bdf8', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '1.1rem' }}>Hospitals</p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '2.5rem', color: '#38bdf8', marginBottom: '0.5rem', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>10k+</h4>
                        <p style={{ fontWeight: 800, color: '#38bdf8', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '1.1rem' }}>Doctors</p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '2.5rem', color: '#38bdf8', marginBottom: '0.5rem', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>1M+</h4>
                        <p style={{ fontWeight: 800, color: '#38bdf8', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '1.1rem' }}>Patients</p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '2.5rem', color: '#38bdf8', marginBottom: '0.5rem', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>24/7</h4>
                        <p style={{ fontWeight: 800, color: '#38bdf8', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '1.1rem' }}>Support</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
