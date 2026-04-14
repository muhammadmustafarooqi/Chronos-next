"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Check, GitCompare, AlertCircle, Crown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useVIP } from '@/context/VIPContext';

const ProductCard = ({ product, index = 0, onCompare, isComparing = false }) => {
    const { addToCart, isInCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { enrolled: isVIP } = useVIP();
    const [isAdded, setIsAdded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const productId = product._id || product.id;
    const isWishlisted = isInWishlist(productId);
    const inCart = isInCart(productId);

    // Determine stock status
    const stock = product.stock;
    const isOutOfStock = stock !== undefined && stock <= 0;
    const isLowStock = stock !== undefined && stock > 0 && stock <= 3;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleCompare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onCompare) onCompare(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
            className={`group product-card rounded-sm relative overflow-hidden bg-white/[0.02] border border-white/5 hover:border-luxury-gold/20 hover:bg-white/[0.04] transition-all duration-700 backdrop-blur-md flex flex-col h-full ${isComparing ? 'ring-2 ring-luxury-gold shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]'}`}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/5]">
                {/* Loading Skeleton */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-luxury-charcoal animate-pulse" />
                )}

                <img
                    src={product.images ? product.images[0] : product.image}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                />

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-10">
                        <span className="bg-transparent text-gray-400 text-xs font-bold uppercase tracking-[0.3em] px-4 py-2 border border-gray-600/50">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Overlay Gradient (cinematic dark bottom) */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
                    {product.isNew && !isOutOfStock && (
                        <motion.span
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={`${isVIP ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30' : 'bg-white text-black'} backdrop-blur-md text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 flex items-center gap-1.5`}
                        >
                            {isVIP ? <><Crown size={10} className="text-luxury-gold" /> Early Access</> : 'New'}
                        </motion.span>
                    )}
                    {product.isFeatured && (
                        <span className="bg-white/5 backdrop-blur-md border border-white/10 text-white text-[9px] font-medium uppercase tracking-[0.2em] px-3 py-1">
                            Featured
                        </span>
                    )}
                    {isLowStock && !isOutOfStock && (
                        <span className="bg-red-900/40 border border-red-500/30 backdrop-blur-md text-red-200 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 flex items-center gap-1">
                            <AlertCircle size={10} /> {stock} left
                        </span>
                    )}
                </div>

                {/* Wishlist Button (subtle appearance) */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-5 right-5 p-2 rounded-full backdrop-blur-md transition-all duration-500 z-20 ${isWishlisted
                        ? 'bg-luxury-gold text-luxury-black'
                        : 'bg-black/20 text-white/50 border border-white/10 hover:bg-luxury-gold hover:text-luxury-black opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                        }`}
                >
                    <Heart size={14} className={isWishlisted ? 'fill-current' : ''} />
                </button>

                {/* Compare Button */}
                {onCompare && (
                    <button
                        onClick={handleCompare}
                        title="Compare"
                        className={`absolute top-14 right-5 p-2 rounded-full backdrop-blur-md transition-all duration-500 delay-75 z-20 ${isComparing
                            ? 'bg-luxury-gold text-luxury-black'
                            : 'bg-black/20 text-white/50 border border-white/10 hover:bg-luxury-gold hover:text-luxury-black opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                            }`}
                    >
                        <GitCompare size={14} />
                    </button>
                )}

                {/* Quick Actions (Floating inside image on hover) */}
                <div className="absolute bottom-5 left-5 right-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-20">
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded || isOutOfStock}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 backdrop-blur-md ${isOutOfStock
                                ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                                : isAdded
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                    : 'bg-white/10 text-white border border-white/20 hover:bg-luxury-gold hover:border-luxury-gold hover:text-black'
                                }`}
                        >
                            {isOutOfStock ? (
                                'Unavailable'
                            ) : isAdded ? (
                                <><Check size={14} /> Secured</>
                            ) : (
                                <><ShoppingBag size={14} /> Add to Bag</>
                            )}
                        </button>
                        <Link 
                            href={`/product/${productId}`}
                            className="flex items-center justify-center p-3 bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-300"
                        >
                            <Eye size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-6 relative flex-grow flex flex-col">
                {/* Minimal Top-Border Glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />


                <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-luxury-gold text-[10px] uppercase tracking-[0.25em] font-semibold">
                            {product.brand}
                        </span>
                        <div className="h-px w-4 bg-white/20" />
                        <span className="text-gray-500 text-[10px] uppercase tracking-[0.1em]">
                            {product.category}
                        </span>
                    </div>

                    <Link href={`/product/${productId}`}>
                        <h3 className="text-lg md:text-xl font-serif text-white mb-4 group-hover:text-luxury-gold transition-colors duration-500 min-h-[3.5rem] leading-snug">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-end justify-between mt-auto">
                        <span className={`text-xl font-light tracking-wide ${isOutOfStock ? 'text-gray-600' : 'text-white'}`}>
                            ${product.price.toLocaleString()}
                        </span>
                        <Link 
                            href={`/product/${productId}`}
                            className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] group-hover:text-luxury-gold transition-colors duration-300 relative overflow-hidden pb-1"
                        >
                            <span className="relative z-10">Discover</span>
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;


