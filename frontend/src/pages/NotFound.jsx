import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
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
                background: '#f1f5f9',
                borderRadius: '50%',
                padding: '1.5rem',
                color: '#64748b',
                marginBottom: '1.5rem'
            }}>
                <FileQuestion size={64} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Page Not Found</h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2rem', maxWidth: '500px' }}>
                We couldn't assign a route to this URL. The page you are looking for might have been moved or deleted.
            </p>
            <Button onClick={() => navigate('/')} variant="primary">
                <Home size={18} /> Go Home
            </Button>
        </div>
    );
};

export default NotFound;
