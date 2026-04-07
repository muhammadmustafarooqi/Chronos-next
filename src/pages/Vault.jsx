import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWatches } from '../context/WatchContext';

const Vault = () => {
    const { watches } = useWatches();
    
    // Simulate a countdown timer (e.g. opens in 2 hours, or closes in 2 hours depending on state)
    // For demo purposes, we will make it randomly open or closed, but let's default to "Opening soon" 
    // to show the countdown, and after 5 seconds of viewing it opens for demo.
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 15 });
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Get exclusive/exotic watches
    const vaultWatches = watches.filter(w => w.category === 'Exotic' || w.price > 40000).slice(0, 3);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
                    setIsUnlocked(true);
                    return prev;
                }
                
                let h = prev.hours, m = prev.minutes, s = prev.seconds;
                if (s > 0) {
                    s -= 1;
                } else {
                    s = 59;
                    if (m > 0) m -= 1;
                    else {
                        m = 59;
                        h -= 1;
                    }
                }
                return { hours: h, minutes: m, seconds: s };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (v) => v.toString().padStart(2, '0');

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex flex-col pt-20">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ 
                backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px' 
            }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-0" />
            
            {!isUnlocked && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 pointer-events-none" />
            )}

            {/* Header Area */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full border border-luxury-gold flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                        {isUnlocked 
                            ? <Unlock size={24} className="text-luxury-gold" />
                            : <Lock size={24} className="text-luxury-gold" />
                        }
                    </div>
                    
                    <span className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-4">
                        Exclusive Access
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">
                        The Vault
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed mb-12">
                        Highly limited drops and rare allocations. The Vault operates on precisely timed windows. 
                        Once the countdown expires, access is sealed until the next astronomical alignment.
                    </p>

                    {/* Timer Widget */}
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 md:p-8 rounded-sm backdrop-blur-md">
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className="text-4xl md:text-5xl font-mono text-white tracking-widest">{formatTime(timeLeft.hours)}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Hours</span>
                        </div>
                        <span className="text-4xl text-luxury-gold/50 font-serif pb-6">:</span>
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className="text-4xl md:text-5xl font-mono text-white tracking-widest">{formatTime(timeLeft.minutes)}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Minutes</span>
                        </div>
                        <span className="text-4xl text-luxury-gold/50 font-serif pb-6">:</span>
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className={`text-4xl md:text-5xl font-mono tracking-widest transition-colors ${timeLeft.seconds < 10 && !isUnlocked ? 'text-luxury-gold' : 'text-white'}`}>
                                {formatTime(timeLeft.seconds)}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Seconds</span>
                        </div>
                    </div>

                    {!isUnlocked && (
                        <div className="mt-8 flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest border border-luxury-gold/20 bg-luxury-gold/5 px-4 py-2">
                            <Clock size={14} /> Sequence approaches zero. Stand by.
                        </div>
                    )}
                </motion.div>
            </div>

            {/* The Vault Content */}
            <div className="relative z-20 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
                <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                        <motion.div
                            key="locked"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 border border-white/5 bg-[#0a0a0a]/50"
                        >
                            <AlertTriangle size={32} className="text-gray-700 mb-4" />
                            <h3 className="text-xl font-serif text-gray-500 mb-2">Vault sequence locked</h3>
                            <p className="text-gray-600 text-sm max-w-sm text-center">
                                The contents of this drop are classified until the time window intersects. 
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="unlocked"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                                <h2 className="text-2xl font-serif text-white">Current Allocation</h2>
                                <span className="text-luxury-gold text-xs uppercase tracking-[0.2em] animate-pulse flex items-center gap-2">
                                    <div className="w-2 h-2 bg-luxury-gold rounded-full" /> Live Now
                                </span>
                            </div>
                            
                            {/* Grid of highly exclusive watches */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {vaultWatches.map((product, index) => (
                                    <motion.div
                                        key={product._id || product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-luxury-gold to-transparent opacity-0 group-hover:opacity-100 transition duration-1000 blur-sm pointer-events-none" />
                                        <div className="relative bg-[#0a0a0a] border border-white/10 h-full">
                                            {product.stock <= 0 && (
                                                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-900/80 text-white text-[10px] uppercase tracking-widest font-bold">
                                                    Reserved
                                                </div>
                                            )}
                                            <div className="aspect-square overflow-hidden bg-black relative">
                                                <img 
                                                    src={product.images ? product.images[0] : product.image} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 border border-white/5 m-4 pointer-events-none" />
                                            </div>
                                            <div className="p-6">
                                                <p className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] mb-2">{product.brand}</p>
                                                <h3 className="text-white font-serif text-xl mb-3">{product.name}</h3>
                                                <p className="text-gray-400 text-xs line-clamp-2 mb-6 h-8">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl text-white font-light tracking-wider">${product.price.toLocaleString()}</span>
                                                    <Link 
                                                        to={`/product/${product._id || product.id}`}
                                                        className="flex items-center justify-center p-2 border border-white/20 text-white hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                                                    >
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Vault;
