import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare, ShoppingBag, Check, ArrowRight, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// ── BOTTOM DRAWER ──────────────────────────────────────────────────
const CompareDrawer = ({ items, onRemove, onClear }) => {
    if (items.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-[80] bg-luxury-charcoal/95 backdrop-blur-3xl border-t border-luxury-gold/40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
                {/* Glow bar */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent opacity-50" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <GitCompare className="text-luxury-gold" size={18} />
                            <span className="text-white font-medium text-xs uppercase tracking-[0.2em]">
                                Technical Comparison ({items.length}/3)
                            </span>
                        </div>
                        <button
                            onClick={onClear}
                            className="text-gray-400 hover:text-white text-[10px] uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                            <X size={14} /> Clear Selection
                        </button>
                    </div>

                    {/* Items Strip */}
                    <div className="flex gap-4 py-4 overflow-x-auto scrollbar-hide">
                        {items.map(product => {
                            const productId = product._id || product.id;
                            return (
                                <div key={productId} className="flex-shrink-0 flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-none w-64 md:w-72 relative group hover:border-luxury-gold/30 transition-colors">
                                    <div className="w-16 h-16 bg-[#0a0a0a] flex-shrink-0 border border-white/5 relative overflow-hidden">
                                        <img
                                            src={product.images ? product.images[0] : product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-6">
                                        <p className="text-luxury-gold text-[9px] uppercase tracking-[0.2em] mb-1 truncate">{product.brand}</p>
                                        <p className="text-white text-xs font-serif truncate">{product.name}</p>
                                        <p className="text-gray-500 text-[10px] mt-1">${product.price?.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => onRemove(productId)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all rounded-full backdrop-blur-sm"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Empty Slots */}
                        {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="flex-shrink-0 flex items-center justify-center bg-white/3 border border-dashed border-white/10 w-64 md:w-72">
                                <span className="text-gray-600 text-[10px] uppercase tracking-widest text-center px-4">
                                    Select another timepiece to compare
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// ── ADVANCED COMPARE MODAL (TABLE STYLED) ──────────────────────────
export const CompareModal = ({ items, onClose, onRemove }) => {
    const { addToCart } = useCart();

    // Dynamically extract all unique features exactly across all selected items
    const allUniqueFeatures = useMemo(() => {
        const featureSet = new Set();
        items.forEach(item => {
            if (item.features) {
                item.features.forEach(f => featureSet.add(f));
            }
        });
        return Array.from(featureSet).sort();
    }, [items]);

    const checkHasFeature = (strList, targetFeature) => {
        if (!strList) return false;
        return strList.includes(targetFeature);
    };

    if (!items || items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-[#050505] overflow-hidden"
        >
            {/* Header */}
            <div className="flex-none bg-luxury-charcoal/95 backdrop-blur-xl border-b border-white/10 px-6 lg:px-12 py-5 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-luxury-gold/30 flex items-center justify-center">
                        <GitCompare className="text-luxury-gold" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-white tracking-wide">Technical Specifications</h2>
                        <p className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] mt-1">Side-by-side comparison</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 bg-white/5 hover:bg-luxury-gold text-gray-400 hover:text-black transition-colors rounded-none flex items-center gap-2 text-xs uppercase tracking-widest font-semibold"
                >
                    Close <X size={16} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-auto relative">
                <div className="min-w-[800px] w-full mx-auto pb-24 h-full relative" style={{ maxWidth: '1400px' }}>
                    
                    {/* The Grid Table */}
                    <table className="w-full text-left border-collapse table-fixed">
                        {/* ── Table Head: Images and Core Info ── */}
                        <thead className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-b border-white/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-luxury-charcoal/40 before:pointer-events-none">
                            <tr>
                                <th className="w-1/4 p-6 align-bottom border-r border-white/5 relative bg-[#050505]">
                                    <div className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Select Models</div>
                                    <p className="text-white font-serif mt-2 text-lg leading-snug">Compare up to 3 exceptional timepieces side by side.</p>
                                </th>
                                {items.map((item, index) => (
                                    <th key={item._id || item.id} className="w-1/4 p-6 align-top border-r border-white/5 relative bg-[#050505]">
                                        <div className="relative aspect-square w-full bg-[#0a0a0a] border border-white/5 mb-6 group overflow-hidden">
                                            <img
                                                src={item.images ? item.images[0] : item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                            <button
                                                onClick={() => onRemove(item._id || item.id)}
                                                className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-red-900 border border-white/20 hover:border-red-500 text-white transition-all backdrop-blur-md"
                                                title="Remove from comparison"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <p className="text-luxury-gold text-[10px] uppercase tracking-[0.2em] mb-2">{item.brand}</p>
                                        <h3 className="text-white font-serif text-xl mb-4 leading-snug line-clamp-2" style={{ minHeight: '3.5rem' }}>{item.name}</h3>
                                        <div className="flex items-end justify-between border-t border-white/10 pt-4">
                                            <span className="text-2xl text-white font-light tracking-wide">${item.price?.toLocaleString()}</span>
                                            <button
                                                onClick={() => !(item.stock <= 0) && addToCart(item)}
                                                disabled={item.stock <= 0}
                                                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors border ${
                                                    item.stock <= 0 
                                                        ? 'bg-transparent border-gray-700 text-gray-500 cursor-not-allowed'
                                                        : 'bg-luxury-gold border-luxury-gold text-black hover:bg-white hover:border-white'
                                                }`}
                                            >
                                                {item.stock <= 0 ? 'Sold Out' : 'Add to Bag'}
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                {/* Empty Column for alignment if < 3 items */}
                                {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
                                    <th key={i} className="w-1/4 p-6 align-top border-r border-white/5 bg-[#050505]" />
                                ))}
                            </tr>
                        </thead>

                        {/* ── Table Body: Specs ── */}
                        <tbody>
                            {/* Section Topic */}
                            <tr>
                                <td colSpan={4} className="p-6 bg-[#0a0a0a] border-b border-t border-white/10">
                                    <span className="text-white font-serif text-lg flex items-center gap-3">
                                        <div className="w-1 h-4 bg-luxury-gold" />
                                        General Information
                                    </span>
                                </td>
                            </tr>
                            
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-6 text-gray-400 text-sm font-medium border-r border-white/5 bg-[#0a0a0a]/30">Category</td>
                                {items.map(item => (
                                    <td key={item._id || item.id} className="p-6 text-white text-sm border-r border-white/5">{item.category}</td>
                                ))}
                                {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => <td key={i} className="border-r border-white/5" />)}
                            </tr>

                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-6 text-gray-400 text-sm font-medium border-r border-white/5 bg-[#0a0a0a]/30">Status</td>
                                {items.map(item => (
                                    <td key={item._id || item.id} className="p-6 text-sm border-r border-white/5">
                                        {item.stock > 0 
                                            ? <span className="text-green-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> In Stock</span>
                                            : <span className="text-gray-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"/> Out of Stock</span>
                                        }
                                    </td>
                                ))}
                                {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => <td key={i} className="border-r border-white/5" />)}
                            </tr>

                            {/* Section Topic: Technical Specs */}
                            <tr>
                                <td colSpan={4} className="p-6 bg-[#0a0a0a] border-b border-t border-white/10 mt-8">
                                    <span className="text-white font-serif text-lg flex items-center gap-3">
                                        <div className="w-1 h-4 bg-luxury-gold" />
                                        Features & Specifications
                                    </span>
                                </td>
                            </tr>

                            {/* Dynamically list ALL features found across the models */}
                            {allUniqueFeatures.length > 0 ? (
                                allUniqueFeatures.map((featureName, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-gray-400 text-sm border-r border-white/5 bg-[#0a0a0a]/30 pr-8">{featureName}</td>
                                        {items.map(item => {
                                            const hasIt = checkHasFeature(item.features, featureName);
                                            return (
                                                <td key={item._id || item.id} className="p-6 border-r border-white/5 text-center">
                                                    {hasIt 
                                                        ? <Check size={18} className="text-luxury-gold mx-auto" />
                                                        : <Minus size={18} className="text-gray-700 mx-auto" />
                                                    }
                                                </td>
                                            );
                                        })}
                                        {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => <td key={i} className="border-r border-white/5" />)}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-6 text-gray-500 text-center italic">No technical features listed for these models.</td>
                                </tr>
                            )}

                            {/* Section Topic: Descriptions */}
                            <tr>
                                <td colSpan={4} className="p-6 bg-[#0a0a0a] border-b border-t border-white/10 mt-8">
                                    <span className="text-white font-serif text-lg flex items-center gap-3">
                                        <div className="w-1 h-4 bg-luxury-gold" />
                                        Tale of the Timepiece
                                    </span>
                                </td>
                            </tr>
                            
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-6 text-gray-400 text-sm font-medium border-r border-white/5 align-top bg-[#0a0a0a]/30">Description</td>
                                {items.map(item => (
                                    <td key={item._id || item.id} className="p-6 text-gray-400 text-xs leading-loose border-r border-white/5 align-top">
                                        {item.description}
                                        <Link
                                            to={`/product/${item._id || item.id}`}
                                            onClick={onClose}
                                            className="mt-6 flex items-center gap-2 text-luxury-gold hover:text-white uppercase tracking-widest text-[10px] font-semibold transition-colors w-max"
                                        >
                                            View Full Details <ArrowRight size={14} />
                                        </Link>
                                    </td>
                                ))}
                                {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => <td key={i} className="border-r border-white/5" />)}
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default CompareDrawer;
