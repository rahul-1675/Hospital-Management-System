import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
    title = 'No Data Available',
    message = 'There are no items to display at the moment.',
    icon: Icon = PackageOpen,
    actionLabel,
    onAction,
    height = '300px'
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: height,
            textAlign: 'center',
            padding: '2rem',
            background: 'white',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1'
        }}>
            <div style={{
                background: '#f1f5f9',
                padding: '1rem',
                borderRadius: '50%',
                marginBottom: '1rem',
                color: '#94a3b8'
            }}>
                <Icon size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px' }}>{message}</p>

            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
