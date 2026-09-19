import React from 'react';

const Skeleton = ({ width, height, borderRadius = '4px', style, className = '' }) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius: borderRadius,
                backgroundColor: '#e2e8f0',
                ...style // Allow overrides
            }}
        >
            <style>{`
                .skeleton {
                    animation: pulse 1.5s infinite ease-in-out;
                }
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default Skeleton;
