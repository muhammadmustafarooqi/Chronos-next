import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

const VIPContext = createContext();
export const useVIP = () => useContext(VIPContext);

// ── Tier definitions ──────────────────────────────────────
export const VIP_TIERS = [
    {
        id: 'member',
        label: 'Member',
        minPoints: 0,
        maxPoints: 499,
        color: '#a0a0a0',
        bg: 'rgba(160,160,160,0.1)',
        border: 'rgba(160,160,160,0.3)',
        icon: '🎖️',
        perks: ['Access to full catalogue', 'Order tracking', 'Wishlist'],
    },
    {
        id: 'elite',
        label: 'Elite',
        minPoints: 500,
        maxPoints: 1999,
        color: '#D4AF37',
        bg: 'rgba(212,175,55,0.08)',
        border: 'rgba(212,175,55,0.3)',
        icon: '⭐',
        perks: ['Early access badges', 'Priority support', 'Exclusive lookbooks'],
    },
    {
        id: 'premier',
        label: 'Premier',
        minPoints: 2000,
        maxPoints: 4999,
        color: '#E5C158',
        bg: 'rgba(229,193,88,0.1)',
        border: 'rgba(229,193,88,0.4)',
        icon: '💎',
        perks: ['All Elite perks', 'Private sale invitations', 'Complimentary engraving'],
    },
    {
        id: 'black',
        label: 'Chronos Black',
        minPoints: 5000,
        maxPoints: Infinity,
        color: '#D4AF37',
        bg: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.95))',
        border: 'rgba(212,175,55,0.6)',
        icon: '👑',
        perks: ['All Premier perks', 'Dedicated White Glove service', 'Annual Horology Masterclass', 'First access to rare drops'],
    },
];

// ── Points rule: 1 point per $100 spent ──────────────────
export const calcPoints = (totalSpend) => Math.floor(totalSpend / 100);

export const getTierForPoints = (points) => {
    for (let i = VIP_TIERS.length - 1; i >= 0; i--) {
        if (points >= VIP_TIERS[i].minPoints) return VIP_TIERS[i];
    }
    return VIP_TIERS[0];
};

// ─────────────────────────────────────────────────────────
export const VIPProvider = ({ children }) => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // Persisted per user so switching accounts shows individual VIP state
    // Only compute storageKey once auth has resolved to avoid reading guest key
    const storageKey = !authLoading && user
        ? `chronos-vip-${user.id || user.email}`
        : !authLoading
            ? 'chronos-vip-guest'
            : null; // null = auth not resolved yet

    const [vipData, setVipData] = useState({ enrolled: false, totalSpend: 0, joinedAt: null });

    // Load VIP data only once auth has fully resolved
    useEffect(() => {
        if (storageKey === null) return; // auth still loading
        try {
            const saved = localStorage.getItem(storageKey);
            setVipData(
                saved
                    ? JSON.parse(saved)
                    : { enrolled: false, totalSpend: 0, joinedAt: null }
            );
        } catch {
            setVipData({ enrolled: false, totalSpend: 0, joinedAt: null });
        }
    }, [storageKey]);

    // Persist whenever data changes
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(vipData));
    }, [vipData, storageKey]);

    // ── Derived values ─────────────────────────────────────
    const points = useMemo(() => calcPoints(vipData.totalSpend), [vipData.totalSpend]);
    const tier = useMemo(() => getTierForPoints(vipData.enrolled ? points : 0), [points, vipData.enrolled]);
    const nextTier = useMemo(() => {
        const idx = VIP_TIERS.findIndex((t) => t.id === tier.id);
        return idx < VIP_TIERS.length - 1 ? VIP_TIERS[idx + 1] : null;
    }, [tier]);

    const progressToNext = useMemo(() => {
        if (!nextTier) return 100;
        const range = nextTier.minPoints - tier.minPoints;
        const earned = points - tier.minPoints;
        return Math.min(Math.round((earned / range) * 100), 100);
    }, [points, tier, nextTier]);

    const isVIP = vipData.enrolled && isAuthenticated;
    const isBlack = isVIP && tier.id === 'black';

    // ── Actions ────────────────────────────────────────────
    const enroll = () => {
        if (!isAuthenticated) return;
        setVipData((prev) => ({
            ...prev,
            enrolled: true,
            joinedAt: prev.joinedAt || new Date().toISOString(),
        }));
    };

    const addSpend = (amount) => {
        setVipData((prev) => ({
            ...prev,
            totalSpend: prev.totalSpend + amount,
        }));
    };

    return (
        <VIPContext.Provider
            value={{
                isVIP,
                isBlack,
                enrolled: vipData.enrolled,
                points,
                tier,
                nextTier,
                progressToNext,
                totalSpend: vipData.totalSpend,
                joinedAt: vipData.joinedAt,
                enroll,
                addSpend,
                VIP_TIERS,
            }}
        >
            {children}
        </VIPContext.Provider>
    );
};
