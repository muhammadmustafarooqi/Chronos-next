"use client";
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-black border-l border-white/10 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-luxury-gold" size={20} />
                                <h2 className="text-xl font-serif text-white">Your Cart</h2>
                                <span className="text-xs text-gray-500">({cartCount} items)</span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingBag className="text-gray-600" size={32} />
                                    </div>
                                    <h3 className="text-white font-serif text-xl mb-2">Your cart is empty</h3>
                                    <p className="text-gray-500 text-sm mb-6">Discover our exquisite collection of timepieces</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="btn-outline text-sm"
                                    >
                                        <Link href="/shop" className="flex items-center gap-2">
                                            Continue Shopping <ArrowRight size={14} />
                                        </Link>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex gap-4 pb-6 border-b border-white/5"
                                        >
                                            {/* Image */}
                                            <div className="w-24 h-28 bg-luxury-charcoal overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-luxury-gold text-[10px] uppercase tracking-wider">
                                                    {item.brand}
                                                </span>
                                                <h4 className="text-white font-serif text-sm mt-1 truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    ${item.price.toLocaleString()}
                                                </p>

                                                {/* Quantity & Remove */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-white/10">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="px-3 text-white text-sm">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="border-t border-white/10 p-6 bg-luxury-charcoal">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="text-white">${cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="text-luxury-gold">Complimentary</span>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="flex justify-between">
                                        <span className="text-white font-medium">Total</span>
                                        <span className="text-white text-xl font-serif">
                                            ${cartTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <Link 
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="btn-primary w-full text-center block mb-3"
                                >
                                    Proceed to Checkout
                                </Link>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full text-center text-gray-400 hover:text-white text-sm transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;


