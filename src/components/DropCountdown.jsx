'use client';
import React, { useState, useEffect } from 'react';

export default function DropCountdown({ releaseDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const end = new Date(releaseDate).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                if (onComplete) onComplete();
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [releaseDate, onComplete]);

    return (
        <div className="flex gap-4 mb-8">
            {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
            ].map(({ label, value }) => (
                <div key={label} className="bg-[#111] border border-[#333] rounded px-4 py-3 text-center min-w-[80px]">
                    <span className="block text-2xl font-mono text-white mb-1">{value.toString().padStart(2, '0')}</span>
                    <span className="block text-[10px] uppercase tracking-widest text-[#D4AF37]">{label}</span>
                </div>
            ))}
        </div>
    );
}
