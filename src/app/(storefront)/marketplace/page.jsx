import React from 'react';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ListingCard from '../../../components/ListingCard';

async function getListings() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings`);
        return res.data?.data?.listings || [];
    } catch {
        return [];
    }
}

export default async function MarketplacePage() {
    const listings = await getListings();

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-green-500 text-sm font-bold uppercase tracking-widest mb-4 block">Chronos Verified</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Collectors Marketplace</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        A secure peer-to-peer ecosystem. Buy and sell authentic luxury timepieces with full Chronos escrow protection and verification.
                    </p>
                </div>

                {/* Filters (Stub) */}
                <div className="flex flex-wrap gap-4 mb-12 border-b border-[#222] pb-8">
                    <select className="bg-[#111] border border-[#333] text-white rounded px-4 py-2 focus:outline-none focus:border-[#D4AF37]">
                        <option>All Brands</option>
                        <option>Rolex</option>
                        <option>Patek Philippe</option>
                        <option>Audemars Piguet</option>
                    </select>
                    <select className="bg-[#111] border border-[#333] text-white rounded px-4 py-2 focus:outline-none focus:border-[#D4AF37]">
                        <option>Any Condition</option>
                        <option>Unworn</option>
                        <option>Excellent</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer bg-[#111] border border-[#333] rounded px-4 py-2">
                        <input type="checkbox" className="accent-green-500" />
                        <span className="text-sm text-gray-300 uppercase tracking-widest">Chronos Verified Only</span>
                    </label>
                </div>
                
                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map(listing => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border border-[#222] rounded-2xl bg-[#111]">
                        <p className="text-gray-400 uppercase tracking-widest mb-2">No active listings.</p>
                        <p className="text-gray-500 text-sm">Be the first to list a timepiece.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
