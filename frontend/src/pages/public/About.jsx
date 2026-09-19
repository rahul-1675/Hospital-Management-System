import React from 'react';
import HomeBg from '../../assets/Home.png';

const About = () => {
    return (
        <div className="about-wrapper" style={{
            backgroundImage: `url(${HomeBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            backgroundAttachment: 'fixed',
            paddingBottom: '2rem'
        }}>
            {/* Hero Section */}
            <div className="landing-hero">
                <div className="hero-content">
                    <span className="hero-badge">Next-Gen Hospitality</span>
                    <h1 className="hero-title">
                        Healthcare Reimagined for <br />
                        <span className="highlight">Efficiency & Care</span>
                    </h1>
                    <p className="hero-subtitle">
                        Empowering medical professionals with a unified, intelligent platform that streamlines operations so you can focus on what matters most—saving lives.
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Floating Stats Strip */}
                <div className="stats-strip-container">
                    <div className="stats-strip">
                        <div className="stat-block">
                            <div className="stat-number">98%</div>
                            <div className="stat-label">Patient Satisfaction</div>
                        </div>
                        <div className="stat-block">
                            <div className="stat-number">30%</div>
                            <div className="stat-label">Reduced Wait Time</div>
                        </div>
                        <div className="stat-block">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">System Uptime</div>
                        </div>
                        <div className="stat-block">
                            <div className="stat-number">15k+</div>
                            <div className="stat-label">Patients Recovered</div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="section-header">
                    <h2 className="section-title">Built for Modern Healthcare</h2>
                    <p className="hero-subtitle" style={{ fontSize: '1.1rem' }}>
                        A suite of powerful tools designed to reduce administrative friction and enhance clinical outcomes.
                    </p>
                </div>

                <div className="modern-grid">
                    {/* Feature 1 */}
                    <div className="premium-card">
                        <div className="card-icon" style={{ backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand-primary)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h3 className="card-title">Bank-Grade Security</h3>
                        <p className="card-desc">
                            Role-based access control (RBAC) and end-to-end encryption ensure sensitive patient data remains compliant and secure at all times.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="premium-card">
                        <div className="card-icon" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        </div>
                        <h3 className="card-title">Real-Time Vitals</h3>
                        <p className="card-desc">
                            Live dashboards provide instant insights into occupancy, resource allocation, and patient status, enabling faster decision-making.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="premium-card">
                        <div className="card-icon" style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                            </svg>
                        </div>
                        <h3 className="card-title">Patient Centricity</h3>
                        <p className="card-desc">
                            From seamless admissions to digital records, every feature is crafted to improve the patient journey and satisfaction scores.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
