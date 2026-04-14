"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw, ShoppingBag, Heart, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Quiz Steps ─────────────────────────────────────────────
const STEPS = [
    {
        id: 'occasion',
        title: 'What is the occasion?',
        subtitle: 'Tell us where this timepiece will be worn',
        options: [
            { value: 'everyday',  label: 'Everyday Wear',      emoji: '☀️', desc: 'Versatile day-to-day companion' },
            { value: 'business',  label: 'Business Meetings',  emoji: '💼', desc: 'Command the boardroom' },
            { value: 'sport',     label: 'Sport & Outdoor',    emoji: '🏔️', desc: 'Built for the extraordinary' },
            { value: 'special',   label: 'Special Events',     emoji: '🥂', desc: 'Mark an eternal moment' },
            { value: 'all',       label: 'All Occasions',      emoji: '💎', desc: 'A true all-rounder' },
        ],
    },
    {
        id: 'style',
        title: 'What defines your aesthetic?',
        subtitle: 'Your style reveals the soul of your perfect timepiece',
        options: [
            { value: 'classic', label: 'Classic & Dress',     emoji: '🎭', desc: 'Elegant and enduring' },
            { value: 'bold',    label: 'Bold & Sporty',       emoji: '⚡', desc: 'Dynamic and commanding' },
            { value: 'minimal', label: 'Minimal & Modern',    emoji: '✨', desc: 'Understated luxury' },
            { value: 'vintage', label: 'Vintage & Retro',     emoji: '🕰️', desc: 'Timeless heritage' },
        ],
    },
    {
        id: 'movement',
        title: 'What movement speaks to you?',
        subtitle: 'The soul of every timepiece',
        options: [
            { value: 'automatic', label: 'Automatic',    emoji: '⚙️',  desc: 'Self-winding with every movement' },
            { value: 'quartz',    label: 'Quartz',       emoji: '⚡', desc: 'Precise and low-maintenance' },
            { value: 'manual',    label: 'Manual Wind',  emoji: '🔩', desc: 'A ritual of daily connection' },
            { value: 'none',      label: 'No Preference', emoji: '🌟', desc: 'Show me the best of all worlds' },
        ],
    },
    {
        id: 'budget',
        title: 'What is your investment range?',
        subtitle: 'Each tier reveals a world of horological excellence',
        options: [
            { value: 'under1k',  label: 'Under $1,000',        emoji: '💰', desc: 'Gateway quality' },
            { value: '1k_5k',    label: '$1,000 – $5,000',     emoji: '💳', desc: 'Connoisseur territory' },
            { value: '5k_20k',   label: '$5,000 – $20,000',    emoji: '🏆', desc: 'Collector-grade' },
            { value: '20k+',     label: '$20,000+',            emoji: '👑', desc: 'Rarity above all' },
        ],
    },
    {
        id: 'brands',
        title: 'Which brands are you familiar with?',
        subtitle: 'Select all that apply — or skip for a discovery experience',
        multi: true,
        options: [
            { value: 'Rolex',       label: 'Rolex',       emoji: '👑' },
            { value: 'Patek Philippe', label: 'Patek Philippe', emoji: '🎖️' },
            { value: 'Audemars Piguet', label: 'Audemars Piguet', emoji: '⭐' },
            { value: 'IWC',         label: 'IWC',         emoji: '✈️' },
            { value: 'Omega',       label: 'Omega',       emoji: '🚀' },
            { value: 'TAG Heuer',   label: 'TAG Heuer',   emoji: '🏎️' },
            { value: 'Breitling',   label: 'Breitling',   emoji: '⏱️' },
            { value: 'Hublot',      label: 'Hublot',      emoji: '🔮' },
        ],
    },
];

// ── Result Card ────────────────────────────────────────────
const ResultCard = ({ item, index }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { product, explanation } = item;
    const inWishlist = isInWishlist(product._id || product.id);
    const medals = ['🥇', '🥈', '🥉', '4th', '5th'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            className="group bg-white/5 border border-white/10 hover:border-luxury-gold/30 transition-all duration-500 flex flex-col overflow-hidden"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-black">
                <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 text-lg">{medals[index] || '✨'}</span>
                <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-luxury-gold flex items-center justify-center transition-colors"
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart size={13} className={inWishlist ? 'fill-luxury-gold text-luxury-gold' : 'text-white'} />
                </button>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-luxury-gold text-[10px] uppercase tracking-widest mb-1">{product.brand}</p>
                <h4 className="text-white font-serif text-sm font-semibold mb-2 leading-snug">{product.name}</h4>
                {explanation && (
                    <p className="text-gray-400 text-xs leading-relaxed mb-3 italic border-l border-luxury-gold/30 pl-3">
                        "{explanation}"
                    </p>
                )}
                {product.matchScore !== undefined && (
                    <div className="mb-3">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-gray-500">Match Score</span>
                            <span className="text-luxury-gold">{Math.round(Math.min((product.matchScore / 12) * 100, 98))}%</span>
                        </div>
                        <div className="h-px bg-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((product.matchScore / 12) * 100, 98)}%` }}
                                transition={{ delay: index * 0.12 + 0.4, duration: 0.8 }}
                                className="h-full bg-luxury-gold"
                            />
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                    <span className="text-white font-semibold text-sm">${product.price?.toLocaleString()}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => addToCart(product)}
                            className="p-2 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-black transition-all"
                            aria-label="Add to cart"
                        >
                            <ShoppingBag size={13} />
                        </button>
                        <Link
                            href={`/product/${product._id || product.id}`}
                            className="p-2 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-black transition-all flex items-center"
                            aria-label="View details"
                        >
                            <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ── Main Component ─────────────────────────────────────────
export default function MatchmakerPage() {
    const [step, setStep] = useState(0);
    const [dir, setDir]   = useState(1);
    const [answers, setAnswers]       = useState({});
    const [multiSelect, setMultiSelect] = useState([]);
    const [phase, setPhase] = useState('quiz'); // quiz | calculating | results
    const [results, setResults] = useState([]);
    const { error: showError } = useToast();

    const current = STEPS[step];
    const isLast  = step === STEPS.length - 1;

    const handleSelect = async (value) => {
        if (current.multi) return; // multi-select uses different flow

        const newAnswers = { ...answers, [current.id]: value };
        setAnswers(newAnswers);

        if (!isLast) {
            setDir(1);
            setStep(s => s + 1);
        } else {
            await submit(newAnswers, multiSelect);
        }
    };

    const toggleMulti = (val) => {
        setMultiSelect(prev =>
            prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };

    const submit = async (finalAnswers, brands) => {
        setPhase('calculating');
        try {
            const res = await fetch(`${API_BASE}/matchmaker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: finalAnswers, brands }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            setResults(data.data.recommendations);
            setPhase('results');
        } catch (err) {
            showError('Could not fetch recommendations. Please try again.');
            setPhase('quiz');
        }
    };

    const restart = () => {
        setStep(0);
        setDir(-1);
        setAnswers({});
        setMultiSelect([]);
        setPhase('quiz');
        setResults([]);
    };

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
    };

    return (
        <div className="min-h-screen bg-luxury-black">
            {/* Hero */}
            <div className="relative pt-28 pb-16 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
                    <div className="w-16 h-16 rounded-full border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
                        <Sparkles size={28} className="text-luxury-gold" />
                    </div>
                    <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-4">AI-Powered</p>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Watch Matchmaker</h1>
                    <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
                        Answer five curated questions. Our AI will present a personalised collection — tailored exclusively to your taste.
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 pb-24">
                <AnimatePresence mode="wait" custom={dir}>
                    {/* Quiz phase */}
                    {phase === 'quiz' && (
                        <motion.div
                            key={`step-${step}`}
                            custom={dir}
                            variants={slideVariants}
                            initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            {/* Progress */}
                            <div className="mb-8">
                                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                                    <span>Step {step + 1} of {STEPS.length}</span>
                                    <span>{Math.round(((step) / STEPS.length) * 100)}% complete</span>
                                </div>
                                <div className="h-px bg-white/5 relative overflow-hidden">
                                    <motion.div
                                        className="h-full bg-luxury-gold"
                                        animate={{ width: `${((step) / STEPS.length) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">{current.title}</h2>
                                <p className="text-gray-500 text-sm">{current.subtitle}</p>
                            </div>

                            {/* Options */}
                            <div className={`grid gap-3 ${current.multi
                                ? 'grid-cols-2 sm:grid-cols-4'
                                : current.options.length > 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                            }`}>
                                {current.options.map((opt, i) => {
                                    const isSelected = current.multi
                                        ? multiSelect.includes(opt.value)
                                        : answers[current.id] === opt.value;

                                    return (
                                        <motion.button
                                            key={opt.value}
                                            id={`quiz-option-${opt.value}`}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => current.multi ? toggleMulti(opt.value) : handleSelect(opt.value)}
                                            className={`text-left p-4 border transition-all duration-200 flex items-start gap-4 ${
                                                isSelected
                                                    ? 'border-luxury-gold bg-luxury-gold/10'
                                                    : 'border-white/10 bg-white/3 hover:border-white/30 hover:bg-white/5'
                                            }`}
                                        >
                                            <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                                            <div>
                                                <span className={`block text-sm font-semibold mb-0.5 ${isSelected ? 'text-luxury-gold' : 'text-white'}`}>
                                                    {opt.label}
                                                </span>
                                                {opt.desc && (
                                                    <span className="block text-gray-500 text-xs">{opt.desc}</span>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                                <button
                                    onClick={() => { setDir(-1); setStep(s => Math.max(0, s - 1)); }}
                                    disabled={step === 0}
                                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest disabled:opacity-30"
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>
                                {current.multi && (
                                    <button
                                        id="matchmaker-next-btn"
                                        onClick={() => submit(answers, multiSelect)}
                                        className="btn-primary text-xs py-3 px-6 flex items-center gap-2"
                                    >
                                        {multiSelect.length === 0 ? 'Skip & Find My Watch' : 'Find My Matches'}
                                        <Sparkles size={14} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Calculating */}
                    {phase === 'calculating' && (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-32 gap-8"
                        >
                            <div className="relative w-28 h-28">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border border-luxury-gold/20" />
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-4 rounded-full border border-dashed border-luxury-gold/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={30} className="text-luxury-gold" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-2">Analysing preferences</p>
                                <h3 className="text-2xl font-serif text-white">Curating your selection...</h3>
                            </div>
                        </motion.div>
                    )}

                    {/* Results */}
                    {phase === 'results' && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="text-center mb-12">
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6 }} className="text-5xl mb-4">✨</motion.div>
                                <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-3">Your Personalised Collection</p>
                                <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">We Found Your Perfect Matches</h2>
                                <p className="text-gray-400 text-sm">Based on your preferences, our AI has curated these exceptional timepieces.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {results.map((item, i) => <ResultCard key={i} item={item} index={i} />)}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-white/10">
                                <button onClick={restart} className="flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors text-xs uppercase tracking-widest">
                                    <RotateCcw size={14} /> Start Over
                                </button>
                                <Link href="/shop" className="btn-primary text-xs py-3 px-8 flex items-center gap-2">
                                    Browse All Timepieces <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
