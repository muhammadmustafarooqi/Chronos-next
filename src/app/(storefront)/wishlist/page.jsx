"use client";
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="text-gray-600" size={40} />
                    </div>
                    <h2 className="text-3xl font-serif text-white mb-4">Your Wishlist is Empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md">
                        Save your favorite timepieces here for easy access later.
                    </p>
                    <Link   href="/shop" className="btn-primary inline-flex items-center gap-3">
                        Explore Collection <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-black">
            {/* Header */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal to-luxury-black" />
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Heart className="text-luxury-gold" size={24} />
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em]">
                                My Collection
                            </span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-white mb-4">
                            Wishlist
                        </h1>
                        <p className="text-gray-400">
                            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Wishlist Items */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-gray-500 text-sm">
                            Your saved timepieces
                        </p>
                        <button
                            onClick={clearWishlist}
                            className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {wishlist.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-luxury-charcoal border border-white/5 hover:border-luxury-gold/30 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={item.images ? item.images[0] : item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white hover:bg-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        {/* Quick Actions */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm"
                                            >
                                                <ShoppingBag size={16} />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <span className="text-luxury-gold text-[10px] uppercase tracking-[0.2em]">
                                            {item.brand}
                                        </span>
                                        <Link   href={`/product/${item.id}`}>
                                            <h3 className="text-lg font-serif text-white mt-1 hover:text-luxury-gold transition-colors line-clamp-1">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xl text-white font-light mt-2">
                                            ${item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Continue Shopping */}
                    <div className="text-center mt-12">
                        <Link  
                            href="/shop"
                            className="inline-flex items-center gap-3 text-luxury-gold hover:text-white transition-colors group"
                        >
                            <span className="uppercase tracking-wider text-sm">Continue Shopping</span>
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Wishlist;

