"use client";
import React from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewArrivals from '@/components/NewArrivals';
import BrandShowcase from '@/components/BrandShowcase';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import LiveWatchFace from '@/components/LiveWatchFace';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles, Gem } from 'lucide-react';

const Home = () => {
    return (
        <>
            <Hero />
            <BrandShowcase />

            {/* Live Watch Section - Unique Feature */}
            <section className="py-28 bg-luxury-black relative overflow-hidden">
                {/* Ambient gold glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />
                </div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Watch */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="relative">
                                {/* Animated ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                                    className="absolute -inset-6 rounded-full border border-luxury-gold/10"
                                    style={{
                                        background: 'conic-gradient(from 0deg, transparent 0%, rgba(212,175,55,0.15) 20%, transparent 40%)'
                                    }}
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                                    className="absolute -inset-12 rounded-full border border-dashed border-luxury-gold/5"
                                />
                                <LiveWatchFace size={280} />
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 text-gray-600 text-xs uppercase tracking-[0.3em]"
                            >
                                Live — Running on your time
                            </motion.p>
                        </motion.div>

                        {/* Right: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-luxury-gold" />
                                <span className="text-luxury-gold text-xs uppercase tracking-[0.3em]">
                                    Every Tick Matters
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                                Precision is our
                                <span className="block text-gradient-gold">Obsession</span>
                            </h2>

                            <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                                What you see above is not a photo. It is a real, live representation of a
                                CHRONOS timepiece — ticking at this very moment. Every second, every minute,
                                crafted with the same obsession for detail we pour into our collection.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { num: '24', label: 'Luxury Brands', suffix: '+' },
                                    { num: '10', label: 'Years of Excellence', suffix: '+' },
                                    { num: '100', label: 'Curated Timepieces', suffix: '%' },
                                ].map(stat => (
                                    <div key={stat.label} className="flex items-center gap-4">
                                        <div className="w-16 text-right">
                                            <span className="text-3xl font-serif font-bold text-luxury-gold">
                                                {stat.num}
                                            </span>
                                            <span className="text-luxury-gold text-lg">{stat.suffix}</span>
                                        </div>
                                        <div className="h-px flex-1 bg-white/5" />
                                        <span className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <Link  
                                href="/shop"
                                className="group inline-flex items-center gap-3 text-luxury-gold hover:text-white transition-colors"
                            >
                                <span className="btn-primary">Explore Collection</span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <FeaturedProducts />
            <NewArrivals />

            {/* Brand Story Teaser - Cinematic Minimalist */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center bg-[#050505] overflow-hidden">
                {/* Full Bleed Background Image with Parallax effect */}
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80"
                        alt="Watchmaking craftsmanship"
                        className="w-full h-full object-cover opacity-40 scale-105"
                        style={{ filter: 'contrast(1.1) brightness(0.8)' }}
                    />
                    {/* Deep gradient masking for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/90 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-xl pl-4 md:pl-12 border-l border-luxury-gold/30"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-[1px] bg-luxury-gold" />
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.4em] font-medium block">
                                Our Heritage
                            </span>
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
                            The Art of <br />
                            <span className="italic text-white/70 font-light">Watchmaking</span>
                        </h2>
                        
                        <p className="text-gray-400 text-sm md:text-base leading-[2] font-light mb-6">
                            For over a decade, CHRONOS has been the premier destination for luxury timepieces.
                            We believe that a watch is more than just an instrument—it is a statement of uncompromising 
                            values, a piece of living history, and a wearable work of art.
                        </p>
                        
                        <p className="text-gray-400 text-sm md:text-base leading-[2] font-light mb-12">
                            From the intricate movements of Patek Philippe to the robust elegance of Rolex,
                            our collection is meticulously curated to guarantee legendary provenance for distinguished collectors.
                        </p>
                        
                        <Link  
                            href="/about"
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-luxury-gold text-black overflow-hidden transition-all hover:scale-[1.02]"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <span className="uppercase tracking-[0.2em] text-[10px] font-bold z-10 flex items-center gap-3">
                                Read Our Story <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </div>

                {/* Decorative Grid Lines */}
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/[0.03] pointer-events-none" />
                <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-white/[0.03] pointer-events-none" />
            </section>

            <WhyChooseUs />
            <Testimonials />

            {/* ── AI Concierge Promo Section ── */}
            <section className="py-28 bg-luxury-black relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent" />
                    <motion.div
                        animate={{ x: ['-10%', '10%', '-10%'], y: ['-5%', '5%', '-5%'] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
                    />
                    <motion.div
                        animate={{ x: ['10%', '-10%', '10%'], y: ['5%', '-5%', '5%'] }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)' }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative flex items-center justify-center"
                        >
                            {/* Central icon cluster */}
                            <div className="relative w-64 h-64">
                                {/* Outer ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border border-luxury-gold/10"
                                />
                                {/* Middle ring */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-6 rounded-full border border-dashed border-luxury-gold/20"
                                />
                                {/* Inner glow */}
                                <div
                                    className="absolute inset-12 rounded-full flex items-center justify-center"
                                    style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)' }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                        className="w-20 h-20 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center"
                                    >
                                        <Gem size={36} className="text-luxury-gold" />
                                    </motion.div>
                                </div>

                                {/* Orbiting dots */}
                                {[0, 72, 144, 216, 288].map((deg, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ rotate: [deg, deg + 360] }}
                                        transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                                        className="absolute inset-0"
                                        style={{ transformOrigin: 'center' }}
                                    >
                                        <div
                                            className="absolute w-2 h-2 rounded-full bg-luxury-gold/60"
                                            style={{ top: '4px', left: '50%', transform: 'translateX(-50%)' }}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Feature tags floating around */}
                            {['4 Questions', 'AI Matched', 'Instant Results', '24 Watches'].map((tag, i) => {
                                const positions = [
                                    'top-4 left-4',
                                    'top-4 right-4',
                                    'bottom-4 left-4',
                                    'bottom-4 right-4'
                                ];
                                return (
                                    <motion.div
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                                        className={`absolute ${positions[i]} px-3 py-1.5 border border-luxury-gold/20 bg-luxury-gold/5 backdrop-blur-sm`}
                                    >
                                        <span className="text-luxury-gold text-xs uppercase tracking-widest">{tag}</span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Right: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-luxury-gold" />
                                <span className="text-luxury-gold text-xs uppercase tracking-[0.3em]">
                                    New Feature
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                                Meet Your
                                <span className="block text-gradient-gold">AI Concierge</span>
                            </h2>

                            <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                                Not sure where to start? Our intelligent Watch Matchmaker asks you
                                four curated questions and instantly presents a personalised
                                selection — just like having a private boutique advisor.
                            </p>

                            <div className="space-y-3 mb-8">
                                {[
                                    { icon: '🎯', text: 'Personalised to your lifestyle & taste' },
                                    { icon: '⚡', text: 'Results delivered in under 60 seconds' },
                                    { icon: '💎', text: 'Curated from our full luxury collection' },
                                ].map((item) => (
                                    <div key={item.text} className="flex items-center gap-3">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-gray-400 text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* This button triggers the floating WatchMatchmaker via a custom event */}
                                <button
                                    onClick={() => {
                                        const el = document.querySelector('[data-matchmaker-trigger]');
                                        if (el) el.click();
                                        // Fallback: dispatch custom event
                                        window.dispatchEvent(new CustomEvent('open-matchmaker'));
                                    }}
                                    className="btn-primary flex items-center gap-3 group"
                                >
                                    <Sparkles size={18} />
                                    Find My Timepiece
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <Link   href="/shop" className="btn-outline flex items-center gap-2">
                                    Browse All
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-28 bg-gradient-to-b from-luxury-charcoal to-luxury-black relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                            Begin Your Collection
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
                            Find Your Perfect Timepiece
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                            Whether you're starting your collection or adding a rare piece,
                            our experts are here to guide you every step of the way.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link   href="/shop" className="btn-primary">
                                Explore Collection
                            </Link>
                            <Link   href="/contact" className="btn-outline">
                                Schedule Consultation
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Home;

