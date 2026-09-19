import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe Animations for Hourglass
const rotateHourglass = keyframes`
    0%, 10% {
        transform: rotate(0deg);
    }
    45%, 55% {
        transform: rotate(180deg);
    }
    90%, 100% {
        transform: rotate(360deg);
    }
`;

const sandTop = keyframes`
    0%, 10% {
        transform: scaleY(1);
        opacity: 1;
    }
    45% {
        transform: scaleY(0);
        opacity: 0.8;
    }
    50% {
        transform: scaleY(0);
        opacity: 0;
    }
    55% {
        transform: scaleY(1);
        opacity: 1;
    }
    90% {
        transform: scaleY(0);
        opacity: 0.8;
    }
    95%, 100% {
        transform: scaleY(1);
        opacity: 1;
    }
`;

const sandBottom = keyframes`
    0%, 10% {
        transform: scaleY(0);
        opacity: 0.4;
    }
    45% {
        transform: scaleY(1);
        opacity: 1;
    }
    50% {
        transform: scaleY(1);
        opacity: 1;
    }
    55% {
        transform: scaleY(0);
        opacity: 0.4;
    }
    90% {
        transform: scaleY(1);
        opacity: 1;
    }
    95%, 100% {
        transform: scaleY(0);
        opacity: 0.4;
    }
`;

const sandStreamAnim = keyframes`
    0%, 5% {
        opacity: 0;
        stroke-dashoffset: 20;
    }
    10%, 42% {
        opacity: 1;
        stroke-dashoffset: 0;
    }
    45%, 55% {
        opacity: 0;
        stroke-dashoffset: -20;
    }
    60%, 88% {
        opacity: 1;
        stroke-dashoffset: 0;
    }
    92%, 100% {
        opacity: 0;
        stroke-dashoffset: 20;
    }
`;

const pulseGlow = keyframes`
    0%, 100% {
        filter: drop-shadow(0 0 8px rgba(2, 132, 199, 0.35));
    }
    50% {
        filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.65));
    }
`;

const LoaderWrapper = styled.div`
    --hue: 200;
    --primary: hsl(var(--hue), 95%, 45%);
    --primary-light: hsl(var(--hue), 90%, 65%);
    --primary-dark: hsl(var(--hue), 95%, 30%);
    --accent: hsl(188, 90%, 50%);
    --sand: hsl(var(--hue), 85%, 55%);
    --glass-edge: hsl(var(--hue), 60%, 80%);

    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    font-family: inherit;

    @media (prefers-color-scheme: dark) {
        --primary: hsl(var(--hue), 90%, 60%);
        --primary-light: hsl(var(--hue), 95%, 75%);
        --glass-edge: hsl(var(--hue), 40%, 60%);
    }
`;

const SvgContainer = styled.div`
    width: ${({ $size }) => $size || '56px'};
    height: ${({ $size }) => $size || '56px'};
    animation: ${pulseGlow} 2.4s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 100%;
        height: 100%;
        animation: ${rotateHourglass} 4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        transform-origin: center center;
    }

    .glass-frame {
        stroke: var(--primary);
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: rgba(2, 132, 199, 0.06);
    }

    .cap {
        fill: var(--primary-dark);
        stroke: var(--primary);
        stroke-width: 1.5;
        rx: 2;
    }

    .sand-top {
        fill: var(--sand);
        transform-origin: 28px 24px;
        animation: ${sandTop} 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .sand-bottom {
        fill: var(--sand);
        transform-origin: 28px 46px;
        animation: ${sandBottom} 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .sand-stream {
        stroke: var(--accent);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-dasharray: 10 2;
        animation: ${sandStreamAnim} 4s linear infinite;
    }

    .reflection {
        stroke: rgba(255, 255, 255, 0.7);
        stroke-width: 1.5;
        stroke-linecap: round;
        fill: none;
    }
`;

const Caption = styled.div`
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-slate-600, #475569);
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    .dot-pulse {
        display: inline-block;
        animation: blink 1.4s infinite both;
    }

    @keyframes blink {
        0%, 80%, 100% { opacity: 0; }
        40% { opacity: 1; }
    }
`;

const FullPageContainer = styled.div`
    min-height: ${({ $minHeight }) => $minHeight || '60vh'};
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    position: relative;
    z-index: 10;
`;

const InlineContainer = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: ${({ $padding }) => $padding || '0.25rem 0.5rem'};
`;

/**
 * Animated Hourglass SVG Core Component
 */
export const HourglassSvg = ({ size = '56px' }) => {
    return (
        <SvgContainer $size={size}>
            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Top Cap */}
                <rect className="cap" x="12" y="6" width="32" height="4" rx="2" />
                <rect x="15" y="10" width="26" height="2" fill="var(--primary)" />

                {/* Bottom Cap */}
                <rect className="cap" x="12" y="46" width="32" height="4" rx="2" />
                <rect x="15" y="44" width="26" height="2" fill="var(--primary)" />

                {/* Hourglass Glass Body */}
                <path
                    className="glass-frame"
                    d="M16 12 C16 22, 25 25, 28 28 C25 31, 16 34, 16 44 L40 44 C40 34, 31 31, 28 28 C31 25, 40 22, 40 12 Z"
                />

                {/* Top Sand Bulb */}
                <path
                    className="sand-top"
                    d="M18 14 C18 20, 24 23, 28 26 C32 23, 38 20, 38 14 Z"
                />

                {/* Sand Stream */}
                <line
                    className="sand-stream"
                    x1="28"
                    y1="26"
                    x2="28"
                    y2="42"
                />

                {/* Bottom Sand Mound */}
                <path
                    className="sand-bottom"
                    d="M20 43 C20 38, 25 36, 28 36 C31 36, 36 38, 36 43 Z"
                />

                {/* Left Glass Specular Highlight */}
                <path
                    className="reflection"
                    d="M19 15 C19 19, 22 22, 24 24"
                />
                <path
                    className="reflection"
                    d="M19 41 C19 37, 22 34, 24 32"
                />
            </svg>
        </SvgContainer>
    );
};

/**
 * Standard Loader
 */
export const Loader = ({ size = '56px', text, className }) => {
    return (
        <LoaderWrapper className={className}>
            <HourglassSvg size={size} />
            {text && (
                <Caption>
                    <span>{text}</span>
                </Caption>
            )}
        </LoaderWrapper>
    );
};

/**
 * Full Page / Section Centered Loader Wrapper
 */
export const PageLoader = ({ text = 'Loading healthcare data...', minHeight, size = '64px' }) => {
    return (
        <FullPageContainer $minHeight={minHeight}>
            <Loader size={size} text={text} />
        </FullPageContainer>
    );
};

/**
 * Inline Loader for Cards, Modals, Buttons, Table rows
 */
export const InlineLoader = ({ text, size = '26px', padding, className }) => {
    return (
        <InlineContainer $padding={padding} className={className}>
            <HourglassSvg size={size} />
            {text && <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'inherit' }}>{text}</span>}
        </InlineContainer>
    );
};

/**
 * Route Suspense Fallback
 */
export const SuspenseFallback = () => {
    return (
        <PageLoader minHeight="80vh" text="Initializing ProHealth Portal..." size="72px" />
    );
};

export default Loader;
