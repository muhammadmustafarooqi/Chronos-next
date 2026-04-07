import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Bell,
    Shield,
    Globe,
    Database,
    Save,
    Layout,
    Mail,
    Smartphone,
    CreditCard,
    Upload,
    Check,
    AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { watches as localWatches } from '../../data/watches';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [isSeedingDb, setIsSeedingDb] = useState(false);
    const [seedStatus, setSeedStatus] = useState(null); // 'success' | 'error' | null

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'appearance', label: 'Appearance', icon: Layout },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'payments', label: 'Payments', icon: CreditCard },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    const handleSeedDatabase = async () => {
        if (!window.confirm('This will upload all 24 default watches to your MongoDB database. Continue?')) return;
        setIsSeedingDb(true);
        setSeedStatus(null);
        try {
            // Format watches for API
            const formatted = localWatches.map(w => ({
                name: w.name,
                brand: w.brand,
                price: w.price,
                images: w.images,
                category: w.category,
                description: w.description || '',
                features: w.features || [],
                isNew: w.isNew || false,
                isFeatured: w.isFeatured || false,
                stock: 10
            }));
            await api.admin.seedProducts(formatted);
            setSeedStatus('success');
        } catch (err) {
            console.error('Seed failed:', err);
            setSeedStatus('error');
        } finally {
            setIsSeedingDb(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Store Settings</h1>
                    <p className="text-gray-400">Configure your luxury timepiece boutique's core parameters.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary py-2 px-8 rounded-full flex items-center gap-2 group"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save size={18} className="group-hover:scale-110 transition-transform" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-luxury-gold text-luxury-black font-bold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-luxury-black border border-white/5 rounded-3xl p-8 min-h-[500px]">
                    {activeTab === 'general' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-xl font-serif font-bold text-white border-b border-white/5 pb-4">General Configuration</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Store Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Chronos Luxury"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-luxury-gold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Support Email</label>
                                    <input
                                        type="email"
                                        defaultValue="concierge@chronos.luxury"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-luxury-gold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Curreny</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-luxury-gold">
                                        <option className="bg-luxury-black">USD ($) - US Dollar</option>
                                        <option className="bg-luxury-black">EUR (€) - Euro</option>
                                        <option className="bg-luxury-black">GBP (£) - British Pound</option>
                                        <option className="bg-luxury-black">CHF (₣) - Swiss Franc</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Timezone</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-luxury-gold">
                                        <option className="bg-luxury-black">GMT-05:00 Eastern Time</option>
                                        <option className="bg-luxury-black">GMT+00:00 London</option>
                                        <option className="bg-luxury-black">GMT+01:00 Geneva</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8">
                                <h3 className="text-sm font-bold text-white mb-4">Database Management</h3>
                                <div className="space-y-4">
                                    {/* Seed Database */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                                                <Upload className="text-luxury-gold" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Seed Product Database</p>
                                                <p className="text-xs text-gray-500">Upload all 24 default timepieces to MongoDB.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {seedStatus === 'success' && (
                                                <span className="flex items-center gap-1 text-green-400 text-xs"><Check size={12} /> Done!</span>
                                            )}
                                            {seedStatus === 'error' && (
                                                <span className="flex items-center gap-1 text-red-400 text-xs"><AlertCircle size={12} /> Failed</span>
                                            )}
                                            <button
                                                onClick={handleSeedDatabase}
                                                disabled={isSeedingDb}
                                                className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-luxury-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                                            >
                                                {isSeedingDb ? (
                                                    <div className="w-3 h-3 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Database size={14} />
                                                )}
                                                {isSeedingDb ? 'Seeding...' : 'Seed Now'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Maintenance Mode */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center">
                                                <Database className="text-amber-400" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Maintenance Mode</p>
                                                <p className="text-xs text-gray-500">Only administrators can access the storefront.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab !== 'general' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-luxury-gold">
                                <Globe size={40} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif text-white">{tabs.find(t => t.id === activeTab).label} Settings</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-2">These advanced configuration options are currently being refined for the production environment.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
