import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, AlertCircle, ShieldCheck, Mail, KeyRound, Eye, EyeOff, Building2, UserPlus, Clock } from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import Button from '../../components/common/Button';
import LoginBg from '../../assets/LoginBg.png';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, isAuthenticated } = useAuth();

    // Form State
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-redirect if already authenticated (fixes unintentional logout experience)
    useEffect(() => {
        if (isAuthenticated && user) {
            const redirectPath = location.state?.redirect || location.state?.from?.pathname || location.state?.from;
            if (redirectPath) {
                navigate(redirectPath, { replace: true });
                return;
            }

            const normalizedRole = (user.role || '').toUpperCase();
            switch (normalizedRole) {
                case 'ADMIN':
                    navigate('/portal/admin', { replace: true });
                    break;
                case 'DOCTOR':
                    navigate('/portal/doctor', { replace: true });
                    break;
                case 'RECEPTION':
                case 'RECEPTIONIST':
                    navigate('/portal/receptionist', { replace: true });
                    break;
                case 'PHARMACY':
                    navigate('/portal/pharmacy', { replace: true });
                    break;
                case 'STAFF':
                    navigate('/portal/staff', { replace: true });
                    break;
                case 'PATIENT':
                    navigate('/patient', { replace: true });
                    break;
                default:
                    navigate('/portal', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, location.state]);

    const from = location.state?.from?.pathname || null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!identifier.trim() || !password) {
            setError('Please enter your Staff ID / Email and password.');
            return;
        }

        setLoading(true);

        const result = await login(identifier.trim(), password);

        if (result.success) {
            const redirectPath = location.state?.redirect || location.state?.from?.pathname || location.state?.from;
            if (redirectPath) {
                navigate(redirectPath, {
                    replace: true,
                    state: location.state
                });
                return;
            }

            const normalizedRole = (result.role || '').toUpperCase();
            switch (normalizedRole) {
                case "ADMIN":
                case "ADMINISTRATOR":
                    navigate("/portal/admin");
                    break;
                case "DOCTOR":
                case "DOC":
                    navigate("/portal/doctor");
                    break;
                case "RECEPTION":
                case "RECEPTIONIST":
                    navigate("/portal/receptionist");
                    break;
                case "PHARMACY":
                case "PHARMACIST":
                    navigate("/portal/pharmacy");
                    break;
                case "STAFF":
                case "NURSE":
                case "WARD":
                    navigate("/portal/staff");
                    break;
                case "PATIENT":
                    navigate("/patient");
                    break;
                default:
                    navigate("/");
            }
        } else {
            setError(result.error || 'Authentication failed. Please verify your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper" style={{ backgroundImage: `url(${LoginBg})` }}>
            <div className="login-glass-card" style={{ maxWidth: '450px', width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)' }}>
                {/* Official Brand Logo */}
                <div className="login-header" style={{ textAlign: 'center', marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <BrandLogo size={68} href="/" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Welcome to ProHealth
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0.35rem 0 0', fontWeight: 500 }}>
                        Unified Clinical & Staff Portal Login
                    </p>
                </div>

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

                {/* Login Form */}
                <form onSubmit={handleLogin} className="login-form" autoComplete="off">
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                            Email Address or Staff ID
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="username"
                                id="login-identifier"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Enter your email or Staff ID"
                                required
                                autoComplete="off"
                                className="form-input"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '10px',
                                    border: '1.5px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <Mail
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="login-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="new-password"
                                className="form-input"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                                    borderRadius: '10px',
                                    border: '1.5px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <Lock
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#94a3b8',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={loading}
                        loadingText="Authenticating..."
                        style={{
                            width: '100%',
                            padding: '0.85rem',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '1rem'
                        }}
                    >
                        Sign In to Portal
                    </Button>
                </form>

                {/* Register Link */}
                <div style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.88rem',
                    color: '#64748b'
                }}>
                    Need a new account?{' '}
                    <Link to="/register" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
                        Register for access
                    </Link>
                </div>

                {/* Footer Security Notice */}
                <div style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid #f1f5f9',
                    color: '#94a3b8',
                    fontSize: '0.78rem'
                }}>
                    <span>Protected by end-to-end encryption & role-based access controls</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
