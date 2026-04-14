"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWatches } from '@/context/WatchContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const NewArrivals = () => {
    const { getNewArrivals } = useWatches();
    const newWatches = getNewArrivals();

    if (newWatches.length === 0) return null;

    return (
        <section className="py-28 bg-gradient-to-b from-luxury-charcoal to-luxury-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-luxury-gold" size={16} />
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em]">
                                Just Arrived
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                            New Arrivals
                        </h2>
                    </div>
                    <Link 
                        href="/shop"
                        className="group flex items-center gap-3 text-white hover:text-luxury-gold transition-colors"
                    >
                        <span className="uppercase text-sm tracking-[0.2em] font-medium">
                            Shop New Arrivals
                        </span>
                        <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>

                {/* Horizontal Scroll */}
                <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                    {newWatches.map((watch, index) => (
                        <motion.div
                            key={watch.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 w-[300px] md:w-[350px] snap-center group"
                        >
                            <Link href={`/product/${watch.id}`}>
                                <div className="relative overflow-hidden aspect-[4/5] mb-4">
                                    <img
                                        src={watch.images ? watch.images[0] : watch.image}
                                        alt={watch.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* New Badge */}
                                    <div className="absolute top-4 left-4 bg-luxury-gold text-luxury-black text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                                        New
                                    </div>

                                    {/* View Button */}
                                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <span className="btn-primary w-full text-center block text-sm py-3">
                                            View Details
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-luxury-gold text-[10px] uppercase tracking-[0.2em]">
                                        {watch.brand}
                                    </span>
                                    <h3 className="text-lg font-serif text-white mt-1 group-hover:text-luxury-gold transition-colors">
                                        {watch.name}
                                    </h3>
                                    <p className="text-gray-400 mt-2">
                                        ${watch.price.toLocaleString()}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;


