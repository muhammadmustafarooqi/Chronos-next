import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * An animated SVG analog watch face that ticks in real-time.
 * This is a unique, eye-catching centerpiece for the Home page.
 */
const LiveWatchFace = ({ size = 300, className = '' }) => {
    const [time, setTime] = useState(new Date());
    const animFrameRef = useRef(null);

    useEffect(() => {
        const tick = () => {
            setTime(new Date());
            animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, []);

    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    const secAngle = seconds * 6;
    const minAngle = minutes * 6;
    const hourAngle = hours * 30;

    const r = size / 2;
    const cx = r;
    const cy = r;

    // Hour markers
    const hourMarkers = Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30;
        const rad = (angle - 90) * (Math.PI / 180);
        const isMain = i % 3 === 0;
        const outerR = r - 10;
        const innerR = isMain ? r - 26 : r - 18;
        return {
            x1: cx + outerR * Math.cos(rad),
            y1: cy + outerR * Math.sin(rad),
            x2: cx + innerR * Math.cos(rad),
            y2: cy + innerR * Math.sin(rad),
            isMain
        };
    });

    // Minute markers (5 between each hour)
    const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null; // skip hour positions
        const angle = i * 6;
        const rad = (angle - 90) * (Math.PI / 180);
        const outerR = r - 10;
        const innerR = r - 15;
        return {
            x1: cx + outerR * Math.cos(rad),
            y1: cy + outerR * Math.sin(rad),
            x2: cx + innerR * Math.cos(rad),
            y2: cy + innerR * Math.sin(rad),
        };
    }).filter(Boolean);

    const handPoint = (angle, length, baseWidth) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const tip = { x: cx + length * Math.cos(rad), y: cy + length * Math.sin(rad) };
        const perp = (angle + 90 - 90) * (Math.PI / 180);
        const base = { x: cx - 15 * Math.cos(rad), y: cy - 15 * Math.sin(rad) };
        const p1 = { x: base.x + baseWidth * Math.cos(perp), y: base.y + baseWidth * Math.sin(perp) };
        const p2 = { x: base.x - baseWidth * Math.cos(perp), y: base.y - baseWidth * Math.sin(perp) };
        return `${tip.x},${tip.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`;
    };

    const secRad = (secAngle - 90) * (Math.PI / 180);
    const secTip = { x: cx + (r - 22) * Math.cos(secRad), y: cy + (r - 22) * Math.sin(secRad) };
    const secTail = { x: cx + -(r * 0.25) * Math.cos(secRad), y: cy + -(r * 0.25) * Math.sin(secRad) };

    return (
        <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
            {/* Outer glow ring */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
                    boxShadow: '0 0 40px rgba(212,175,55,0.15), 0 0 80px rgba(212,175,55,0.05)',
                    borderRadius: '50%'
                }}
            />

            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <radialGradient id="watchFace" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#1e1e1e" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                    </radialGradient>
                    <radialGradient id="crystalSheen" cx="35%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="secGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Case ring - outer */}
                <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="#3a3430" strokeWidth="2" />

                {/* Case ring - gold bezel */}
                <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke="#D4AF37" strokeWidth="4" opacity="0.7" />

                {/* Bezel tick marks (decorative outer) */}
                <circle cx={cx} cy={cy} r={r - 9} fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2" />

                {/* Main dial face */}
                <circle cx={cx} cy={cy} r={r - 12} fill="url(#watchFace)" />

                {/* Crystal sheen overlay */}
                <ellipse cx={cx - 10} cy={cy - 15} rx={r * 0.55} ry={r * 0.4} fill="url(#crystalSheen)" />

                {/* Hour markers */}
                {hourMarkers.map((m, i) => (
                    <line
                        key={`hm-${i}`}
                        x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
                        stroke={m.isMain ? '#D4AF37' : '#888'}
                        strokeWidth={m.isMain ? 2.5 : 1}
                        strokeLinecap="round"
                    />
                ))}

                {/* Minute markers */}
                {minuteMarkers.map((m, i) => (
                    <line
                        key={`mm-${i}`}
                        x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
                        stroke="#444"
                        strokeWidth={0.8}
                        strokeLinecap="round"
                    />
                ))}

                {/* CHRONOS brand text */}
                <text
                    x={cx} y={cy - r * 0.3}
                    textAnchor="middle"
                    fill="#D4AF37"
                    fontSize={r * 0.1}
                    fontFamily="'Playfair Display', serif"
                    letterSpacing="4"
                    opacity="0.9"
                >
                    CHRONOS
                </text>
                <text
                    x={cx} y={cy - r * 0.18}
                    textAnchor="middle"
                    fill="#666"
                    fontSize={r * 0.055}
                    fontFamily="Inter, sans-serif"
                    letterSpacing="2"
                >
                    SWISS MADE
                </text>

                {/* Hour hand */}
                <polygon
                    points={handPoint(hourAngle, r * 0.48, 4.5)}
                    fill="#e8e8e8"
                    stroke="#ccc"
                    strokeWidth="0.5"
                    filter="url(#glow)"
                />

                {/* Minute hand */}
                <polygon
                    points={handPoint(minAngle, r * 0.65, 3)}
                    fill="#f0f0f0"
                    stroke="#ddd"
                    strokeWidth="0.5"
                    filter="url(#glow)"
                />

                {/* Second hand */}
                <line
                    x1={secTail.x} y1={secTail.y}
                    x2={secTip.x} y2={secTip.y}
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    filter="url(#secGlow)"
                />

                {/* Center cap */}
                <circle cx={cx} cy={cy} r={5} fill="#D4AF37" />
                <circle cx={cx} cy={cy} r={2.5} fill="#0a0a0a" />
            </svg>

            {/* Lugs (decorative) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-8 h-4"
                style={{ background: 'linear-gradient(to bottom, #2a2520, #1a1a1a)', borderRadius: '2px 2px 0 0' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-8 h-4"
                style={{ background: 'linear-gradient(to top, #2a2520, #1a1a1a)', borderRadius: '0 0 2px 2px' }} />
        </div>
    );
};

export default LiveWatchFace;
