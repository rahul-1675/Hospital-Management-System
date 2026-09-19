import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, AlertCircle, LogOut, KeyRound } from 'lucide-react';
import Button from '../../components/common/Button';
import { CREDENTIALS } from '../../services/auth.service';
import LoginBg from '../../assets/LoginBg.png';

const DEMO_ROLES = [
    { key: 'doctor', label: 'Doctor', id: 'DOC001', pass: 'doc@123', color: '#0284c7' },
    { key: 'receptionist', label: 'Receptionist', id: 'REC001', pass: 'rec@123', color: '#0d9488' },
    { key: 'pharmacy', label: 'Pharmacy', id: 'PHA001', pass: 'pha@123', color: '#16a34a' },
    { key: 'staff', label: 'Staff', id: 'STF001', pass: 'stf@123', color: '#d97706' },
    { key: 'admin', label: 'Admin', id: 'ADM001', pass: 'admin@123', color: '#9333ea' }
];

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form State
    const [role, setRole] = useState('doctor');
    const [id, setId] = useState('DOC001');
    const [password, setPassword] = useState('doc@123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const selectDemoRole = (demo) => {
        setRole(demo.key);
        setId(demo.id);
        setPassword(demo.pass);
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(role, id, password);

        if (result.success) {
            const normalizedRole = result.role;

            switch (normalizedRole) {
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
                case "ADMIN":
                    navigate("/portal/admin");
                    break;
                default:
                    navigate("/unauthorized");
            }
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper" style={{ backgroundImage: `url(${LoginBg})` }}>
            <div className="login-glass-card" style={{ maxWidth: '440px', width: '100%' }}>
                {/* Header Section */}
                <div className="login-header">
                    <h1 className="login-brand">ProHealth HMS</h1>
                    <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>Hospital Management Portal</p>
                </div>

                {/* Quick Demo Credentials Pill Selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', color: '#475569', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <KeyRound size={13} />
                        <span>Quick Demo Logins</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {DEMO_ROLES.map((d) => (
                            <button
                                key={d.key}
                                type="button"
                                onClick={() => selectDemoRole(d)}
                                style={{
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    border: role === d.key ? `1.5px solid ${d.color}` : '1px solid #e2e8f0',
                                    background: role === d.key ? `${d.color}15` : '#ffffff',
                                    color: role === d.key ? d.color : '#64748b',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Select Role</label>
                        <select
                            value={role}
                            onChange={(e) => {
                                const newRole = e.target.value;
                                setRole(newRole);
                                const cred = CREDENTIALS[newRole];
                                if (cred) {
                                    setId(cred.id);
                                    setPassword(cred.password);
                                }
                            }}
                            className="form-select"
                        >
                            <option value="doctor">Doctor</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">User ID</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="e.g. DOC001"
                                className="form-input"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        loadingText="Authenticating..."
                        className="login-btn"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        Login to Dashboard
                    </Button>
                </form>

                {/* Footer Section */}
                <div className="login-footer">
                    <div className="security-notice">
                        <Lock size={12} />
                        Authorized Personnel Only • 256-bit Encryption
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="btn-ghost"
                    >
                        <LogOut size={14} />
                        Exit to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
