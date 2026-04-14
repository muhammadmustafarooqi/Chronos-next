"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

const VaultCard = ({ entry, index, isPublicView = false }) => {
    const {
        productId,
        name,
        brand,
        image,
        pricePaid,
        currentMarketValue,
        percentChange,
        orderDate,
    } = entry;

    const isUp   = percentChange > 0;
    const isDown = percentChange < 0;
    const flat   = percentChange === 0 || percentChange === null;

    const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
    const trendColor = isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-gray-400';
    const trendBg    = isUp ? 'bg-emerald-400/10' : isDown ? 'bg-red-400/10' : 'bg-white/5';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="group relative bg-luxury-charcoal border border-white/10 hover:border-luxury-gold/30 transition-all duration-500 overflow-hidden"
        >
            {/* Gold shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-black">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <span className="text-gray-600 text-xs uppercase tracking-widest">No Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Trend badge */}
                {!isPublicView && percentChange !== null && (
                    <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 ${trendBg}`}>
                        <TrendIcon size={12} className={trendColor} />
                        <span className={`text-xs font-bold ${trendColor}`}>
                            {isUp ? '+' : ''}{percentChange?.toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-luxury-gold text-[10px] uppercase tracking-widest mb-1">{brand}</p>
                <h3 className="text-white font-serif text-base font-semibold mb-3 leading-snug">{name}</h3>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-4">
                    <Calendar size={11} />
                    <span>Acquired {new Date(orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>

                {!isPublicView && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                        <div>
                            <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-0.5">Paid</p>
                            <p className="text-white text-sm font-semibold">${pricePaid?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-0.5">Market Value</p>
                            <p className={`text-sm font-semibold ${trendColor}`}>
                                ${currentMarketValue?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {productId && (
                    <Link
                        href={`/product/${productId}`}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-white/10 text-white/50 hover:text-luxury-gold hover:border-luxury-gold/40 transition-colors text-xs uppercase tracking-widest"
                    >
                        View Details
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

export default VaultCard;
