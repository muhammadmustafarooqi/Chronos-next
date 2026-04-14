"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import VaultCard from '@/components/VaultCard';
import { useToast } from '@/context/ToastContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PublicVaultPage({ params }) {
    const { customerId } = params;
    const [vault, setVault] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error: showError } = useToast();

    useEffect(() => {
        const fetchVault = async () => {
            try {
                const res = await fetch(`${API_BASE}/vault/${encodeURIComponent(customerId)}`);
                const data = await res.json();
                if (!data.success) throw new Error(data.message);
                setVault(data.data.vault || []);
            } catch {
                showError('Could not load this vault.');
            } finally {
                setLoading(false);
            }
        };
        fetchVault();
    }, [customerId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-black pt-24 pb-24 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="w-14 h-14 rounded-full border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
                        <Gem size={22} className="text-luxury-gold" />
                    </div>
                    <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-3">Shared Collection</p>
                    <h1 className="text-4xl font-serif text-white mb-3">The Vault</h1>
                    <p className="text-gray-500 text-sm">A curated collection of exceptional timepieces</p>
                </motion.div>

                {vault.length === 0 ? (
                    <div className="text-center py-20 text-gray-600">This vault is empty.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vault.map((entry, i) => (
                            <VaultCard key={entry.orderItemId || i} entry={entry} index={i} isPublicView={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
