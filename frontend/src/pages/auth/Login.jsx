import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, AlertCircle, ShieldCheck, Mail, KeyRound, Eye, EyeOff, Building2 } from 'lucide-react';
import Button from '../../components/common/Button';
import LoginBg from '../../assets/LoginBg.png';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Form State
    const [role, setRole] = useState('admin');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!identifier.trim() || !password) {
            setError('Please enter your Staff ID / Email and password.');
            return;
        }

        setLoading(true);

        const result = await login(role, identifier.trim(), password);

        if (result.success) {
            const redirectPath = location.state?.redirect || location.state?.from?.pathname || location.state?.from;
            if (redirectPath) {
                navigate(redirectPath, {
                    replace: true,
                    state: location.state
                });
                return;
            }

            const normalizedRole = result.role;
            switch (normalizedRole) {
                case "ADMIN":
                    navigate("/portal/admin");
                    break;
                case "DOCTOR":
                    navigate("/portal/doctor");
                    break;
                case "RECEPTION":
                case "RECEPTIONIST":
                    navigate("/portal/receptionist");
                    break;
                case "PHARMACY":
                    navigate("/portal/pharmacy");
                    break;
                case "STAFF":
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
            <div className="login-glass-card" style={{ maxWidth: '440px', width: '100%' }}>
                {/* Header Section */}
                <div className="login-header" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: '#ffffff',
                        boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)'
                    }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="login-brand" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        ProHealth HMS
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.4rem 0 0' }}>
                        Authorized Staff & Management Portal
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
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                            Access Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setError('');
                            }}
                            className="form-select"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: '1.5px solid #cbd5e1',
                                fontSize: '0.95rem',
                                color: '#1e293b',
                                outline: 'none'
                            }}
                        >
                            <option value="admin">Administrator</option>
                            <option value="doctor">Doctor</option>
                            <option value="receptionist">Receptionist / Front Desk</option>
                            <option value="pharmacy">Pharmacist</option>
                            <option value="staff">Clinical / Support Staff</option>
                            <option value="patient">Patient Account</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                            Staff ID or Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder={role === 'admin' ? 'admin@hms.com or ADM001' : 'Enter your registered email / ID'}
                                required
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter secure password"
                                required
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

                {/* Footer Security Notice */}
                <div style={{
                    marginTop: '2rem',
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
