"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useVIP } from '@/context/VIPContext';

const TIER_COLORS = {
    member:   '#a0a0a0',
    elite:    '#D4AF37',
    premier:  '#E5C158',
    black:    '#D4AF37',
    bronze:   '#CD7F32',
    silver:   '#C0C0C0',
    gold:     '#D4AF37',
    platinum: '#9B59B6',
};

const VIPProgress = ({ className = '' }) => {
    const { isVIP, tier, nextTier, progressToNext, points, totalSpend, enrolled } = useVIP();

    if (!enrolled) return null;

    const tierKey    = tier?.id || 'member';
    const tierColor  = TIER_COLORS[tierKey] || '#a0a0a0';
    const nextLabel  = nextTier?.label || 'Max Level';
    const percentStr = `${progressToNext ?? 0}%`;

    return (
        <div className={`${className}`}>
            {/* Tier header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{tier?.icon || '🎖️'}</span>
                    <div>
                        <p className="text-white text-sm font-semibold">{tier?.label} Member</p>
                        {isVIP && (
                            <p className="text-gray-500 text-[10px]">${totalSpend?.toLocaleString()} total spend · {points} pts</p>
                        )}
                    </div>
                </div>
                {nextTier && (
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">
                        Next: {nextTier.label}
                    </span>
                )}
            </div>

            {/* Progress bar */}
            {nextTier ? (
                <div className="mb-2">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: percentStr }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${tierColor}88, ${tierColor})` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1.5">
                        <span>{tier?.label}</span>
                        <span>{progressToNext}% to {nextLabel}</span>
                    </div>
                </div>
            ) : (
                <div className="text-xs text-center py-2 border border-luxury-gold/20 text-luxury-gold">
                    👑 Maximum Tier Achieved
                </div>
            )}

            {/* Perks */}
            {tier?.perks && (
                <div className="mt-4 space-y-1.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Your Benefits</p>
                    {tier.perks.map((perk, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                            <span style={{ color: tierColor }}>✓</span>
                            <span>{perk}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VIPProgress;
