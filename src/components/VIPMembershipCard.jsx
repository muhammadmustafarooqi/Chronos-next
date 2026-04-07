import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Gem, Star, Zap, Shield, ChevronRight, Sparkles, Check } from 'lucide-react';
import { useVIP, VIP_TIERS } from '../context/VIPContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// ── Tier badge icon ───────────────────────────────────────
const TierIcon = ({ tierId, size = 20 }) => {
    const icons = { member: Shield, elite: Star, premier: Gem, black: Crown };
    const Icon = icons[tierId] || Star;
    return <Icon size={size} />;
};

// ── Progress bar ──────────────────────────────────────────
const ProgressBar = ({ value, color }) => (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
    </div>
);

// ── Join / Unenrolled View ────────────────────────────────
const JoinCard = ({ onJoin }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border border-luxury-gold/20"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 100%)' }}
    >
        {/* Animated shimmer */}
        <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            className="absolute inset-0 w-1/3"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.06), transparent)' }}
        />

        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />

        <div className="p-8 md:p-10 relative">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                {/* Left: Icon + headline */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-12 h-12 rounded-full border border-luxury-gold/30 bg-luxury-gold/10 flex items-center justify-center"
                        >
                            <Crown size={22} className="text-luxury-gold" />
                        </motion.div>
                        <div>
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] block">
                                Exclusive Programme
                            </span>
                            <h3 className="text-white text-2xl font-serif font-bold">Chronos Black</h3>
                        </div>
                    </div>

                    <p className="text-gray-400 leading-relaxed mb-6 max-w-lg">
                        Join our most exclusive membership tier and unlock early access to rare drops,
                        dedicated white-glove service, and loyalty rewards with every purchase.
                    </p>

                    {/* Perks preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                        {[
                            '✨ Early Access to New Arrivals',
                            '👑 Dedicated Concierge Service',
                            '💎 Loyalty Points on Every Purchase',
                            '🎁 Exclusive Member-Only Drops',
                            '📖 Annual Horology Masterclass',
                            '🚀 Four Tier Progression System',
                        ].map((perk) => (
                            <div key={perk} className="flex items-center gap-2 text-sm text-gray-400">
                                <Check size={12} className="text-luxury-gold flex-shrink-0" />
                                <span>{perk}</span>
                            </div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onJoin}
                        className="btn-primary flex items-center gap-3 group text-sm"
                    >
                        <Crown size={16} />
                        Join Chronos Black — Free
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Right: Tier ladder */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                    {VIP_TIERS.map((t, i) => (
                        <div
                            key={t.id}
                            className="flex items-center gap-3 px-4 py-2.5 border"
                            style={{
                                borderColor: t.border,
                                background: t.id === 'black' ? 'rgba(212,175,55,0.05)' : 'transparent',
                            }}
                        >
                            <span className="text-base">{t.icon}</span>
                            <div className="flex-1">
                                <span className="text-xs font-semibold uppercase tracking-widest"
                                    style={{ color: t.color }}>{t.label}</span>
                                <p className="text-gray-600 text-[10px]">
                                    {t.id === 'black' ? '5,000+ pts' :
                                        t.id === 'premier' ? '2,000 – 4,999 pts' :
                                            t.id === 'elite' ? '500 – 1,999 pts' : 'Starting tier'}
                                </p>
                            </div>
                            {i === VIP_TIERS.length - 1 && (
                                <Sparkles size={12} className="text-luxury-gold" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

// ── Enrolled / Dashboard View ────────────────────────────
const MemberDashboard = ({ tier, nextTier, points, progressToNext, totalSpend, joinedAt, isBlack }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
    >
        {/* Membership Card */}
        <div
            className="relative overflow-hidden border p-6 md:p-8"
            style={{
                borderColor: tier.border,
                background: isBlack
                    ? 'linear-gradient(135deg, #050505, #111111)'
                    : `linear-gradient(135deg, ${tier.bg}, #0a0a0a)`,
            }}
        >
            {/* Animated glow */}
            {isBlack && (
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.08), transparent 60%)' }}
                />
            )}
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }} />

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative">
                {/* Tier badge */}
                <div className="flex items-center gap-4">
                    <motion.div
                        animate={isBlack ? { rotate: [0, 5, -5, 0] } : {}}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: tier.color, background: `${tier.color}15` }}
                    >
                        <TierIcon tierId={tier.id} size={28} />
                    </motion.div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] mb-0.5"
                            style={{ color: tier.color }}>
                            {tier.id === 'black' ? '✦ Chronos' : 'Chronos'} Member
                        </p>
                        <h3 className="text-white text-2xl font-serif font-bold flex items-center gap-2">
                            {tier.label}
                            {isBlack && <Sparkles size={16} className="text-luxury-gold" />}
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5">
                            Joined {joinedAt ? new Date(joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 ml-auto">
                    <div className="text-center">
                        <p className="text-3xl font-serif font-bold" style={{ color: tier.color }}>
                            {points.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">Points</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-serif font-bold text-white">
                            ${totalSpend.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">Lifetime Spend</p>
                    </div>
                </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
                <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs">
                            {points.toLocaleString()} / {nextTier.minPoints.toLocaleString()} pts to{' '}
                            <span style={{ color: nextTier.color }} className="font-semibold">{nextTier.label}</span>
                        </span>
                        <span className="text-xs font-semibold" style={{ color: tier.color }}>
                            {progressToNext}%
                        </span>
                    </div>
                    <ProgressBar value={progressToNext} color={tier.color} />
                </div>
            )}

            {isBlack && (
                <div className="mt-6 pt-4 border-t border-luxury-gold/10">
                    <p className="text-luxury-gold/70 text-xs uppercase tracking-widest text-center">
                        ✦ Maximum Tier Achieved — You are a Chronos Black Member ✦
                    </p>
                </div>
            )}
        </div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {tier.perks.map((perk) => (
                <div key={perk}
                    className="p-4 border border-white/5 bg-white/3"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                    <Check size={14} className="mb-2" style={{ color: tier.color }} />
                    <p className="text-white text-sm leading-snug">{perk}</p>
                </div>
            ))}
        </div>

        {/* How to earn */}
        <div className="p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{ background: 'rgba(212,175,55,0.03)' }}
        >
            <Zap size={20} className="text-luxury-gold flex-shrink-0" />
            <div>
                <p className="text-white text-sm font-semibold mb-0.5">Earn 1 Point for every $100 spent</p>
                <p className="text-gray-500 text-xs">
                    Points are automatically added after each purchase. Higher tiers unlock premium benefits.
                </p>
            </div>
            <Link to="/shop" className="ml-auto flex-shrink-0 text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                Shop Now <ChevronRight size={12} />
            </Link>
        </div>
    </motion.div>
);

// ── Main Export ───────────────────────────────────────────
const VIPMembershipCard = () => {
    const { isVIP, enrolled, tier, nextTier, points, progressToNext, totalSpend, joinedAt, isBlack, enroll } = useVIP();
    const { isAuthenticated } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleJoin = () => {
        if (!isAuthenticated) return;
        enroll();
        setShowConfirm(true);
        setTimeout(() => setShowConfirm(false), 3000);
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-4 left-0 right-0 z-20 flex items-center justify-center"
                    >
                        <div className="bg-luxury-gold text-black text-xs uppercase tracking-widest px-6 py-2 flex items-center gap-2 shadow-lg">
                            <Check size={14} />
                            Welcome to Chronos Black!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {enrolled
                ? <MemberDashboard
                    tier={tier}
                    nextTier={nextTier}
                    points={points}
                    progressToNext={progressToNext}
                    totalSpend={totalSpend}
                    joinedAt={joinedAt}
                    isBlack={isBlack}
                />
                : <JoinCard onJoin={handleJoin} />
            }
        </div>
    );
};

export default VIPMembershipCard;
