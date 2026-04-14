"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    X,
    Upload,
    Check
} from 'lucide-react';
import { useWatches } from '@/context/WatchContext';

const AdminProducts = () => {
    const { watches, deleteWatch, addWatch, updateWatch } = useWatches();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const filteredProducts = watches.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this timepiece?')) {
            deleteWatch(id);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Product Management</h1>
                    <p className="text-gray-400">Manage your luxury timepiece collection.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary py-3 px-8 rounded-full flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Add Timepiece</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-luxury-black border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-sm hover:border-luxury-gold/50 transition-colors">
                    <Filter size={18} />
                    <span>Filters</span>
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-luxury-black border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Brand</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{product.name}</p>
                                                <p className="text-xs text-gray-500">ID: #{product.id.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{product.brand}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-white">
                                        ${product.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock !== undefined ? (
                                            <span className={`text-sm font-bold ${
                                                product.stock <= 0 ? 'text-red-400' :
                                                product.stock <= 3 ? 'text-orange-400' :
                                                'text-green-400'
                                            }`}>
                                                {product.stock <= 0 ? 'Out of Stock' : `${product.stock} left`}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 text-xs">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.isFeatured ? 'bg-luxury-gold animate-pulse' : 'bg-gray-600'}`} />
                                            <span className="text-xs text-gray-400">{product.isFeatured ? 'Featured' : 'Standard'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingProduct(product)}
                                                className="p-2 text-gray-400 hover:text-luxury-gold bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {(isAddModalOpen || editingProduct) && (
                    <ProductModal
                        isOpen={true}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            setEditingProduct(null);
                        }}
                        product={editingProduct}
                        onSave={(data) => {
                            if (editingProduct) {
                                updateWatch(editingProduct.id, data);
                            } else {
                                addWatch(data);
                            }
                            setIsAddModalOpen(false);
                            setEditingProduct(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
    const [formData, setFormData] = useState(product || {
        name: '',
        brand: '',
        price: '',
        category: 'Luxury',
        description: '',
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80'],
        features: [],
        isNew: true,
        isFeatured: false,
        stock: 10
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: Number(formData.price)
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-luxury-black border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold text-white">
                        {product ? 'Edit Timepiece' : 'Add New Timepiece'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Model Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-luxury-gold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Brand</label>
                            <input
                                required
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-luxury-gold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Price (USD)</label>
                            <input
                                required
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-luxury-gold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-luxury-gold"
                            >
                                {['Luxury','Sport','Classic','Diver','Pilot','Racing','Heritage','Dress','Explorer','Exotic'].map(cat => (
                                    <option key={cat} className="bg-luxury-black" value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Stock & Image Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Stock Quantity</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.stock ?? 10}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-luxury-gold"
                                placeholder="10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Image URL</label>
                            <input
                                type="url"
                                value={formData.images?.[0] || ''}
                                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-luxury-gold"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-luxury-gold resize-none"
                        />
                    </div>

                    <div className="flex gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="hidden"
                            />
                            <div className={`w-6 h-6 rounded-md border border-white/10 flex items-center justify-center transition-colors ${formData.isFeatured ? 'bg-luxury-gold border-luxury-gold' : 'bg-white/5'}`}>
                                {formData.isFeatured && <Check size={16} className="text-luxury-black font-bold" />}
                            </div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Featured Product</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.isNew}
                                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                className="hidden"
                            />
                            <div className={`w-6 h-6 rounded-md border border-white/10 flex items-center justify-center transition-colors ${formData.isNew ? 'bg-luxury-gold border-luxury-gold' : 'bg-white/5'}`}>
                                {formData.isNew && <Check size={16} className="text-luxury-black font-bold" />}
                            </div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">New Arrival</span>
                        </label>
                    </div>
                </form>

                <div className="p-6 border-t border-white/5 flex items-center justify-end gap-4 bg-white/5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="btn-primary py-2 px-8 rounded-full text-xs"
                    >
                        {product ? 'Update Timepiece' : 'Add Timepiece'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminProducts;

