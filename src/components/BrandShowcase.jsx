"use client";
import React from 'react';
import { motion } from 'framer-motion';

const brands = [
    { name: 'Rolex', logo: 'ROLEX' },
    { name: 'Patek Philippe', logo: 'PATEK PHILIPPE' },
    { name: 'Audemars Piguet', logo: 'AUDEMARS PIGUET' },
    { name: 'Omega', logo: 'OMEGA' },
    { name: 'Cartier', logo: 'CARTIER' },
    { name: 'IWC', logo: 'IWC SCHAFFHAUSEN' },
    { name: 'Hublot', logo: 'HUBLOT' },
    { name: 'Vacheron Constantin', logo: 'VACHERON CONSTANTIN' },
];

const BrandShowcase = () => {
    return (
        <section className="py-20 bg-luxury-black border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-gray-500 text-xs uppercase tracking-[0.3em]">
                        Authorized Dealer of Premier Brands
                    </span>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-center py-6 group cursor-pointer"
                        >
                            <span className="text-gray-600 text-sm md:text-base tracking-[0.2em] font-light group-hover:text-luxury-gold transition-colors duration-500 text-center">
                                {brand.logo}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandShowcase;

