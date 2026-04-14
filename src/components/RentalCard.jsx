'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RentalCheckout from './RentalCheckout';

export default function RentalCard({ product }) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Calculate approximate daily rates based on the server logic
    // 7 days = 1.5% of price/day, 14 days = 1.2% of price/day, 30 days = 1.0% of price/day
    const dailyRate7 = product.price * 0.015;
    const dailyRate30 = product.price * 0.010;

    return (
        <>
            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300 group flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden bg-[#111] p-6 flex items-center justify-center">
                    <img 
                        src={product.images?.[0] || '/placeholder.png'} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                            80% Rent-to-Own
                        </span>
                    </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl text-white font-serif mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-6">{product.brand}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                        <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">7 Days</p>
                            <p className="text-[#D4AF37] font-medium">${dailyRate7.toFixed()} <span className="text-gray-500 text-xs">/day</span></p>
                        </div>
                        <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">30 Days</p>
                            <p className="text-[#D4AF37] font-medium">${dailyRate30.toFixed()} <span className="text-gray-500 text-xs">/day</span></p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full bg-[#1a1a1a] border border-[#333] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] text-white py-3 rounded font-medium transition-all duration-300"
                    >
                        Try Before You Buy
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isCheckoutOpen && (
                    <RentalCheckout 
                        product={product} 
                        onClose={() => setIsCheckoutOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </>
    );
}
