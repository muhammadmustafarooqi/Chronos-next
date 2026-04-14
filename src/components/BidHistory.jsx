'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BidHistory({ bids }) {
    if (!bids || bids.length === 0) {
        return <p className="text-gray-500 italic">No bids placed yet. Be the first!</p>;
    }

    return (
        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
            <AnimatePresence>
                {bids.map((bid, index) => (
                    <motion.div 
                        key={`${bid.timestamp}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex justify-between items-center p-3 rounded rounded-lg ${index === 0 ? 'bg-[#1a1a1a] border border-[#D4AF37]/30' : 'bg-[#111] border border-transparent'}`}
                    >
                        <div>
                            <p className="text-sm font-medium text-white flex items-center">
                                {bid.customerName || 'Anonymous'}
                                {index === 0 && <span className="ml-2 text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded uppercase tracking-wider">Leading</span>}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <p className={`font-medium ${index === 0 ? 'text-[#D4AF37]' : 'text-gray-300'}`}>
                            ${bid.amount?.toLocaleString()}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
