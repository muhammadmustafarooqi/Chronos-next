"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ArrowRight, Gem } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Load canvas-confetti dynamically
const loadConfetti = () =>
    new Promise((resolve) => {
        if (window.confetti) { resolve(window.confetti); return; }
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
        s.onload = () => resolve(window.confetti);
        document.head.appendChild(s);
    });

export default function GiftRevealPage({ params }) {
    const { token } = params;
    const [gift, setGift]     = useState(null);
    const [phase, setPhase]   = useState('loading'); // loading | reveal | error
    const confettiRef = useRef(null);

    useEffect(() => {
        const fetchGift = async () => {
            try {
                const res = await fetch(`${API_BASE}/gifts/${token}`);
                const data = await res.json();
                if (!data.success) throw new Error(data.message);
                setGift(data.data.gift);
                // Start the reveal sequence
                setTimeout(() => setPhase('reveal'), 500);
            } catch {
                setPhase('error');
            }
        };
        fetchGift();
    }, [token]);

    // Trigger confetti when reveal completes
    useEffect(() => {
        if (phase !== 'reveal') return;
        const fire = async () => {
            const confetti = await loadConfetti();
            if (!confetti) return;
            // Luxury gold + white confetti
            const colors = ['#D4AF37', '#E5C158', '#ffffff', '#f8f8f0', '#AA8C2C'];
            confetti({ particleCount: 120, spread: 80, colors, origin: { y: 0.5 } });
            setTimeout(() => confetti({ particleCount: 60, spread: 60, colors, origin: { y: 0.3, x: 0.2 } }), 400);
            setTimeout(() => confetti({ particleCount: 60, spread: 60, colors, origin: { y: 0.3, x: 0.8 } }), 700);
        };
        setTimeout(fire, 1200); // delay until watch image appears
    }, [phase]);

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

            <AnimatePresence mode="wait">
                {/* Loading */}
                {phase === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto" />
                    </motion.div>
                )}

                {/* Error */}
                {phase === 'error' && (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                        <Gift size={48} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg font-serif">This gift link has expired or is invalid.</p>
                        <Link href="/" className="mt-8 btn-primary text-xs py-3 px-8 inline-flex">
                            Visit Chronos
                        </Link>
                    </motion.div>
                )}

                {/* Reveal */}
                {phase === 'reveal' && gift && (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center max-w-lg w-full"
                    >
                        {/* "You've received a gift" */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="w-16 h-16 rounded-full border border-luxury-gold/40 flex items-center justify-center mx-auto mb-6">
                                <Gift size={28} className="text-luxury-gold" />
                            </div>
                            <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-3">A Gift For You</p>
                            <h1 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                                You have received<br />
                                <span className="text-gradient-gold">a luxury timepiece</span>
                            </h1>
                        </motion.div>

                        {/* Watch image */}
                        {gift.watchImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                                className="relative mx-auto w-64 h-64 mb-10"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-radial from-luxury-gold/20 to-transparent blur-2xl" />
                                <img
                                    src={gift.watchImage}
                                    alt={gift.watchName}
                                    className="w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(212,175,55,0.3)] relative z-10"
                                />
                            </motion.div>
                        )}

                        {/* Watch name */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <p className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] mb-2">Your timepiece</p>
                            <h2 className="text-2xl font-serif text-white mb-6">{gift.watchName}</h2>

                            {/* Gift wrap badge */}
                            {gift.giftWrap && (
                                <div className="inline-flex items-center gap-2 border border-luxury-gold/30 text-luxury-gold text-xs px-3 py-1.5 mb-6 uppercase tracking-widest">
                                    🎁 Includes Luxury Gift Wrapping
                                </div>
                            )}

                            {/* Personal message */}
                            {gift.giftMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                    className="bg-white/5 border border-white/10 p-6 mb-8 relative"
                                >
                                    <Gem size={14} className="text-luxury-gold absolute top-4 right-4" />
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Personal Message</p>
                                    <p className="text-white text-sm leading-relaxed italic">"{gift.giftMessage}"</p>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                <Link
                                    href="/shop"
                                    className="btn-primary inline-flex gap-2 text-sm"
                                >
                                    Explore Chronos Collection
                                    <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
