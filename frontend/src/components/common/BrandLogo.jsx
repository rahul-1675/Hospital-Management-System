import React from 'react';
import { Link } from 'react-router-dom';
import prohealthLogo from '../../assets/prohealth-logo.svg';

export const BrandLogo = ({
    size = 'md',
    className = '',
    href = '/',
    style = {},
    imgStyle = {},
    onClick
}) => {
    // Map preset sizes to heights
    const sizeMap = {
        xs: 32,
        sm: 40,
        md: 50,
        lg: 64,
        xl: 84
    };

    const height = typeof size === 'number' ? size : (sizeMap[size] || 50);

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
                ...imgStyle
            }}
            loading="eager"
        />
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
                {imageElement}
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
            {imageElement}
        </div>
    );
};

export default BrandLogo;
