"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWatches } from '@/context/WatchContext';

const Brands = () => {
    const { watches, getBrands } = useWatches();
    const brandList = getBrands().filter(b => b !== 'All');

    const getBrandProducts = (brand) => watches.filter(w => w.brand === brand);

    const brandDescriptions = {
        'Rolex': 'The crown of Swiss watchmaking, synonymous with prestige and precision since 1905.',
        'Patek Philippe': 'The last family-owned Genevan watch manufacturer, creating timeless masterpieces since 1839.',
        'Audemars Piguet': 'Pioneers of the luxury sports watch, crafting exceptional timepieces since 1875.',
        'Omega': 'The choice of astronauts and divers, combining innovation with elegance since 1848.',
        'Cartier': 'The jeweler of kings, merging jewelry craftsmanship with watchmaking excellence since 1847.',
        'Vacheron Constantin': 'The oldest continuously operating watch manufacturer, since 1755.',
        'Jaeger-LeCoultre': 'The watchmaker\'s watchmaker, known for innovative complications since 1833.',
        'Panerai': 'Italian design meets Swiss precision, born from naval heritage.',
        'IWC': 'Engineering mastery from Schaffhausen, combining technical innovation with timeless design.',
        'Hublot': 'The art of fusion, blending tradition with cutting-edge materials and design.',
    };

    return (
        <div className="bg-luxury-black min-h-screen">
            {/* Hero */}
            <section className="relative py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal to-luxury-black" />
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                            Authorized Dealer
                        </span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                            Our Partner Brands
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We are proud to represent the world's most prestigious watchmakers,
                            each with a unique heritage of excellence and innovation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Brands List */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-16">
                        {brandList.map((brand, index) => {
                            const products = getBrandProducts(brand);
                            if (products.length === 0) return null;

                            return (
                                <motion.div
                                    key={brand}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-white/5 pb-16 last:border-b-0"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                                        {/* Brand Info */}
                                        <div className="lg:col-span-1">
                                            <h2 className="text-3xl font-serif font-bold text-white mb-4">
                                                {brand}
                                            </h2>
                                            <p className="text-gray-500 mb-6">
                                                {brandDescriptions[brand] || 'Distinguished craftsmanship and timeless elegance.'}
                                            </p>
                                            <Link  
                                                href={`/shop?brand=${encodeURIComponent(brand)}`}
                                                className="text-luxury-gold text-sm uppercase tracking-wider hover:text-white transition-colors"
                                            >
                                                View All {brand} →
                                            </Link>
                                        </div>

                                        {/* Product Preview */}
                                        <div className="lg:col-span-2">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {products.slice(0, 3).map(product => (
                                                    <Link  
                                                        key={product.id}
                                                        href={`/product/${product.id}`}
                                                        className="group"
                                                    >
                                                        <div className="aspect-square bg-luxury-charcoal overflow-hidden mb-3">
                                                            <img
                                                                src={product.images ? product.images[0] : product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <h4 className="text-sm text-white group-hover:text-luxury-gold transition-colors truncate">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            ${product.price.toLocaleString()}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">
                            Looking for a Specific Brand?
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Contact our concierge team to inquire about additional brands and exclusive pieces.
                        </p>
                        <Link   href="/contact" className="btn-primary">
                            Contact Concierge
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Brands;

