"use client";
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Gem, Award, Clock, Headphones, ShieldCheck, Package } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: '100% Authentic',
        description: 'Every timepiece undergoes rigorous authentication by our certified horologists before it ever reaches you.',
        stat: '2,400+',
        statLabel: 'Verified Pieces',
        color: '#4ade80',   // green glow
        delay: 0,
    },
    {
        icon: Award,
        title: 'Certified Excellence',
        description: 'We maintain direct partnerships with world-renowned maisons and authorized manufacturers.',
        stat: '24',
        statLabel: 'Partner Brands',
        color: '#D4AF37',   // gold
        delay: 0.1,
    },
    {
        icon: Clock,
        title: 'Lifetime Service',
        description: 'Complimentary servicing and maintenance for the life of your timepiece — no questions asked.',
        stat: '∞',
        statLabel: 'Year Coverage',
        color: '#60a5fa',   // blue
        delay: 0.2,
    },
    {
        icon: Headphones,
        title: 'Personal Concierge',
        description: 'A dedicated horological specialist available around the clock for every aspect of your acquisition.',
        stat: '24/7',
        statLabel: 'Availability',
        color: '#c084fc',   // purple
        delay: 0.3,
    },
    {
        icon: Gem,
        title: 'Rare Pieces',
        description: 'Exclusive access to limited-edition and allocation pieces not available through standard retail channels.',
        stat: '100+',
        statLabel: 'Rare Finds p.a.',
        color: '#f472b6',   // pink
        delay: 0.4,
    },
    {
        icon: Package,
        title: 'White Glove Delivery',
        description: 'Fully insured, climate-controlled shipping with real-time tracking and signature confirmation.',
        stat: '50+',
        statLabel: 'Countries Served',
        color: '#fb923c',   // orange
        delay: 0.5,
    },
];

// Animated counter hook
const useCountUp = (target, trigger, duration = 1.5) => {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        if (!trigger) return;
        const numTarget = parseFloat(target);
        if (isNaN(numTarget)) { setCount(target); return; }
        const start = Date.now();
        const tick = () => {
            const elapsed = (Date.now() - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * numTarget));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [trigger]);
    return count;
};

const FeatureCard = ({ feature, index }) => {
    const [hovered, setHovered] = useState(false);
    const [inView, setInView] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const gradX = useTransform(mouseX, [0, 300], [0, 100]);
    const gradY = useTransform(mouseY, [0, 300], [0, 100]);

    const numStat = parseFloat(feature.stat);
    const isNumeric = !isNaN(numStat);
    const displayCount = useCountUp(numStat, inView && hovered);

    const handleMouse = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: feature.delay, ease: [0.22, 1, 0.36, 1] }}
            onViewportEnter={() => setInView(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0); }}
            onMouseMove={handleMouse}
            className="group relative cursor-default"
        >
            {/* Card */}
            <div className="relative overflow-hidden border border-white/5 bg-luxury-charcoal/40 backdrop-blur-sm transition-all duration-500 h-full"
                style={{ borderRadius: '4px' }}
            >
                {/* Mouse-tracking spotlight */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: useTransform(
                            [gradX, gradY],
                            ([x, y]) => `radial-gradient(180px circle at ${x}% ${y}%, ${feature.color}14, transparent)`
                        )
                    }}
                />

                {/* Top border glow */}
                <motion.div
                    className="absolute top-0 left-0 right-0 h-px"
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ background: `linear-gradient(90deg, transparent, ${feature.color}80, transparent)` }}
                />

                <div className="p-8 relative z-10">
                    {/* Icon + Stat row */}
                    <div className="flex items-start justify-between mb-6">
                        {/* Animated Icon */}
                        <motion.div
                            animate={hovered
                                ? { scale: 1.1, rotate: [0, -8, 8, 0] }
                                : { scale: 1, rotate: 0 }
                            }
                            transition={{ duration: 0.4 }}
                            className="relative w-14 h-14 flex items-center justify-center"
                        >
                            {/* Icon background rings */}
                            <motion.div
                                animate={hovered ? { scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] } : { scale: 1 }}
                                transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
                                className="absolute inset-0 rounded-full border"
                                style={{ borderColor: `${feature.color}40` }}
                            />
                            <div
                                className="w-14 h-14 flex items-center justify-center border transition-all duration-500"
                                style={{
                                    borderColor: hovered ? `${feature.color}60` : 'rgba(212,175,55,0.2)',
                                    background: hovered ? `${feature.color}15` : 'transparent',
                                }}
                            >
                                <feature.icon
                                    size={22}
                                    style={{ color: hovered ? feature.color : '#D4AF37' }}
                                    className="transition-colors duration-500"
                                />
                            </div>
                        </motion.div>

                        {/* Stat */}
                        <div className="text-right">
                            <motion.div
                                animate={hovered ? { y: 0, opacity: 1 } : { y: 8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl font-serif font-bold"
                                style={{ color: feature.color }}
                            >
                                {isNumeric ? displayCount : feature.stat}
                                {isNumeric && feature.stat.includes('+') && '+'}
                            </motion.div>
                            <motion.div
                                animate={hovered ? { y: 0, opacity: 1 } : { y: 8, opacity: 0 }}
                                transition={{ duration: 0.3, delay: 0.05 }}
                                className="text-[10px] text-gray-500 uppercase tracking-wider"
                            >
                                {feature.statLabel}
                            </motion.div>
                        </div>
                    </div>

                    {/* Title */}
                    <h3
                        className="text-xl font-serif text-white mb-3 transition-colors duration-300"
                        style={{ color: hovered ? feature.color : 'white' }}
                    >
                        {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                    </p>

                    {/* Bottom animated line */}
                    <motion.div
                        animate={{ width: hovered ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 h-px"
                        style={{ background: `linear-gradient(90deg, ${feature.color}80, transparent)` }}
                    />
                </div>

                {/* Corner triangle accent */}
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 right-0 w-0 h-0"
                    style={{
                        borderTop: `36px solid ${feature.color}25`,
                        borderLeft: '36px solid transparent',
                    }}
                />
            </div>
        </motion.div>
    );
};

const WhyChooseUs = () => {
    return (
        <section className="py-32 bg-luxury-black relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Concentric rings */}
                {[600, 450, 300].map((size, i) => (
                    <motion.div
                        key={size}
                        className="absolute top-1/2 left-1/2 rounded-full border border-luxury-gold/5"
                        style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
                        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 30 + i * 15, repeat: Infinity, ease: 'linear' }}
                    />
                ))}
                {/* Gold gradient blob */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: '0.1em' }}
                        whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-luxury-gold text-xs uppercase block mb-4"
                    >
                        The CHRONOS Difference
                    </motion.span>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Why Collectors<br />
                        <span className="relative inline-block">
                            <span className="text-gradient-gold">Choose Us</span>
                            <motion.span
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent origin-left"
                            />
                        </span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Six reasons why the world's most discerning collectors trust CHRONOS with their most important acquisitions.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>

                {/* Bottom CTA bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 p-8 border border-white/5 bg-luxury-charcoal/30"
                >
                    <div>
                        <h3 className="text-xl font-serif text-white mb-1">Ready to begin your collection?</h3>
                        <p className="text-gray-500 text-sm">Our concierge is standing by to assist you.</p>
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                        <a href="/shop" className="btn-primary text-sm px-6 py-3">
                            Explore Collection
                        </a>
                        <a href="/contact" className="btn-outline text-sm px-6 py-3">
                            Contact Concierge
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

