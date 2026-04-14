"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    User,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    History,
    MoreVertical,
    Check,
    X,
    Ban
} from 'lucide-react';
import { useCustomers } from '@/context/CustomerContext';

const AdminCustomers = () => {
    const { customers, updateCustomerStatus } = useCustomers();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Customer Base</h1>
                    <p className="text-gray-400">Manage your clientele and their purchase history.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-luxury-gold/50 transition-colors text-sm">
                        Export CRM
                    </button>
                    <button className="btn-primary py-2 px-6 rounded-lg text-xs">
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-luxury-black border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-sm hover:border-luxury-gold/50 transition-colors">
                    <History size={18} />
                    <span>Active Since</span>
                </button>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer, index) => (
                    <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-luxury-black border border-white/5 rounded-2xl overflow-hidden hover:border-luxury-gold/30 transition-all group"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-white/5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-gold p-px">
                                        <div className="w-full h-full rounded-full bg-luxury-black flex items-center justify-center overflow-hidden">
                                            <User size={20} className="text-luxury-gold" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-luxury-gold transition-colors">{customer.name}</h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${customer.status === 'Active' ? 'text-green-400 border-green-400/20 bg-green-400/10' : 'text-gray-500 border-gray-500/20 bg-gray-500/10'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Mail size={14} className="text-luxury-gold" />
                                    <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Phone size={14} className="text-luxury-gold" />
                                    <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Calendar size={14} className="text-luxury-gold" />
                                    <span>Joined {new Date(customer.joinedDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Orders</p>
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <History size={14} className="text-luxury-gold" />
                                        {customer.totalOrders}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Spend</p>
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <DollarSign size={14} className="text-luxury-gold" />
                                        ${customer.totalSpend.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                            <button className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                View History
                            </button>
                            {customer.status === 'Active' ? (
                                <button
                                    onClick={() => updateCustomerStatus(customer.id, 'Inactive')}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Deactivate Customer"
                                >
                                    <Ban size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => updateCustomerStatus(customer.id, 'Active')}
                                    className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all"
                                    title="Activate Customer"
                                >
                                    <Check size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminCustomers;

