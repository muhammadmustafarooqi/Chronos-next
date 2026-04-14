"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useVIP } from '@/context/VIPContext';

// Tier color config matching the spend-based tiers
const TIER_COLORS = {
    member:   { color: '#a0a0a0', bg: 'rgba(160,160,160,0.12)', label: 'Member' },
    elite:    { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)',  label: 'Elite' },
    premier:  { color: '#E5C158', bg: 'rgba(229,193,88,0.14)', label: 'Premier' },
    black:    { color: '#D4AF37', bg: 'rgba(20,20,20,0.95)',    label: 'Black' },
    // Spend-tier aliases (Feature 6)
    bronze:   { color: '#CD7F32', bg: 'rgba(205,127,50,0.12)', label: 'Bronze' },
    silver:   { color: '#C0C0C0', bg: 'rgba(192,192,192,0.12)', label: 'Silver' },
    gold:     { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)',  label: 'Gold' },
    platinum: { color: '#9B59B6', bg: 'rgba(155,89,182,0.12)', label: 'Platinum' },
};

const VIPBadge = ({ size = 'sm', showLabel = true }) => {
    const { isVIP, tier, enrolled } = useVIP();

    if (!enrolled || !isVIP) return null;

    const tierKey = tier?.id || 'member';
    const colors  = TIER_COLORS[tierKey] || TIER_COLORS.member;
    const icon    = tier?.icon || '🎖️';

    const sizeClasses = {
        xs: 'text-[9px] px-1.5 py-0.5 gap-0.5',
        sm: 'text-[10px] px-2 py-1 gap-1',
        md: 'text-xs px-3 py-1.5 gap-1.5',
    };

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center uppercase tracking-widest font-bold border ${sizeClasses[size]}`}
            style={{
                color: colors.color,
                background: colors.bg,
                borderColor: colors.color + '55',
            }}
            title={`${colors.label} Member`}
        >
            <span>{icon}</span>
            {showLabel && <span>{colors.label}</span>}
        </motion.span>
    );
};

export default VIPBadge;
