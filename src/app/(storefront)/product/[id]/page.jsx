"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useWatches } from '@/context/WatchContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Truck, Clock, Heart, Share2, Check, ChevronRight, Star, Minus, Plus, AlertCircle, PenTool, X, Box } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import EngravingModal from '@/components/EngravingModal';
import WatchModel3D from '@/components/WatchModel3D';

const ProductDetails = () => {
    const { id } = useParams();
    const { watches } = useWatches();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToRecentlyViewed, recentlyViewed } = useRecentlyViewed();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdded, setIsAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isEngravingOpen, setIsEngravingOpen] = useState(false);
    const [engraving, setEngraving] = useState(null);
    const [view3D, setView3D] = useState(false);

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        // Support both MongoDB ObjectId (string) and numeric IDs from static data
        const found = watches.find(w =>
            String(w.id) === String(id) ||
            String(w._id) === String(id)
        );
        setProduct(found);
        if (found) addToRecentlyViewed(found);
        setLoading(false);
        setQuantity(1);
        setIsAdded(false);
        setSelectedImage(0);
        setEngraving(null);
    }, [id, watches]);

    const isOutOfStock = product?.stock !== undefined && product?.stock <= 0;
    const handleAddToCart = () => {
        if (isOutOfStock) return;
        
        // Pass engraving details along with the product
        const productToAdd = engraving ? { ...product, engraving } : product;
        
        for (let i = 0; i < quantity; i++) {
            addToCart(productToAdd);
        }
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Related products
    const relatedProducts = watches
        .filter(w => String(w.id || w._id) !== String(id) && (w.brand === product?.brand || w.category === product?.category))
        .slice(0, 4);

    if (loading) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center">
                <h2 className="text-2xl font-serif text-white mb-4">Product not found</h2>
                <Link href="/shop" className="btn-outline">
                    Return to Collection
                </Link>
            </div>
        );
    }

    const images = product.images || [product.image];

    return (
        <div className="bg-luxury-black min-h-screen pb-20">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-luxury-gold/5 via-luxury-charcoal/20 to-transparent pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 relative z-10">
                {/* Elegant integrated Breadcrumb */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide text-gray-500"
                >
                    <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
                    <span className="text-gray-700">|</span>
                    <Link href="/shop" className="hover:text-luxury-gold transition-colors">Collection</Link>
                    <span className="text-gray-700">|</span>
                    <span className="text-luxury-gold font-medium truncate">{product.name}</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Left: Image Gallery (Editorial style) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div className="aspect-[4/5] bg-gradient-to-br from-[#111] to-[#0a0a0a] overflow-hidden relative group rounded-sm border border-white/5 shadow-2xl">
                            <AnimatePresence mode="wait">
                                {view3D ? (
                                    <motion.div
                                        key="3d-view"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="w-full h-full"
                                    >
                                        <WatchModel3D product={product} />
                                    </motion.div>
                                ) : (
                                    <motion.img
                                        key={selectedImage}
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Decorative Corner Brackets */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20" />
                            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20" />
                            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20" />
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20" />

                            <div className="absolute top-8 left-8 flex flex-col gap-2">
                                {product.isNew && (
                                    <span className="bg-luxury-gold text-luxury-black text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 backdrop-blur-md shadow-lg">
                                        Novelty
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-8 right-8 p-3 rounded-full transition-all duration-300 backdrop-blur-md border ${
                                    isInWishlist(product.id)
                                        ? 'bg-luxury-gold border-luxury-gold text-luxury-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                        : 'bg-black/40 border-white/10 text-white hover:bg-luxury-gold hover:border-luxury-gold hover:text-luxury-black'
                                }`}
                            >
                                <Heart size={18} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                            </button>

                            {/* 3D Toggle Button */}
                            <button
                                onClick={() => setView3D(!view3D)}
                                className={`absolute bottom-8 right-8 flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-md border tracking-[0.2em] uppercase text-[10px] font-bold ${
                                    view3D
                                        ? 'bg-luxury-gold border-luxury-gold text-luxury-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                        : 'bg-black/40 border-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <Box size={14} />
                                {view3D ? 'Exit 3D Model' : 'View in 3D'}
                            </button>
                        </div>

                        {/* Elegant Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square overflow-hidden border transition-all duration-500 rounded-sm relative ${
                                            selectedImage === idx 
                                                ? 'border-luxury-gold opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                                                : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Right: Product Info (Sticky layout) */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="lg:sticky lg:top-36"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px bg-luxury-gold w-8" />
                                <span className="text-luxury-gold uppercase tracking-[0.4em] text-xs font-semibold">
                                    {product.brand}
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 mb-8">
                                <p className="text-3xl text-luxury-gold font-light tracking-wide">
                                    ${product.price.toLocaleString()}
                                </p>
                                <div className="w-px h-6 bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="text-luxury-gold fill-luxury-gold" />
                                        ))}
                                    </div>
                                    <span className="text-gray-500 text-xs uppercase tracking-widest">(47 Reviews)</span>
                                </div>
                            </div>

                            {/* Refined Tabs */}
                            <div className="border-b border-white/10 mb-8 flex gap-8">
                                {['description', 'specifications'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors relative ${
                                            activeTab === tab ? 'text-luxury-gold' : 'text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-luxury-gold"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-10 min-h-[140px]"
                                >
                                    {activeTab === 'description' && (
                                        <p className="text-gray-400 text-sm leading-[1.8] font-light">
                                            {product.description}
                                        </p>
                                    )}
                                    {activeTab === 'specifications' && (
                                        <ul className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
                                            {product.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3 border-b border-white/5 pb-3">
                                                    <Check size={14} className="text-luxury-gold mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-300 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Add to Cart Actions */}
                            <div className="space-y-4 mb-10">
                                <div className="flex gap-4">
                                    <div className="flex items-center border border-white/20 bg-white/5">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-5 py-4 text-gray-400 hover:text-luxury-gold hover:bg-white/5 transition-all"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-10 text-center text-white text-sm font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-5 py-4 text-gray-400 hover:text-luxury-gold hover:bg-white/5 transition-all"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAdded || isOutOfStock}
                                        className={`flex-1 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                                            isOutOfStock ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' :
                                            isAdded ? 'bg-green-600/20 text-green-400 border border-green-500/50' : 
                                            'bg-luxury-gold text-black hover:bg-white border text-center'
                                        }`}
                                    >
                                        {isOutOfStock ? (
                                            <><AlertCircle size={16} /> Sold Out</>
                                        ) : isAdded ? (
                                            <><Check size={16} /> Secured</>
                                        ) : (
                                            'Add to Bag'
                                        )}
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setIsEngravingOpen(true)}
                                    className="w-full py-3 mb-2 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-[0.2em] font-medium hover:bg-luxury-gold/10 transition-colors duration-300 flex justify-center items-center gap-2"
                                >
                                    <PenTool size={14} />
                                    {engraving ? 'Edit Personalised Engraving' : 'Add Personalised Engraving'}
                                </button>
                                {engraving && (
                                    <div className="flex items-center justify-between px-4 py-2 bg-luxury-gold/5 border border-luxury-gold/20 mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500">Engraving</span>
                                            <span className="text-luxury-gold text-sm font-serif">"{engraving.text}"</span>
                                        </div>
                                        <button onClick={() => setEngraving(null)} className="text-gray-500 hover:text-white p-1"><X size={14} /></button>
                                    </div>
                                )}
                                <button className="w-full py-4 border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-colors duration-300">
                                    Contact Private Concierge
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                                {[
                                    { icon: Shield, title: '5 Year Warranty', subtitle: 'Global Coverage' },
                                    { icon: Truck, title: 'Complimentary', subtitle: 'Overnight Delivery' },
                                    { icon: Clock, title: 'Certified', subtitle: '100% Authentic' },
                                ].map((badge, index) => (
                                    <div key={index} className="flex flex-col items-start">
                                        <badge.icon className="text-luxury-gold mb-3" size={24} strokeWidth={1.5} />
                                        <p className="text-white text-xs font-semibold mb-1 tracking-wide">{badge.title}</p>
                                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">{badge.subtitle}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="py-20 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="text-3xl font-serif text-white mb-2">You May Also Like</h2>
                            <div className="h-0.5 w-16 bg-luxury-gold" />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct, index) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.filter(p => String(p._id || p.id) !== String(id)).length > 0 && (
                <section className="py-20 border-t border-white/5 bg-luxury-charcoal/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="text-3xl font-serif text-white mb-2">Recently Viewed</h2>
                            <div className="h-0.5 w-16 bg-luxury-gold" />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recentlyViewed
                                .filter(p => String(p._id || p.id) !== String(id))
                                .slice(0, 4)
                                .map((p, index) => (
                                    <ProductCard key={p._id || p.id} product={p} index={index} />
                                ))}
                        </div>
                    </div>
                </section>
            )}

            <EngravingModal 
                isOpen={isEngravingOpen} 
                onClose={() => setIsEngravingOpen(false)} 
                onSave={setEngraving} 
            />
        </div>
    );
};

export default ProductDetails;
