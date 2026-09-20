import React, { useState, useRef, useEffect, useId } from 'react';

// Glyph SVG renderer supporting star, heart, and bolt shapes
const Glyph = ({ shape = 'star', size = 28, color = 'currentColor', filled = false, className = '' }) => {
    if (shape === 'heart') {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={filled ? '0' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                style={{ display: 'block', transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
        );
    }

    if (shape === 'bolt') {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={filled ? '0' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                style={{ display: 'block', transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                <path d="M13 2l-10 12h8l-2 8l12 -13h-8z" />
            </svg>
        );
    }

    // Default: Star shape
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? color : 'none'}
            stroke={color}
            strokeWidth={filled ? '0' : '1.8'}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={{ display: 'block', transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
};

export const PeekRating = ({
    value,
    defaultValue = 0,
    onChange,
    onPreview,
    count = 5,
    shape = 'star',
    labels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'],
    activeColor = '#f5b400',
    idleColor = '#94a3b8',
    tipColor = '#0f172a',
    tipTextColor = '#f8fafc',
    size = 32,
    lift = 7,
    magnify = 1.15,
    riseDuration = 320,
    popScale = 1.3,
    showTip = true,
    allowClear = true,
    readOnly = false,
    disabled = false,
    ariaLabel = 'Rating',
    className = ''
}) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    const [previewIndex, setPreviewIndex] = useState(null);
    const [poppingIndex, setPoppingIndex] = useState(null);
    const containerRef = useRef(null);
    const instanceId = useId();

    const activeDisplayIndex = previewIndex !== null ? previewIndex : currentValue;

    const handleSelect = (index) => {
        if (readOnly || disabled) return;

        let nextValue = index;
        if (allowClear && currentValue === index) {
            nextValue = 0;
        }

        setPoppingIndex(index);
        setTimeout(() => {
            setPoppingIndex(null);
        }, riseDuration);

        if (!isControlled) {
            setInternalValue(nextValue);
        }
        if (onChange) {
            onChange(nextValue);
        }
    };

    const handleMouseEnter = (index) => {
        if (readOnly || disabled) return;
        setPreviewIndex(index);
        if (onPreview) {
            onPreview(index);
        }
    };

    const handleMouseLeave = () => {
        if (readOnly || disabled) return;
        setPreviewIndex(null);
        if (onPreview) {
            onPreview(null);
        }
    };

    const handleKeyDown = (e, index) => {
        if (readOnly || disabled) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(count, currentValue + 1);
            handleSelect(next);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            const prev = Math.max(1, currentValue - 1);
            handleSelect(prev);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(index);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            if (allowClear) {
                handleSelect(currentValue);
            }
        }
    };

    // Calculate tooltip tip text
    const activeLabel = activeDisplayIndex > 0 && labels && labels[activeDisplayIndex - 1]
        ? labels[activeDisplayIndex - 1]
        : null;

    return (
        <div
            ref={containerRef}
            className={`peek-rating-wrapper ${className}`}
            role={readOnly ? 'img' : 'radiogroup'}
            aria-label={`${ariaLabel}: ${currentValue} of ${count} stars`}
            aria-disabled={disabled}
            aria-readonly={readOnly}
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                userSelect: 'none',
                touchAction: 'manipulation'
            }}
            onMouseLeave={handleMouseLeave}
        >
            <style>
                {`
                .peek-rating-group {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                }
                .peek-rating-item {
                    background: transparent;
                    border: none;
                    padding: 4px;
                    margin: 0;
                    cursor: ${readOnly ? 'default' : disabled ? 'not-allowed' : 'pointer'};
                    outline: none;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    transition: transform ${riseDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
                }
                .peek-rating-item:focus-visible {
                    box-shadow: 0 0 0 2px ${activeColor};
                }
                .peek-tooltip {
                    position: absolute;
                    bottom: calc(100% + 8px);
                    left: 50%;
                    transform: translateX(-50%) translateY(0);
                    background-color: ${tipColor};
                    color: ${tipTextColor};
                    font-size: 0.78rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    padding: 4px 10px;
                    border-radius: 9999px;
                    white-space: nowrap;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 20;
                    animation: peekTipHop ${riseDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }
                .peek-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 4px;
                    border-style: solid;
                    border-color: ${tipColor} transparent transparent transparent;
                }
                @keyframes peekTipHop {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(6px) scale(0.85);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                }
                @keyframes peekPop {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(${popScale});
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                `}
            </style>

            <div className="peek-rating-group">
                {Array.from({ length: count }, (_, i) => {
                    const itemIndex = i + 1;
                    const isLit = itemIndex <= activeDisplayIndex;
                    const isHoveredOrActive = itemIndex <= (previewIndex || 0);
                    const isTargetHover = previewIndex === itemIndex;
                    const isPopping = poppingIndex === itemIndex;

                    // Dynamic transform computation
                    let itemTransform = 'none';
                    if (!readOnly && !disabled) {
                        if (isTargetHover) {
                            itemTransform = `translateY(-${lift}px) scale(${magnify})`;
                        } else if (isHoveredOrActive) {
                            itemTransform = `translateY(-${Math.max(2, Math.round(lift * 0.5))}px) scale(${1 + (magnify - 1) * 0.5})`;
                        }
                    }

                    return (
                        <button
                            key={`${instanceId}-${itemIndex}`}
                            type="button"
                            className="peek-rating-item"
                            disabled={disabled}
                            tabIndex={readOnly || disabled ? -1 : 0}
                            role={readOnly ? 'presentation' : 'radio'}
                            aria-checked={currentValue === itemIndex}
                            aria-label={labels[i] || `Rate ${itemIndex}`}
                            onClick={() => handleSelect(itemIndex)}
                            onMouseEnter={() => handleMouseEnter(itemIndex)}
                            onKeyDown={(e) => handleKeyDown(e, itemIndex)}
                            style={{
                                transform: itemTransform,
                                animation: isPopping ? `peekPop ${riseDuration}ms ease both` : 'none',
                                opacity: disabled ? 0.5 : 1
                            }}
                        >
                            <Glyph
                                shape={shape}
                                size={size}
                                color={isLit ? activeColor : idleColor}
                                filled={isLit}
                            />

                            {/* Hover tooltip for active glyph */}
                            {showTip && !readOnly && !disabled && isTargetHover && activeLabel && (
                                <span className="peek-tooltip">
                                    {activeLabel}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PeekRating;
