"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';

const Hero = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / (typeof window !== 'undefined' ? window.innerWidth : 1000) - 0.5) * 20,
                y: (e.clientY / (typeof window !== 'undefined' ? window.innerHeight : 800) - 0.5) * 20,
            });
        };
        typeof window !== 'undefined' && window.addEventListener('mousemove', handleMouseMove);
        return () => typeof window !== 'undefined' && window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollToContent = () => {
        window.scrollTo({ top: (typeof window !== 'undefined' ? window.innerHeight : 800), behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black" />
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`
                    }}
                />
            </div>

            {/* Background Image with Parallax */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    x: mousePosition.x * 0.5,
                    y: mousePosition.y * 0.5,
                }}
            >
                <img
                    src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80"
                    alt="Luxury Watch"
                    className="w-full h-full object-cover opacity-40 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/70 to-luxury-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/80 via-transparent to-luxury-black/80" />
            </motion.div>

            {/* Floating Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {mounted && [...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-luxury-gold/40 rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
                            opacity: 0,
                        }}
                        animate={{
                            y: -10,
                            opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: 'linear',
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-30" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10">
                {/* Decorative Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="w-32 h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-8"
                />

                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="inline-block text-luxury-gold text-xs md:text-sm uppercase tracking-[0.4em] mb-6 font-medium"
                >
                    Established 2010 • Swiss Excellence
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-4xl sm:text-7xl lg:text-8xl font-serif font-bold text-white mb-4 leading-tight sm:leading-[0.9]"
                >
                    Master the
                </motion.h1>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-4xl sm:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight sm:leading-[0.9]"
                >
                    <span className="text-gradient-gold text-shadow-gold">Art of Time</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Discover our curated collection of the world's most prestigious timepieces.
                    Where precision engineering meets timeless elegance.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href="/shop" className="btn-primary min-w-[200px]">
                        Explore Collection
                    </Link>
                    <button className="btn-outline min-w-[200px] flex items-center justify-center gap-3">
                        <Play size={16} className="fill-current" />
                        Watch Story
                    </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className="mt-12 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto"
                >
                    {[
                        { value: '500+', label: 'Timepieces' },
                        { value: '50+', label: 'Luxury Brands' },
                        { value: '15K+', label: 'Happy Clients' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-xl sm:text-3xl font-serif text-white mb-1">{stat.value}</div>
                            <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                onClick={scrollToContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <ChevronDown size={20} />
                </motion.div>
            </motion.button>

            {/* Side Decorations */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-10">
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-luxury-gold/50 to-transparent" />
                <span className="text-xs text-gray-500 uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                    Since 2010
                </span>
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-luxury-gold/50 to-transparent" />
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-10">
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-luxury-gold/50 to-transparent" />
                <span className="text-xs text-gray-500 uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                    Swiss Made
                </span>
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-luxury-gold/50 to-transparent" />
            </div>
        </section>
    );
};

export default Hero;
