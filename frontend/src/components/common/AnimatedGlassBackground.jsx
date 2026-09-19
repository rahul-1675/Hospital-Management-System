import React from 'react';
import { AnimatedTopDock } from '../../shaders/animated-top-dock/AnimatedTopDock';

export const AnimatedGlassBackground = ({ isFixed = true, opacity = 1, className = '' }) => {
    return (
        <div
            style={{
                position: isFixed ? 'fixed' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                opacity: opacity
            }}
            className={`shader-frame ${className}`.trim()}
            aria-hidden="true"
        >
            <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                <AnimatedTopDock
                    variant="glass"
                    particles={22}
                    thickness={0.115}
                    dispersion={0.050}
                    specular={0.85}
                    rim={0.50}
                    drift={1.00}
                    proximity={44}
                    heightGrowth={20}
                    drop={11.0}
                />
            </div>
        </div>
    );
};

export default AnimatedGlassBackground;
