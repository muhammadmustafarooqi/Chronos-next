"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ClipboardCheck, Package, Search, Truck, MapPin, PartyPopper } from 'lucide-react';

const ALL_STAGES = [
    { key: 'Order Confirmed', label: 'Order Confirmed',  icon: ClipboardCheck, desc: 'Your order has been received.' },
    { key: 'Being Prepared',  label: 'Being Prepared',   icon: Package,        desc: 'Our artisans are preparing your timepiece.' },
    { key: 'Quality Checked', label: 'Quality Checked',  icon: Search,         desc: 'Passing our rigorous quality inspection.' },
    { key: 'Dispatched',      label: 'Dispatched',        icon: Truck,          desc: 'Your package is on its way.' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin,         desc: 'Your courier is nearby.' },
    { key: 'Delivered',       label: 'Delivered',         icon: PartyPopper,    desc: 'Congratulations — your timepiece has arrived.' },
];

const DeliveryTimeline = ({ timeline = [], onRequestCallback, isPlatiNum = false }) => {
    // Build a set of completed stages from the actual timeline data
    const completedStages = new Set(timeline.map(t => t.stage));
    const lastCompleted   = [...ALL_STAGES].reverse().find(s => completedStages.has(s.key));
    const currentIndex    = lastCompleted ? ALL_STAGES.findIndex(s => s.key === lastCompleted.key) : -1;

    const getTimestamp = (stageKey) => {
        const entry = timeline.find(t => t.stage === stageKey);
        if (!entry) return null;
        return new Date(entry.timestamp).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getNote = (stageKey) => {
        const entry = timeline.find(t => t.stage === stageKey);
        return entry?.note || null;
    };

    return (
        <div className="bg-luxury-charcoal border border-white/10 p-6 md:p-8">
            <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent mb-8" />

            <h3 className="text-white font-serif text-xl mb-8 flex items-center gap-2">
                <Truck size={18} className="text-luxury-gold" />
                Delivery Status
            </h3>

            <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
                <div
                    className="absolute left-4 top-0 w-px bg-luxury-gold transition-all duration-1000"
                    style={{ height: `${currentIndex < 0 ? 0 : ((currentIndex) / (ALL_STAGES.length - 1)) * 100}%` }}
                />

                <div className="space-y-8">
                    {ALL_STAGES.map((stage, i) => {
                        const isCompleted = completedStages.has(stage.key);
                        const isCurrent   = i === currentIndex;
                        const isFuture    = i > currentIndex;
                        const Icon        = stage.icon;
                        const ts          = getTimestamp(stage.key);
                        const note        = getNote(stage.key);

                        return (
                            <motion.div
                                key={stage.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={`relative flex gap-5 ${isFuture ? 'opacity-35' : ''}`}
                            >
                                {/* Stage icon */}
                                <div className="flex-shrink-0 z-10">
                                    {isCurrent ? (
                                        <div className="w-8 h-8 rounded-full border-2 border-luxury-gold flex items-center justify-center bg-luxury-charcoal relative">
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                                                transition={{ duration: 1.8, repeat: Infinity }}
                                                className="absolute inset-0 rounded-full border border-luxury-gold"
                                            />
                                            <Icon size={14} className="text-luxury-gold" />
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="w-8 h-8 rounded-full bg-luxury-gold/20 border border-luxury-gold/50 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-luxury-gold" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border border-white/10 bg-white/3 flex items-center justify-center">
                                            <Icon size={14} className="text-gray-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Stage info */}
                                <div className="flex-1 pb-2">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <p className={`text-sm font-semibold ${isCurrent ? 'text-luxury-gold' : isCompleted ? 'text-white' : 'text-gray-600'}`}>
                                            {stage.label}
                                            {isCurrent && (
                                                <span className="ml-2 text-[10px] bg-luxury-gold/20 text-luxury-gold px-1.5 py-0.5 uppercase tracking-widest">
                                                    Current
                                                </span>
                                            )}
                                        </p>
                                        {ts && <span className="text-[10px] text-gray-600">{ts}</span>}
                                    </div>
                                    <p className="text-gray-500 text-xs mt-0.5">{note || stage.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Platinum callback button */}
            {isPlatiNum && onRequestCallback && currentIndex < ALL_STAGES.length - 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 pt-6 border-t border-luxury-gold/20"
                >
                    <p className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] mb-3">Platinum Exclusive</p>
                    <button
                        id="request-callback-btn"
                        onClick={onRequestCallback}
                        className="w-full py-3 border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors text-xs uppercase tracking-widest font-bold"
                    >
                        Request Concierge Callback
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default DeliveryTimeline;
