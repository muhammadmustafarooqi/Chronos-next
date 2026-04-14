"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, TrendingUp, TrendingDown, Share2, Copy, Check, Wallet } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import VaultCard from '@/components/VaultCard';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VaultPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const { error: showError, success: showSuccess } = useToast();

    const [vault, setVault]         = useState([]);
    const [stats, setStats]         = useState({ totalPurchaseValue: 0, totalMarketValue: 0 });
    const [vaultLoading, setVaultLoading] = useState(true);
    const [copied, setCopied]       = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchVault();
    }, [isAuthenticated, authLoading]);

    const fetchVault = async () => {
        setVaultLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('chronos-token') : null;
            const res = await fetch(`${API_BASE}/vault/${user?.email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            setVault(data.data.vault || []);
            setStats({
                totalPurchaseValue: data.data.totalPurchaseValue || 0,
                totalMarketValue:   data.data.totalMarketValue   || 0,
            });
        } catch (err) {
            showError('Could not load your vault. Please try again.');
        } finally {
            setVaultLoading(false);
        }
    };

    const copyShareLink = async () => {
        const url = `${window.location.origin}/vault/${encodeURIComponent(user?.email || '')}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            showSuccess('Share link copied!');
            setTimeout(() => setCopied(false), 3000);
        } catch {
            showError('Could not copy link.');
        }
    };

    const totalGain        = stats.totalMarketValue - stats.totalPurchaseValue;
    const totalGainPercent = stats.totalPurchaseValue > 0
        ? ((totalGain / stats.totalPurchaseValue) * 100).toFixed(1)
        : 0;
    const isGain = totalGain >= 0;

    if (authLoading || vaultLoading) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-black pt-24 pb-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 pb-8 border-b border-white/10">
                        <div>
                            <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-3">Personal Collection</p>
                            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">My Vault</h1>
                            <p className="text-gray-400 text-sm">Your curated portfolio of acquired timepieces</p>
                        </div>
                        <button
                            id="vault-share-btn"
                            onClick={copyShareLink}
                            className="flex items-center gap-2 px-5 py-3 border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/10 transition-colors text-xs uppercase tracking-widest"
                        >
                            {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share Vault</>}
                        </button>
                    </div>

                    {/* Stats */}
                    {vault.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white/5 border border-white/10 p-5">
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Pieces Owned</p>
                                <p className="text-4xl font-serif text-white">{vault.length}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-5">
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Total Paid</p>
                                <p className="text-4xl font-serif text-white">${stats.totalPurchaseValue?.toLocaleString()}</p>
                            </div>
                            <div className={`border p-5 ${isGain ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-red-400/5 border-red-400/20'}`}>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Collection Value</p>
                                <p className="text-4xl font-serif text-white mb-1">${stats.totalMarketValue?.toLocaleString()}</p>
                                <div className="flex items-center gap-1.5">
                                    {isGain ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-red-400" />}
                                    <span className={`text-sm font-semibold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isGain ? '+' : ''}{totalGainPercent}% since purchase
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Empty state */}
                {vault.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-24 border border-white/5 bg-white/2"
                    >
                        <Wallet size={40} className="text-gray-700 mx-auto mb-4" />
                        <h2 className="text-xl font-serif text-gray-500 mb-2">Your vault is empty</h2>
                        <p className="text-gray-600 text-sm mb-6">Each timepiece you acquire will be preserved here.</p>
                        <Link href="/shop" className="btn-primary text-xs py-3 px-8 inline-flex">
                            Explore Collection
                        </Link>
                    </motion.div>
                )}

                {/* Watch Grid */}
                {vault.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vault.map((entry, i) => (
                            <VaultCard key={entry.orderItemId || i} entry={entry} index={i} isPublicView={false} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
