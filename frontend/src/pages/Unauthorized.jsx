import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import Button from '../components/common/Button';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            textAlign: 'center'
        }}>
            <div style={{
                background: '#fee2e2',
                borderRadius: '50%',
                padding: '1.5rem',
                color: '#ef4444',
                marginBottom: '1.5rem'
            }}>
                <ShieldAlert size={64} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Access Denied</h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2rem', maxWidth: '500px' }}>
                You do not have the required permissions to access this specific portal. Please contact your administrator.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
                <Button onClick={() => navigate('/login')} variant="primary">Back to Login</Button>
            </div>
        </div>
    );
};

export default Unauthorized;
