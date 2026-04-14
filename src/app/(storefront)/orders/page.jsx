"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle, Truck, ArrowLeft, ShoppingBag } from 'lucide-react';

const MyOrders = () => {
    const { orders } = useOrders();
    const { user } = useAuth();

    const userOrders = orders.filter(order => order.email === user?.email);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={18} className="text-green-400" />;
            case 'Shipped': return <Truck size={18} className="text-blue-400" />;
            case 'Processing': return <Clock size={18} className="text-amber-400" />;
            default: return <Package size={18} className="text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-400 bg-green-400/10';
            case 'Shipped': return 'text-blue-400 bg-blue-400/10';
            case 'Processing': return 'text-amber-400 bg-amber-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="min-h-screen bg-luxury-black pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link   href="/account" className="flex items-center gap-2 text-gray-500 hover:text-luxury-gold transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Account
                </Link>

                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">My Orders</h1>
                    <p className="text-gray-500">Track and manage your luxury timepiece purchases.</p>
                </div>

                {userOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-12 text-center"
                    >
                        <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-gray-600" size={32} />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-4">No Orders Found</h3>
                        <p className="text-gray-500 mb-8">You haven't placed any orders yet. Explore our collection and find your perfect watch.</p>
                        <Link   href="/shop" className="btn-primary">
                            Browse Collection
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {userOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card overflow-hidden"
                            >
                                <div className="p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Order ID</p>
                                            <p className="text-white font-mono text-sm">{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Placed On</p>
                                            <p className="text-white text-sm">{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total</p>
                                            <p className="text-luxury-gold font-bold text-sm">
                                                ${(order.totalAmount || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full border border-white/5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-luxury-charcoal rounded overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{item.name}</p>
                                                        <p className="text-gray-500 text-xs text-luxury-gold">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="text-white font-serif font-bold">${item.price.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <Truck size={16} />
                                            <span>Standard Shipping to {
                                                typeof order.shippingAddress === 'string'
                                                    ? order.shippingAddress.split(',')[1] || order.shippingAddress
                                                    : order.shippingAddress?.city || order.shippingAddressFormatted || 'Address'
                                            }</span>
                                        </div>
                                        <button className="text-luxury-gold text-sm hover:underline font-medium">
                                            View Order Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

