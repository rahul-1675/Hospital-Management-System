import React from 'react';
import { HourglassSvg } from './Loader';

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
        width: style.width || 'auto',
        ...style
    };

    const variantStyles = {
        primary: {
            background: 'var(--color-brand-primary, #0284c7)',
            color: '#ffffff',
            borderColor: 'var(--color-brand-primary, #0284c7)'
        },
        success: {
            background: 'var(--color-success, #10b981)',
            color: '#ffffff',
            borderColor: 'var(--color-success, #10b981)'
        },
        warning: {
            background: 'var(--color-warning, #f59e0b)',
            color: '#ffffff',
            borderColor: 'var(--color-warning, #f59e0b)'
        },
        danger: {
            background: 'var(--color-danger, #ef4444)',
            color: '#ffffff',
            borderColor: 'var(--color-danger, #ef4444)'
        },
        outline: {
            background: 'transparent',
            color: 'var(--color-slate-700, #334155)',
            borderColor: 'var(--color-slate-300, #cbd5e1)'
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-slate-600, #475569)',
            borderColor: 'transparent'
        }
    };

    const combinedStyle = {
        ...baseStyle,
        ...variantStyles[variant],
        ...(isLoading ? { opacity: 0.85 } : {})
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
                    <HourglassSvg size={size === 'sm' ? '16px' : '20px'} />
                    <span>{loadingText}</span>
                </>
            ) : children}
        </button>
    );
};

export default Button;
