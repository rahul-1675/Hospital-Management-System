import React from 'react';
import { Link } from 'react-router-dom';
import prohealthLogo from '../../assets/prohealth-logo.svg';

export const BrandLogo = ({
    size = 'md',
    showTitle = true,
    title = 'ProHealth',
    subtitle = 'Hospital System',
    className = '',
    href = '/',
    style = {},
    imgStyle = {},
    titleStyle = {},
    onClick
}) => {
    // Map preset sizes to heights
    const sizeMap = {
        xs: 32,
        sm: 40,
        md: 48,
        lg: 58,
        xl: 72
    };

    const height = typeof size === 'number' ? size : (sizeMap[size] || 48);
    const titleFontSize = Math.max(16, Math.round(height * 0.44));
    const subtitleFontSize = Math.max(9, Math.round(height * 0.20));

    const imageElement = (
        <img
            src={prohealthLogo}
            alt="ProHealth Hospital System"
            style={{
                height: `${height}px`,
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
                flexShrink: 0,
                ...imgStyle
            }}
            loading="eager"
        />
    );

    const titleElement = showTitle && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.15, ...titleStyle }}>
            <span style={{
                fontSize: `${titleFontSize}px`,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
            }}>
                Pro<span style={{ color: '#0284c7' }}>Health</span>
            </span>
            {subtitle && (
                <span style={{
                    fontSize: `${subtitleFontSize}px`,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                    marginTop: '2px',
                    fontFamily: "'Inter', sans-serif"
                }}>
                    {subtitle}
                </span>
            )}
        </div>
    );

    const content = (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: `${Math.max(8, Math.round(height * 0.22))}px` }}>
            {imageElement}
            {titleElement}
        </div>
    );

    if (href) {
        return (
            <Link
                to={href}
                className={`brand-logo-link ${className}`.trim()}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    ...style
                }}
                onClick={onClick}
                aria-label="ProHealth Hospital System Home"
            >
                {content}
            </Link>
        );
    }

    return (
        <div
            className={`brand-logo-container ${className}`.trim()}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                ...style
            }}
        >
            {content}
        </div>
    );
};

export default BrandLogo;

