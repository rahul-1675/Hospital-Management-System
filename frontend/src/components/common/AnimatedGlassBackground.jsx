import React, { useEffect, useRef } from 'react';
import { createGlassParticleField } from '../../shaders/animated-top-dock/glassParticleField';

export const AnimatedGlassBackground = ({
    isFixed = true,
    opacity = 0.95,
    particles = 18,
    thickness = 0.115,
    dispersion = 0.05,
    specular = 0.85,
    rim = 0.50,
    drift = 0.65,
    className = ''
}) => {
    const hostRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const host = hostRef.current;
        const canvas = canvasRef.current;
        if (!host || !canvas) return;

        // Check prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Responsive particle count optimization for mobile devices
        const isMobile = window.innerWidth < 768;
        const effectiveParticleCount = isMobile ? Math.min(particles, 10) : particles;
        const effectiveDrift = prefersReducedMotion ? 0 : drift;

        const options = {
            count: effectiveParticleCount,
            thickness,
            dispersion,
            specular,
            rim,
            drift: effectiveDrift,
        };

        const field = createGlassParticleField(canvas, () => options);

        let frame = 0;
        let visible = true;
        let bounds = host.getBoundingClientRect();

        const resize = () => {
            if (!host) return;
            bounds = host.getBoundingClientRect();
            field.resize(bounds.width, bounds.height);
        };

        const tick = (now) => {
            if (!visible || document.hidden) {
                frame = 0;
                return;
            }
            field.resize(bounds.width, bounds.height);
            field.render(now);
            if (!prefersReducedMotion) {
                frame = requestAnimationFrame(tick);
            }
        };

        const onPointerMove = (event) => {
            field.setPointer?.(
                ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1,
                -((((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2) - 1)
            );
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        const intersectionObserver = new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? true;
            if (visible && !frame && !prefersReducedMotion) {
                frame = requestAnimationFrame(tick);
            } else if (!visible && frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        });
        intersectionObserver.observe(host);

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        
        resize();
        if (prefersReducedMotion) {
            // Render one static frame
            field.render(performance.now());
        } else {
            frame = requestAnimationFrame(tick);
        }

        return () => {
            if (frame) cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            field.dispose();
        };
    }, [particles, thickness, dispersion, specular, rim, drift]);

    return (
        <div
            ref={hostRef}
            style={{
                position: isFixed ? 'fixed' : 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                opacity: opacity,
            }}
            className={`glass-bead-background ${className}`.trim()}
            aria-hidden="true"
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
};

export default AnimatedGlassBackground;
