import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const GooeyNav = ({
    items = [
        { label: "Home", href: "/" },
        { label: "Find Doctors", href: "/doctors" },
        { label: "About HMS", href: "/about" },
        { label: "Patient Reviews", href: "/reviews" }
    ],
    animationTime = 600,
    particleCount = 15,
    particleDistances = [90, 10],
    particleR = 100,
    timeVariance = 300,
    colors = [1, 2, 3, 1, 2, 3, 1, 4],
    initialActiveIndex = 0,
    className = ''
}) => {
    const containerRef = useRef(null);
    const navRef = useRef(null);
    const indicatorRef = useRef(null);
    const particleFieldRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Map current pathname to active navigation index
    const getActiveIndexFromPath = useCallback(() => {
        const currentPath = location.pathname;
        const index = items.findIndex(item => {
            if (item.href === '/') return currentPath === '/';
            if (item.href === '/doctors') return currentPath === '/doctors' || currentPath === '/patient';
            if (item.href === '/reviews') return currentPath === '/reviews' || currentPath === '/feedback';
            return currentPath === item.href || currentPath.startsWith(item.href);
        });
        return index !== -1 ? index : initialActiveIndex;
    }, [items, location.pathname, initialActiveIndex]);

    const [activeIndex, setActiveIndex] = useState(getActiveIndexFromPath);

    const noise = (n = 1) => n / 2 - Math.random() * n;
    const getXY = (distance, pointIndex, totalPoints) => {
        const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    };

    const createParticle = (i, t, d, r) => {
        const rotate = noise(r / 10);
        return {
            start: getXY(d[0], particleCount - i, particleCount),
            end: getXY(d[1] + noise(7), particleCount - i, particleCount),
            time: t,
            scale: 1 + noise(0.2),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    };

    const makeParticles = (element) => {
        if (!element) return;
        const d = particleDistances;
        const r = particleR;
        const bubbleTime = animationTime * 2 + timeVariance;
        element.style.setProperty('--time', `${bubbleTime}ms`);

        for (let i = 0; i < particleCount; i++) {
            const t = animationTime * 2 + noise(timeVariance * 2);
            const p = createParticle(i, t, d, r);
            setTimeout(() => {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('gooey-nav-particle');
                particle.style.setProperty('--start-x', `${p.start[0]}px`);
                particle.style.setProperty('--start-y', `${p.start[1]}px`);
                particle.style.setProperty('--end-x', `${p.end[0]}px`);
                particle.style.setProperty('--end-y', `${p.end[1]}px`);
                particle.style.setProperty('--time', `${p.time}ms`);
                particle.style.setProperty('--scale', `${p.scale}`);
                particle.style.setProperty('--color', `var(--color-${p.color}, #0284c7)`);
                particle.style.setProperty('--rotate', `${p.rotate}deg`);
                point.classList.add('gooey-nav-point');
                particle.appendChild(point);
                element.appendChild(particle);

                setTimeout(() => {
                    try {
                        if (particle.parentNode === element) {
                            element.removeChild(particle);
                        }
                    } catch {
                        // ignore
                    }
                }, t);
            }, 20);
        }
    };

    const updateIndicatorPosition = useCallback((element) => {
        if (!containerRef.current || !indicatorRef.current || !element) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = element.getBoundingClientRect();
        const styles = {
            left: `${pos.x - containerRect.x}px`,
            top: `${pos.y - containerRect.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`
        };
        Object.assign(indicatorRef.current.style, styles);
        if (particleFieldRef.current) {
            Object.assign(particleFieldRef.current.style, styles);
        }
    }, []);

    const triggerAnimation = useCallback((index, element) => {
        setActiveIndex(index);
        if (element) {
            updateIndicatorPosition(element);
        }
        if (particleFieldRef.current) {
            const particles = particleFieldRef.current.querySelectorAll('.gooey-nav-particle');
            particles.forEach(p => {
                if (p.parentNode === particleFieldRef.current) {
                    particleFieldRef.current.removeChild(p);
                }
            });
            makeParticles(particleFieldRef.current);
        }
    }, [updateIndicatorPosition]);

    const handleClick = (e, item, index) => {
        e.preventDefault();
        const liEl = e.currentTarget.closest('li') || e.currentTarget;
        if (activeIndex !== index) {
            triggerAnimation(index, liEl);
        }
        if (location.pathname !== item.href) {
            navigate(item.href);
        }
    };

    const handleKeyDown = (e, item, index) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const liEl = e.currentTarget.closest('li');
            handleClick(e, item, index);
        }
    };

    // Update active index on route change
    useEffect(() => {
        const matchingIndex = getActiveIndexFromPath();
        if (matchingIndex !== activeIndex && matchingIndex >= 0) {
            if (navRef.current) {
                const lis = navRef.current.querySelectorAll('li');
                const targetLi = lis[matchingIndex];
                if (targetLi) {
                    triggerAnimation(matchingIndex, targetLi);
                } else {
                    setActiveIndex(matchingIndex);
                }
            } else {
                setActiveIndex(matchingIndex);
            }
        }
    }, [location.pathname, getActiveIndexFromPath, activeIndex, triggerAnimation]);

    // Position tracker and ResizeObserver
    useEffect(() => {
        if (!navRef.current || !containerRef.current) return;
        const lis = navRef.current.querySelectorAll('li');
        const activeLi = lis[activeIndex];
        if (activeLi) {
            updateIndicatorPosition(activeLi);
        }
        const resizeObserver = new ResizeObserver(() => {
            const currentLis = navRef.current?.querySelectorAll('li');
            const currentActiveLi = currentLis?.[activeIndex];
            if (currentActiveLi) {
                updateIndicatorPosition(currentActiveLi);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [activeIndex, updateIndicatorPosition]);

    return (
        <div className={`gooey-header-nav-wrapper relative ${className}`} ref={containerRef}>
            <style>
                {`
                :root {
                    --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
                    --color-1: #0284c7;
                    --color-2: #06b6d4;
                    --color-3: #0ea5e9;
                    --color-4: #38bdf8;
                }
                .gooey-header-nav-wrapper {
                    display: inline-flex;
                    align-items: center;
                    position: relative;
                    background: transparent;
                    border: none;
                    box-shadow: none;
                    padding: 0;
                }
                .gooey-header-nav-list {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    position: relative;
                    z-index: 5;
                }
                .gooey-header-nav-item {
                    position: relative;
                    border-radius: 9999px;
                }
                .gooey-header-nav-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.55rem 1.2rem;
                    font-size: 0.935rem;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    color: #475569;
                    text-decoration: none;
                    white-space: nowrap;
                    border-radius: 9999px;
                    transition: color 0.2s ease;
                    outline: none;
                    user-select: none;
                    cursor: pointer;
                    position: relative;
                    z-index: 6;
                }
                .gooey-header-nav-link:hover {
                    color: #0284c7;
                }
                .gooey-header-nav-item.active .gooey-header-nav-link {
                    color: #0284c7;
                    font-weight: 700;
                }

                /* Smooth active pill indicator sitting directly behind active link */
                .gooey-nav-pill-indicator {
                    position: absolute;
                    pointer-events: none;
                    z-index: 2;
                    border-radius: 9999px;
                    background: rgba(2, 132, 199, 0.09);
                    border: 1px solid rgba(2, 132, 199, 0.22);
                    box-shadow: 0 2px 10px rgba(2, 132, 199, 0.1);
                    transition: left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), 
                                top 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), 
                                width 0.25s ease, 
                                height 0.25s ease;
                }

                /* Particle animation field */
                .gooey-nav-particle-field {
                    position: absolute;
                    pointer-events: none;
                    z-index: 1;
                    filter: blur(2px) contrast(30);
                }

                .gooey-nav-particle,
                .gooey-nav-point {
                    display: block;
                    opacity: 0;
                    width: 12px;
                    height: 12px;
                    border-radius: 9999px;
                    transform-origin: center;
                }
                .gooey-nav-particle {
                    --time: 5s;
                    position: absolute;
                    top: calc(50% - 6px);
                    left: calc(50% - 6px);
                    animation: gooeyParticleAnim calc(var(--time)) ease 1 -350ms;
                }
                .gooey-nav-point {
                    background: var(--color);
                    opacity: 1;
                    box-shadow: 0 0 8px var(--color);
                    animation: gooeyPointAnim calc(var(--time)) ease 1 -350ms;
                }
                @keyframes gooeyParticleAnim {
                    0% {
                        transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
                        opacity: 0.9;
                        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
                    }
                    70% {
                        transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.1), calc(var(--end-y) * 1.1));
                        opacity: 0.8;
                        animation-timing-function: ease;
                    }
                    85% {
                        transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
                        opacity: 0.6;
                    }
                    100% {
                        transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
                        opacity: 0;
                    }
                }
                @keyframes gooeyPointAnim {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
                    }
                    25% {
                        transform: scale(calc(var(--scale) * 0.3));
                    }
                    38% {
                        opacity: 1;
                    }
                    65% {
                        transform: scale(var(--scale));
                        opacity: 0.9;
                        animation-timing-function: ease;
                    }
                    85% {
                        transform: scale(var(--scale));
                        opacity: 0.7;
                    }
                    100% {
                        transform: scale(0);
                        opacity: 0;
                    }
                }
                `}
            </style>
            <nav className="flex relative" style={{ transform: 'translate3d(0,0,0.01px)' }}>
                <ul
                    ref={navRef}
                    className="gooey-header-nav-list"
                >
                    {items.map((item, index) => (
                        <li
                            key={item.href || index}
                            className={`gooey-header-nav-item ${activeIndex === index ? 'active' : ''}`}
                        >
                            <a
                                href={item.href}
                                onClick={e => handleClick(e, item, index)}
                                onKeyDown={e => handleKeyDown(e, item, index)}
                                tabIndex={0}
                                role="link"
                                aria-label={item.label}
                                className="gooey-header-nav-link"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <span className="gooey-nav-pill-indicator" ref={indicatorRef} />
            <span className="gooey-nav-particle-field" ref={particleFieldRef} />
        </div>
    );
};

export default GooeyNav;
