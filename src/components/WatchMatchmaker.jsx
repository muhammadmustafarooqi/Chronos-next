import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, X, ChevronLeft, RotateCcw,
    ShoppingBag, Heart, ArrowRight, Star, Bot, Gem
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatches } from '../context/WatchContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// ─────────────────────────────────────────────
// QUESTION CONFIGURATION
// ─────────────────────────────────────────────
const QUESTIONS = [
    {
        id: 'occasion',
        step: 1,
        question: 'What is the occasion?',
        subtitle: 'Help us understand where this timepiece will be worn',
        options: [
            {
                value: 'daily',
                label: 'Daily Companion',
                description: 'Versatile for every moment',
                emoji: '☀️',
                categories: ['Sport', 'Classic', 'Diver', 'Heritage'],
            },
            {
                value: 'business',
                label: 'Business & Boardroom',
                description: 'Commanding presence in every meeting',
                emoji: '💼',
                categories: ['Luxury', 'Dress', 'Classic'],
            },
            {
                value: 'adventure',
                label: 'Adventure & Sport',
                description: 'Built for the extraordinary',
                emoji: '🏔️',
                categories: ['Diver', 'Explorer', 'Pilot', 'Sport'],
            },
            {
                value: 'racing',
                label: 'Speed & Racing',
                description: 'Born on the racetrack',
                emoji: '🏎️',
                categories: ['Racing', 'Sport'],
            },
            {
                value: 'collect',
                label: 'Rare Collection',
                description: 'A masterpiece to be preserved',
                emoji: '💎',
                categories: ['Exotic', 'Luxury', 'Heritage'],
            },
        ],
    },
    {
        id: 'style',
        step: 2,
        question: 'What defines your aesthetic?',
        subtitle: 'Your style reveals the soul of your perfect timepiece',
        options: [
            {
                value: 'classic',
                label: 'Timeless Classic',
                description: 'Elegant, refined and enduring',
                emoji: '🎭',
                categories: ['Classic', 'Heritage', 'Dress'],
            },
            {
                value: 'sporty',
                label: 'Sporty & Bold',
                description: 'Athletic, dynamic, commanding',
                emoji: '⚡',
                categories: ['Sport', 'Diver', 'Racing'],
            },
            {
                value: 'minimal',
                label: 'Minimal & Refined',
                description: 'Clean lines, understated luxury',
                emoji: '✨',
                categories: ['Luxury', 'Dress'],
            },
            {
                value: 'avant',
                label: 'Avant-Garde',
                description: 'Boundary-pushing and utterly unique',
                emoji: '🚀',
                categories: ['Exotic', 'Racing', 'Explorer'],
            },
        ],
    },
    {
        id: 'budget',
        step: 3,
        question: 'What is your investment range?',
        subtitle: 'Every tier unveils a world of horological excellence',
        options: [
            {
                value: 'entry',
                label: 'Up to $10,000',
                description: 'The gateway to true luxury',
                emoji: '💰',
                minPrice: 0,
                maxPrice: 10000,
            },
            {
                value: 'mid',
                label: '$10,000 – $30,000',
                description: 'Connoisseur territory',
                emoji: '💳',
                minPrice: 10000,
                maxPrice: 30000,
            },
            {
                value: 'high',
                label: '$30,000 – $100,000',
                description: 'Collector-grade masterpieces',
                emoji: '🏆',
                minPrice: 30000,
                maxPrice: 100000,
            },
            {
                value: 'ultra',
                label: 'No Boundaries',
                description: 'Excellence above all else',
                emoji: '👑',
                minPrice: 0,
                maxPrice: Infinity,
            },
        ],
    },
    {
        id: 'feature',
        step: 4,
        question: 'What feature speaks to you?',
        subtitle: 'The soul of the mechanism that moves you',
        options: [
            {
                value: 'complications',
                label: 'Grand Complications',
                description: 'Calendar, Moon Phase, Perpetual',
                emoji: '🌙',
                keywords: ['Calendar', 'Moon', 'Chronograph', 'Power Reserve', 'Perpetual'],
            },
            {
                value: 'water',
                label: 'Deep Water Mastery',
                description: 'For exploration beneath the surface',
                emoji: '🌊',
                keywords: ['Water Resistant', 'Water Resistance', '300m', '600m', 'Diver'],
            },
            {
                value: 'heritage',
                label: 'Mechanical Heritage',
                description: 'Hand-wound or legendary movement',
                emoji: '⚙️',
                keywords: ['Manual Winding', 'In-House', 'In-house', 'Manufacture'],
            },
            {
                value: 'elegance',
                label: 'Pure Elegance',
                description: 'Refined simplicity above everything',
                emoji: '🕊️',
                keywords: ['18k', 'Gold', 'Sapphire', 'Leather', 'Rose Gold'],
            },
        ],
    },
];

// ─────────────────────────────────────────────
// RECOMMENDATION ALGORITHM
// ─────────────────────────────────────────────
const getRecommendations = (answers, watches) => {
    const scored = watches.map((watch) => {
        let score = 0;

        // Occasion → category
        const occasionQ = QUESTIONS[0].options.find((o) => o.value === answers.occasion);
        if (occasionQ?.categories?.includes(watch.category)) score += 3;

        // Style → category
        const styleQ = QUESTIONS[1].options.find((o) => o.value === answers.style);
        if (styleQ?.categories?.includes(watch.category)) score += 2;

        // Budget → price range
        const budgetQ = QUESTIONS[2].options.find((o) => o.value === answers.budget);
        if (budgetQ) {
            if (budgetQ.value === 'ultra') {
                score += 2;
            } else if (watch.price >= budgetQ.minPrice && watch.price <= budgetQ.maxPrice) {
                score += 3;
            } else {
                // Partial credit for adjacent range
                const dist = Math.min(
                    Math.abs(watch.price - budgetQ.minPrice),
                    Math.abs(watch.price - budgetQ.maxPrice)
                );
                if (dist < 5000) score += 1;
            }
        }

        // Feature → keyword match
        const featureQ = QUESTIONS[3].options.find((o) => o.value === answers.feature);
        if (featureQ?.keywords && watch.features) {
            const matchCount = watch.features.filter((f) =>
                featureQ.keywords.some((k) => f.toLowerCase().includes(k.toLowerCase()))
            ).length;
            score += matchCount * 1.5;
        }

        // Bonuses
        if (watch.isFeatured) score += 1;
        if (watch.isNew) score += 0.5;

        return { ...watch, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
};

// ─────────────────────────────────────────────
// PHASE COMPONENTS
// ─────────────────────────────────────────────
const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const IntroPhase = ({ onStart }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center justify-center h-full text-center px-6 max-w-2xl mx-auto"
    >
        {/* Icon */}
        <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mb-8 mx-auto"
        >
            <Gem size={40} className="text-luxury-gold" />
        </motion.div>

        <span className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-4 block">
            Chronos AI Concierge
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-gradient-gold">Timepiece</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
            Answer four curated questions and our AI concierge will present you with a
            personalised selection from our collection — tailored exclusively to your taste.
        </p>

        <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="btn-primary group flex items-center gap-3 text-sm"
        >
            <Sparkles size={18} />
            Begin Your Journey
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <p className="text-gray-600 text-xs mt-6 uppercase tracking-widest">
            4 questions · Less than 1 minute
        </p>
    </motion.div>
);

const QuestionPhase = ({ question, currentStep, totalSteps, direction, onSelect, onBack }) => (
    <motion.div
        key={question.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="flex flex-col h-full px-4 md:px-8 py-6 max-w-3xl mx-auto w-full"
    >
        {/* Step header */}
        <div className="flex items-center justify-between mb-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 hover:text-luxury-gold transition-colors text-sm uppercase tracking-widest"
            >
                <ChevronLeft size={16} />
                {currentStep === 1 ? 'Menu' : 'Back'}
            </button>
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em]">
                Step {currentStep} of {totalSteps}
            </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-px bg-white/10 mb-10 relative overflow-hidden">
            <motion.div
                className="absolute top-0 left-0 h-full bg-luxury-gold"
                initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
        </div>

        {/* Question */}
        <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                {question.question}
            </h3>
            <p className="text-gray-500 text-sm">{question.subtitle}</p>
        </div>

        {/* Options */}
        <div className={`grid gap-3 ${question.options.length > 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {question.options.map((opt, i) => (
                <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.02, borderColor: '#D4AF37' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(question.id, opt.value)}
                    className="group text-left p-4 border border-white/10 bg-white/5 hover:bg-luxury-gold/5 transition-all duration-300 flex items-start gap-4"
                    style={{ borderRadius: 0 }}
                >
                    <span className="text-2xl mt-0.5 flex-shrink-0">{opt.emoji}</span>
                    <div>
                        <span className="block text-white text-sm font-semibold group-hover:text-luxury-gold transition-colors mb-0.5">
                            {opt.label}
                        </span>
                        <span className="block text-gray-500 text-xs leading-relaxed">
                            {opt.description}
                        </span>
                    </div>
                </motion.button>
            ))}
        </div>
    </motion.div>
);

const CalculatingPhase = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full text-center px-6"
    >
        {/* Animated gears/rings */}
        <div className="relative w-32 h-32 mb-8 mx-auto">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-luxury-gold/20"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border border-dashed border-luxury-gold/30"
            />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border border-luxury-gold/50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={28} className="text-luxury-gold" />
            </div>
        </div>

        <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <span className="text-luxury-gold text-xs uppercase tracking-[0.4em] block mb-3">
                Analysing preferences
            </span>
            <h3 className="text-2xl font-serif text-white">
                Curating your selections...
            </h3>
        </motion.div>

        {/* Animated dots */}
        <div className="flex gap-2 mt-8">
            {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay }}
                    className="w-2 h-2 rounded-full bg-luxury-gold"
                />
            ))}
        </div>
    </motion.div>
);

const ResultCard = ({ watch, rank, delay }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(watch._id || watch.id);

    const medals = ['🥇', '🥈', '🥉'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: 'easeOut' }}
            className="relative flex flex-col bg-white/5 border border-white/10 hover:border-luxury-gold/30 transition-all duration-500 group overflow-hidden"
        >
            {/* Rank badge */}
            <div className="absolute top-3 left-3 z-10 text-xl">{medals[rank]}</div>

            {/* Image */}
            <div className="relative overflow-hidden aspect-square">
                <img
                    src={watch.images?.[0]}
                    alt={watch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Wishlist button */}
                <button
                    onClick={() => toggleWishlist(watch)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-luxury-gold transition-colors"
                >
                    <Heart
                        size={14}
                        className={inWishlist ? 'fill-luxury-gold text-luxury-gold' : 'text-white'}
                    />
                </button>

                {/* Match score bar */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70 text-xs">Match Score</span>
                        <span className="text-luxury-gold text-xs font-semibold">
                            {Math.round(Math.min((watch.score / 12) * 100, 99))}%
                        </span>
                    </div>
                    <div className="w-full h-px bg-white/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((watch.score / 12) * 100, 99)}%` }}
                            transition={{ delay: delay + 0.3, duration: 0.8 }}
                            className="h-full bg-luxury-gold"
                        />
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <span className="text-luxury-gold text-xs uppercase tracking-widest mb-1">
                    {watch.brand}
                </span>
                <h4 className="text-white font-serif text-base font-semibold mb-2 leading-snug flex-1">
                    {watch.name}
                </h4>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                    <span className="text-white font-semibold text-sm">
                        ${watch.price?.toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => addToCart(watch)}
                            className="p-2 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-black transition-all duration-300"
                            title="Add to cart"
                        >
                            <ShoppingBag size={14} />
                        </button>
                        <Link
                            to={`/product/${watch._id || watch.id}`}
                            className="p-2 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-black transition-all duration-300 flex items-center"
                            title="View details"
                        >
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ResultsPhase = ({ recommendations, onRestart, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col h-full px-4 md:px-8 py-6 overflow-y-auto"
    >
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
        >
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6 }}
                className="text-4xl mb-4"
            >
                ✨
            </motion.div>
            <span className="text-luxury-gold text-xs uppercase tracking-[0.4em] block mb-3">
                Your Personalised Selection
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                We Found Your Perfect Matches
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
                Based on your preferences, our concierge has curated these exceptional timepieces exclusively for you.
            </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 flex-1">
            {recommendations.map((watch, i) => (
                <ResultCard key={watch._id || watch.id} watch={watch} rank={i} delay={i * 0.15} />
            ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 border-t border-white/10">
            <button
                onClick={onRestart}
                className="flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors text-sm uppercase tracking-widest"
            >
                <RotateCcw size={14} />
                Try Again
            </button>
            <Link
                to="/shop"
                onClick={onClose}
                className="btn-primary text-sm flex items-center gap-2"
            >
                Browse All Timepieces
                <ArrowRight size={16} />
            </Link>
        </div>
    </motion.div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const PHASES = { INTRO: 'intro', QUESTION: 'question', CALCULATING: 'calculating', RESULTS: 'results' };

const WatchMatchmaker = () => {
    const { watches } = useWatches();
    const [isOpen, setIsOpen] = useState(false);
    const [phase, setPhase] = useState(PHASES.INTRO);
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const [answers, setAnswers] = useState({});
    const [recommendations, setRecommendations] = useState([]);

    const open = () => {
        setIsOpen(true);
        setPhase(PHASES.INTRO);
        setCurrentStep(0);
        setAnswers({});
    };

    // Listen for programmatic open from other components (e.g. Home page CTA)
    useEffect(() => {
        const handler = () => open();
        window.addEventListener('open-matchmaker', handler);
        return () => window.removeEventListener('open-matchmaker', handler);
    }, []);

    const close = () => setIsOpen(false);

    const handleStart = () => {
        setDirection(1);
        setPhase(PHASES.QUESTION);
        setCurrentStep(0);
    };

    const handleSelect = useCallback(
        (questionId, value) => {
            const newAnswers = { ...answers, [questionId]: value };
            setAnswers(newAnswers);

            if (currentStep < QUESTIONS.length - 1) {
                setDirection(1);
                setCurrentStep((s) => s + 1);
            } else {
                // Last question answered — calculate
                setPhase(PHASES.CALCULATING);
                setTimeout(() => {
                    const recs = getRecommendations(newAnswers, watches);
                    setRecommendations(recs);
                    setPhase(PHASES.RESULTS);
                }, 2200);
            }
        },
        [answers, currentStep, watches]
    );

    const handleBack = () => {
        setDirection(-1);
        if (currentStep === 0) {
            setPhase(PHASES.INTRO);
        } else {
            setCurrentStep((s) => s - 1);
        }
    };

    const handleRestart = () => {
        setAnswers({});
        setCurrentStep(0);
        setDirection(-1);
        setPhase(PHASES.INTRO);
    };

    return (
        <>
            {/* ── Floating Trigger Button ── */}
            <motion.button
                onClick={open}
                data-matchmaker-trigger
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 md:gap-3 px-4 py-3 md:px-5 md:py-3.5 shadow-2xl group"
                style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 50%, #D4AF37 100%)',
                    boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
                }}
            >
                {/* Pulse ring */}
                <motion.span
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-none border-2 border-luxury-gold"
                />
                <Bot size={18} className="text-black" />
                <span className="text-black text-xs font-bold uppercase tracking-[0.15em]">
                    AI Concierge
                </span>
                <Sparkles size={14} className="text-black/70 group-hover:rotate-12 transition-transform" />
            </motion.button>

            {/* ── Overlay Modal ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
                            onClick={phase !== PHASES.CALCULATING ? close : undefined}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-4xl bg-luxury-charcoal border border-white/10 shadow-2xl overflow-hidden"
                            style={{ height: 'min(90vh, 680px)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Gold top line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />

                            {/* Header bar */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Gem size={16} className="text-luxury-gold" />
                                    <span className="text-white/60 text-xs uppercase tracking-[0.3em]">
                                        Watch Matchmaker
                                    </span>
                                </div>
                                {phase !== PHASES.CALCULATING && (
                                    <button
                                        onClick={close}
                                        className="text-gray-500 hover:text-white transition-colors p-1"
                                        aria-label="Close"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Phase content */}
                            <div className="flex-1 overflow-hidden relative" style={{ height: 'calc(100% - 57px)' }}>
                                <AnimatePresence mode="wait" custom={direction}>
                                    {phase === PHASES.INTRO && (
                                        <motion.div key="intro" className="absolute inset-0 flex items-center justify-center">
                                            <IntroPhase onStart={handleStart} />
                                        </motion.div>
                                    )}

                                    {phase === PHASES.QUESTION && (
                                        <motion.div key={`q-${currentStep}`} className="absolute inset-0 overflow-y-auto">
                                            <QuestionPhase
                                                question={QUESTIONS[currentStep]}
                                                currentStep={currentStep + 1}
                                                totalSteps={QUESTIONS.length}
                                                direction={direction}
                                                onSelect={handleSelect}
                                                onBack={handleBack}
                                            />
                                        </motion.div>
                                    )}

                                    {phase === PHASES.CALCULATING && (
                                        <motion.div key="calculating" className="absolute inset-0 flex items-center justify-center">
                                            <CalculatingPhase />
                                        </motion.div>
                                    )}

                                    {phase === PHASES.RESULTS && (
                                        <motion.div key="results" className="absolute inset-0 overflow-y-auto">
                                            <ResultsPhase
                                                recommendations={recommendations}
                                                onRestart={handleRestart}
                                                onClose={close}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Gold bottom line */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default WatchMatchmaker;
