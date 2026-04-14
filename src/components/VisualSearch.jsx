'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Upload, X, Search, Watch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function VisualSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size exceeds 5MB limit. Please upload a smaller image.');
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };


    const handleSearch = async () => {
        if (!image) return;
        setLoading(true);
        setResults(null);

        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/visual-search`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResults(res.data?.data || { products: [] });
        } catch (err) {
            alert('Visual search failed. Please try another image.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setImage(null);
        setPreview(null);
        setResults(null);
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Visual Search"
            >
                <Camera className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-4xl p-6 relative"
                        >
                            <button 
                                onClick={() => { setIsOpen(false); reset(); }} 
                                className="absolute top-4 right-4 text-gray-500 hover:text-white bg-[#222] rounded-full p-2"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif text-white mb-2">Visual AI Search</h2>
                                <p className="text-gray-400">Upload a photo of any watch to find similar pieces in our catalog.</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Upload / Preview Section */}
                                <div className="md:w-1/2 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#333] rounded-xl relative min-h-[300px]">
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="max-w-full max-h-[300px] object-contain rounded" />
                                            <button 
                                                onClick={reset}
                                                className="absolute top-4 right-4 bg-red-500/20 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            <div className="bg-[#222] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-colors text-gray-400">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="text-white font-medium mb-1">Click to upload photo</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">or drop image here</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    
                                    {preview && !results && !loading && (
                                        <button 
                                            onClick={handleSearch}
                                            className="mt-6 w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Search className="w-5 h-5" /> Analyze Image
                                        </button>
                                    )}
                                    {loading && (
                                        <div className="mt-6 text-[#D4AF37] font-medium flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                                            AI Processing...
                                        </div>
                                    )}
                                </div>

                                {/* Results Section */}
                                <div className="md:w-1/2 flex flex-col">
                                    {results ? (
                                        <div className="h-full flex flex-col">
                                            <div className="mb-6 pb-4 border-b border-[#333]">
                                                <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-3">AI Detection Profile</h3>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <p><span className="text-gray-500">Brand:</span> <span className="text-white capitalize">{results.detectedProfile?.brand || 'Unknown'}</span></p>
                                                    <p><span className="text-gray-500">Style:</span> <span className="text-white capitalize">{results.detectedProfile?.style || 'Unknown'}</span></p>
                                                    <p><span className="text-gray-500">Dial:</span> <span className="text-white capitalize">{results.detectedProfile?.dialColor || 'Unknown'}</span></p>
                                                    <p><span className="text-gray-500">Case:</span> <span className="text-white capitalize">{results.detectedProfile?.caseColor || 'Unknown'}</span></p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                                <h3 className="text-white font-serif mb-4 flex items-center gap-2">
                                                    <Watch className="w-5 h-5 text-[#D4AF37]" /> Matches ({results.products?.length || 0})
                                                </h3>
                                                
                                                {results.products?.length > 0 ? (
                                                    <div className="grid gap-4">
                                                        {results.products.map(p => (
                                                            <Link key={p._id} href={`/product/${p._id}`} onClick={() => setIsOpen(false)}>
                                                                <div className="bg-[#0a0a0a] border border-[#222] p-3 rounded flex items-center gap-4 hover:border-[#D4AF37] transition-colors">
                                                                    <div className="w-16 h-16 bg-[#111] rounded flex items-center justify-center">
                                                                        <img src={p.images?.[0]} alt={p.name} className="max-w-full max-h-full object-contain" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white text-sm font-medium">{p.name}</p>
                                                                        <p className="text-gray-500 text-xs mt-1">{p.brand}</p>
                                                                        <p className="text-[#D4AF37] text-sm mt-1">${p.price?.toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <p className="text-gray-500 italic">No exact matches found in catalog.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center p-8">
                                            <p className="text-gray-500 text-sm">Upload an image and hit Analyze to see matches based on style, brand, and features.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
