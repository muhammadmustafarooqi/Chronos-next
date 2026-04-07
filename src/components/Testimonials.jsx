import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'James Richardson',
        role: 'Watch Collector',
        location: 'New York, USA',
        watch: 'Patek Philippe Nautilus',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        content: 'CHRONOS delivered an exceptional experience from start to finish. The authenticity verification and white-glove delivery made purchasing my Patek Philippe absolutely seamless. I wouldn\'t trust any other dealer.',
        rating: 5,
    },
    {
        id: 2,
        name: 'Sarah Chen',
        role: 'CEO, Tech Ventures',
        location: 'San Francisco, USA',
        watch: 'Royal Oak Perpetual Calendar',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        content: 'I\'ve purchased three timepieces from CHRONOS over the years. Their expertise, attention to detail, and after-sales service are unparalleled in the luxury watch industry. A truly world-class operation.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Michael Torres',
        role: 'Investment Banker',
        location: 'London, UK',
        watch: 'Rolex Daytona Cosmograph',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        content: 'The personal concierge service at CHRONOS is extraordinary. They found me a rare Rolex Daytona that I had been searching for years. Their network and dedication to clients is truly impressive.',
        rating: 5,
    },
    {
        id: 4,
        name: 'Isabelle Fontaine',
        role: 'Art Curator',
        location: 'Paris, France',
        watch: 'Lange 1 Original',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        content: 'As someone who appreciates fine craftsmanship, CHRONOS matches my sensibilities perfectly. The curation, the storytelling behind each piece — it is a gallery experience, not just a transaction.',
        rating: 5,
    },
    {
        id: 5,
        name: 'Alexander Petrov',
        role: 'Entrepreneur',
        location: 'Dubai, UAE',
        watch: 'RM 11-03 McLaren',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        content: 'Acquired my Richard Mille through CHRONOS. The entire process — from selection to delivery — felt like pure luxury. The attention they give each client is remarkable. A partner, not just a seller.',
        rating: 5,
    },
];

// Floating particle
const Particle = ({ x, y, delay, size }) => (
    <motion.div
        className="absolute rounded-full bg-luxury-gold"
        style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, opacity: 0 }}
        animate={{
            y: [-20, -60, -20],
            opacity: [0, 0.3, 0],
            scale: [0.5, 1, 0.5],
        }}
        transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
        }}
    />
);

// 3D tilt card wrapper
const TiltCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

    const handleMouseMove = (e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(nx);
        y.set(ny);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`cursor-default ${className}`}
        >
            {children}
        </motion.div>
    );
};

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef(null);

    const particles = Array.from({ length: 15 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.4,
        size: Math.random() * 3 + 1,
    }));

    const goTo = (idx, dir) => {
        setDirection(dir);
        setActiveIndex(idx);
    };

    const goPrev = () => {
        const newIdx = (activeIndex - 1 + testimonials.length) % testimonials.length;
        goTo(newIdx, -1);
    };

    const goNext = () => {
        const newIdx = (activeIndex + 1) % testimonials.length;
        goTo(newIdx, 1);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;
        autoPlayRef.current = setInterval(goNext, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [activeIndex, isAutoPlaying]);

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.95 }),
    };

    const t = testimonials[activeIndex];

    // Marquee items (stats)
    const stats = [
        '★ 500+ Timepieces Sold', '◆ 10+ Years Excellence', '★ 100% Authentic Guarantee',
        '◆ Worldwide Shipping', '★ White-Glove Service', '◆ 24 Luxury Brands',
    ];

    return (
        <section
            className="py-32 bg-luxury-black relative overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p, i) => <Particle key={i} {...p} />)}
            </div>

            {/* Glowing gold orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 65%)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ letterSpacing: '0.1em', opacity: 0 }}
                        whileInView={{ letterSpacing: '0.3em', opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-luxury-gold text-xs uppercase block mb-4"
                    >
                        Client Testimonials
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Words from Our{' '}
                        <span className="relative inline-block">
                            <span className="text-gradient-gold">Collectors</span>
                            <motion.span
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent origin-left"
                            />
                        </span>
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-sm">
                        Hear from the collectors who trust CHRONOS for their most prized acquisitions.
                    </p>
                </motion.div>

                {/* Main Carousel Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
                    {/* Side: Navigation dots & Author stack */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
                        {testimonials.map((item, i) => (
                            <motion.button
                                key={item.id}
                                onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                                className="flex items-center gap-3 group text-left"
                                whileHover={{ x: 4 }}
                            >
                                <div className={`relative flex-shrink-0 transition-all duration-300 ${activeIndex === i ? 'w-12 h-12' : 'w-8 h-8 opacity-40 group-hover:opacity-70'}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full rounded-full object-cover border border-luxury-gold/30"
                                    />
                                    {activeIndex === i && (
                                        <motion.div
                                            layoutId="activeRing"
                                            className="absolute -inset-1 rounded-full border-2 border-luxury-gold"
                                        />
                                    )}
                                </div>
                                <div className={`transition-all duration-300 ${activeIndex === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                                    <p className="text-white text-xs font-medium leading-tight">{item.name}</p>
                                    <p className="text-gray-500 text-[10px]">{item.location}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Center: Featured quote */}
                    <div className="lg:col-span-6">
                        <div className="relative" style={{ perspective: '1000px' }}>
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={activeIndex}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                >
                                    <TiltCard>
                                        <div className="relative bg-gradient-to-br from-luxury-charcoal via-[#1a1a1a] to-luxury-black border border-white/8 rounded-2xl p-10 shadow-2xl overflow-hidden">
                                            {/* Decorative corner accent */}
                                            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-luxury-gold/30 rounded-tl-2xl" />
                                            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-luxury-gold/30 rounded-br-2xl" />

                                            {/* Large background quote */}
                                            <div className="absolute top-4 right-6 text-[120px] font-serif text-luxury-gold/5 leading-none select-none pointer-events-none">
                                                "
                                            </div>

                                            {/* Stars with animation */}
                                            <div className="flex gap-1.5 mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0, rotate: -30 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: i * 0.08, type: 'spring', stiffness: 400 }}
                                                    >
                                                        <Star size={16} className="text-luxury-gold fill-luxury-gold" />
                                                    </motion.div>
                                                ))}
                                                <span className="ml-2 text-gray-500 text-xs self-center">Verified Purchase</span>
                                            </div>

                                            {/* Quote text */}
                                            <motion.blockquote
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-lg md:text-xl text-white/90 leading-relaxed italic mb-8 relative z-10"
                                            >
                                                "{t.content}"
                                            </motion.blockquote>

                                            {/* Watch tag */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full px-3 py-1.5 mb-8"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
                                                <span className="text-luxury-gold text-[10px] uppercase tracking-widest font-medium">{t.watch}</span>
                                            </motion.div>

                                            {/* Author */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.35 }}
                                                className="flex items-center gap-4 pt-6 border-t border-white/5"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={t.image}
                                                        alt={t.name}
                                                        className="w-14 h-14 rounded-full object-cover"
                                                    />
                                                    <div className="absolute -inset-1 rounded-full border-2 border-luxury-gold/40" />
                                                    {/* Online dot */}
                                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-luxury-black" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-semibold">{t.name}</h4>
                                                    <p className="text-gray-400 text-sm">{t.role}</p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <MapPin size={10} className="text-luxury-gold" />
                                                        <span className="text-luxury-gold text-xs">{t.location}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: Stats panel */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
                        {[
                            { value: '500+', label: 'Happy Collectors' },
                            { value: '4.9', label: 'Average Rating' },
                            { value: '98%', label: 'Would Recommend' },
                            { value: '10+', label: 'Years of Trust' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-right"
                            >
                                <div className="text-3xl font-serif font-bold text-luxury-gold">{stat.value}</div>
                                <div className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</div>
                                <div className="h-px w-full bg-white/5 mt-3" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-6">
                    <motion.button
                        onClick={goPrev}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300"
                    >
                        <ChevronLeft size={20} />
                    </motion.button>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-3">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                                className="relative h-1.5 overflow-hidden rounded-full transition-all duration-300"
                                style={{ width: activeIndex === i ? '32px' : '8px' }}
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-full" />
                                {activeIndex === i && (
                                    <motion.div
                                        layoutId="activeDot"
                                        className="absolute inset-0 bg-luxury-gold rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <motion.button
                        onClick={goNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300"
                    >
                        <ChevronRight size={20} />
                    </motion.button>
                </div>
            </div>

            {/* Bottom Marquee Strip */}
            <div className="mt-20 overflow-hidden border-t border-white/5 pt-8">
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="flex gap-12 whitespace-nowrap"
                >
                    {[...stats, ...stats].map((s, i) => (
                        <span key={i} className="text-gray-600 text-xs uppercase tracking-[0.3em] flex-shrink-0">
                            {s}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
