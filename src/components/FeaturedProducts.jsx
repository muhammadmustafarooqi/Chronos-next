"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWatches } from '@/context/WatchContext';
import { ArrowRight, Star } from 'lucide-react';

const FeaturedProducts = () => {
    const { getFeaturedWatches } = useWatches();
    const featuredWatches = getFeaturedWatches();

    return (
        <section className="py-28 bg-luxury-black relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-radial-gold opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 border border-luxury-gold/10 rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Star className="text-luxury-gold" size={16} />
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em]">
                                Handpicked Selection
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            Featured Timepieces
                        </h2>
                        <div className="h-0.5 w-24 bg-gradient-to-r from-luxury-gold to-transparent" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link 
                            href="/shop"
                            className="group flex items-center gap-3 text-white hover:text-luxury-gold transition-colors"
                        >
                            <span className="uppercase text-sm tracking-[0.2em] font-medium">
                                View All Collection
                            </span>
                            <ArrowRight
                                size={18}
                                className="transform group-hover:translate-x-2 transition-transform"
                            />
                        </Link>
                    </motion.div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {featuredWatches.slice(0, 4).map((watch, index) => (
                        <motion.div
                            key={watch.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative overflow-hidden bg-gradient-to-b from-luxury-charcoal to-luxury-black">
                                {/* Image */}
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={watch.images ? watch.images[0] : watch.image}
                                        alt={watch.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* View Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Link 
                                            href={`/product/${watch.id}`}
                                            className="btn-primary transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                                        >
                                            Discover
                                        </Link>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-center z-10">
                                    <span className="text-luxury-gold text-[10px] uppercase tracking-[0.2em] mb-2 block font-bold">
                                        {watch.brand}
                                    </span>
                                    <h3 className="text-xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors text-shadow-sm">
                                        {watch.name}
                                    </h3>
                                    <p className="text-white text-lg font-light">
                                        ${watch.price.toLocaleString()}
                                    </p>
                                </div>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                    <div className="absolute top-4 -right-8 w-24 h-6 bg-luxury-gold/10 rotate-45 transform group-hover:bg-luxury-gold/20 transition-colors" />
                                </div>
                            </div>

                            {/* Number */}
                            <div className="absolute -left-2 -top-2 w-10 h-10 bg-luxury-gold text-luxury-black flex items-center justify-center font-serif text-lg font-bold">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center md:hidden"
                >
                    <Link href="/shop" className="btn-outline inline-flex items-center gap-3">
                        View All Collection <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;


