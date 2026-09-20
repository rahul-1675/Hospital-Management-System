import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { Lock, AlertCircle, ShieldCheck, Mail, User, Phone, Eye, EyeOff, Clock } from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import Button from '../../components/common/Button';
import LoginBg from '../../assets/LoginBg.png';

const Register = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // If already logged in, redirect
    useEffect(() => {
        if (isAuthenticated && user) {
            const role = (user.role || '').toUpperCase();
            if (role === 'ADMIN') navigate('/portal/admin', { replace: true });
            else if (role === 'DOCTOR') navigate('/portal/doctor', { replace: true });
            else if (role === 'RECEPTIONIST' || role === 'RECEPTION') navigate('/portal/receptionist', { replace: true });
            else if (role === 'PHARMACY') navigate('/portal/pharmacy', { replace: true });
            else if (role === 'STAFF') navigate('/portal/staff', { replace: true });
            else navigate('/patient', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'patient',
        department: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [submittedUser, setSubmittedUser] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
            setError('Please fill in all required fields: Full Name, Email, Phone Number, and Password.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please re-enter.');
            return;
        }

        setLoading(true);

        try {
            const res = await authService.register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                role: formData.role,
                department: formData.department.trim() || (formData.role === 'patient' ? 'Patient' : 'General Care'),
                password: formData.password
            });

            if (res.success) {
                setSubmittedUser(res.user || { name: formData.name, email: formData.email, role: formData.role });
                setRegistrationSuccess(true);
            } else {
                setError(res.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Registration request could not be processed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isPatientRole = (submittedUser?.role || formData.role).toLowerCase() === 'patient';

    return (
        <div className="login-wrapper" style={{ backgroundImage: `url(${LoginBg})`, minHeight: '100vh', padding: '2.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="login-glass-card" style={{ maxWidth: '520px', width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)' }}>
                {/* Official Brand Logo */}
                <div className="login-header" style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <BrandLogo size={58} href="/" style={{ marginBottom: '0.75rem' }} />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Create ProHealth Account
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.35rem 0 0', fontWeight: 500 }}>
                        Register for clinical portal or patient care access
                    </p>
                </div>

                {registrationSuccess ? (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            border: '2px solid #bae6fd'
                        }}>
                            <Clock size={32} />
                        </div>

                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.85rem',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '99px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            marginBottom: '1rem'
                        }}>
                            <Clock size={13} /> {isPatientRole ? 'PENDING RECEPTION APPROVAL' : 'PENDING ADMIN APPROVAL'}
                        </span>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.6rem' }}>
                            Registration Submitted!
                        </h3>
                        
                        <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.55, margin: '0 0 1.5rem' }}>
                            Thank you, <strong>{submittedUser?.name}</strong>. Your account registration for the role of <strong>{(submittedUser?.role || formData.role).toUpperCase()}</strong> has been submitted.
                        </p>

                        <div style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '1rem',
                            textAlign: 'left',
                            fontSize: '0.85rem',
                            color: '#334155',
                            marginBottom: '1.75rem',
                            lineHeight: 1.5
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0284c7', marginBottom: '0.35rem' }}>
                                <ShieldCheck size={16} /> Security & Verification Protocol
                            </div>
                            <span>
                                {isPatientRole
                                    ? 'In compliance with hospital patient intake standards, your patient profile will be reviewed and activated by the Reception Desk before online portal access is granted.'
                                    : 'In compliance with hospital security standards, all clinical and staff accounts must be verified and activated by a Hospital Administrator before login permissions are granted.'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="primary" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', fontWeight: 700 }}>
                                    Proceed to Sign In
                                </Button>
                            </Link>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <Button variant="outline" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', fontWeight: 600 }}>
                                    Return to Home Page
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Error Message */}
                        {error && (
                            <div className="error-message" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.85rem 1rem',
                                borderRadius: '10px',
                                background: '#fef2f2',
                                border: '1px solid #fee2e2',
                                color: '#b91c1c',
                                fontSize: '0.88rem',
                                marginBottom: '1.25rem'
                            }}>
                                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="login-form" autoComplete="off">
                            {/* Full Name */}
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Full Name *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Dr. John Doe or Jane Smith"
                                        required
                                        className="form-input"
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                                            borderRadius: '10px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.9rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <User size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Email Address *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        required
                                        className="form-input"
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                                            borderRadius: '10px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.9rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                </div>
                            </div>

                            {/* Role and Department row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div>
                                    <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Account Role *
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 0.75rem',
                                            borderRadius: '10px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.88rem',
                                            boxSizing: 'border-box',
                                            background: '#ffffff',
                                            fontWeight: 600,
                                            color: '#0f172a'
                                        }}
                                    >
                                        <option value="patient">Patient</option>
                                        <option value="doctor">Doctor / Physician</option>
                                        <option value="receptionist">Receptionist</option>
                                        <option value="pharmacy">Pharmacist</option>
                                        <option value="staff">Hospital Staff</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Department / Dept
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder={formData.role === 'doctor' ? 'e.g. Cardiology' : 'e.g. Front Desk'}
                                        className="form-input"
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 0.75rem',
                                            borderRadius: '10px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.88rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        required
                                        className="form-input"
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                                            borderRadius: '10px',
                                            border: '1.5px solid #cbd5e1',
                                            fontSize: '0.9rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <Phone size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                </div>
                            </div>

                            {/* Password Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Password *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min. 6 chars"
                                            required
                                            className="form-input"
                                            style={{
                                                width: '100%',
                                                padding: '0.7rem 2rem 0.7rem 2.2rem',
                                                borderRadius: '10px',
                                                border: '1.5px solid #cbd5e1',
                                                fontSize: '0.88rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Confirm Password *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Repeat password"
                                            required
                                            className="form-input"
                                            style={{
                                                width: '100%',
                                                padding: '0.7rem 1rem 0.7rem 2.2rem',
                                                borderRadius: '10px',
                                                border: '1.5px solid #cbd5e1',
                                                fontSize: '0.88rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Approval notice preview */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.65rem 0.85rem',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                color: '#64748b',
                                marginBottom: '1.5rem'
                            }}>
                                <Clock size={15} color="#0284c7" style={{ flexShrink: 0 }} />
                                <span>Note: New accounts require administrator approval before activation.</span>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                loadingText="Submitting Registration..."
                                style={{
                                    width: '100%',
                                    padding: '0.85rem',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '1rem'
                                }}
                            >
                                Submit Registration
                            </Button>
                        </form>

                        <div style={{
                            marginTop: '1.5rem',
                            textAlign: 'center',
                            fontSize: '0.88rem',
                            color: '#64748b'
                        }}>
                            Already have an approved account?{' '}
                            <Link to="/login" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
                                Sign in here
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
