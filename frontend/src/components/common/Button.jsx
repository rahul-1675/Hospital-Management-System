import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary', // primary, success, warning, danger, outline, ghost
    size = 'md', // sm, md, lg
    isLoading = false,
    loadingText = 'Loading...',
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    style = {}
}) => {

    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid transparent',
        outline: 'none',
        opacity: disabled ? 0.6 : 1,
        fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
        padding: size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem',
        ...style
    };

    const variants = {
        primary: {
            background: 'var(--doctor-primary, #0ea5e9)',
            color: 'white',
            borderColor: 'transparent',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        },
        success: {
            background: '#10b981',
            color: 'white',
            borderColor: 'transparent'
        },
        warning: {
            background: '#f59e0b',
            color: 'white',
            borderColor: 'transparent'
        },
        danger: {
            background: '#ef4444',
            color: 'white',
            borderColor: 'transparent'
        },
        outline: {
            background: 'white',
            color: '#1e293b',
            borderColor: '#e2e8f0'
        },
        ghost: {
            background: 'transparent',
            color: '#64748b',
            borderColor: 'transparent'
        }
    };

    const combinedStyle = {
        ...baseStyle,
        ...variants[variant],
        ...(isLoading ? { opacity: 0.8 } : {})
    };

    // Hover effect logic handled via CSS classes usually, but styles are inline in request context mostly.
    // For "Global UX Consistency", relying on the existing .action-btn classes if possible, or applying this component.

    return (
        <button
            type={type}
            className={`action-btn ${className}`}
            style={combinedStyle}
            onClick={onClick}
            disabled={disabled || isLoading}
            onMouseEnter={(e) => {
                if (!disabled && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }
            }}
        >
            {isLoading ? (
                <>
                    <Loader2 size={18} className="spin" />
                    <span>{loadingText}</span>
                </>
            ) : children}
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spin {
                        animation: spin 1s linear infinite;
                    }
                `}
            </style>
        </button>
    );
};

export default Button;
