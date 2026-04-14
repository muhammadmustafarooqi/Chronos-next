import React from 'react';
import axios from 'axios';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import SellerProfile from '../../../../components/SellerProfile';
import { ShieldCheck, AlertCircle, Eye } from 'lucide-react';

async function getListing(id) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/${id}`);
        return res.data?.data?.listing || null;
    } catch {
        return null;
    }
}

export default async function ListingDetailPage({ params }) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <h1 className="text-2xl text-white font-serif">Listing Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Images */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative mb-6">
                            <img 
                                src={listing.images?.[0] || listing.product?.images?.[0] || '/placeholder.png'} 
                                alt={listing.watchName} 
                                className="max-w-full max-h-full object-contain"
                            />
                            {listing.isChronosVerified && (
                                <div className="absolute top-6 left-6 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded flex items-center gap-2 shadow-xl">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="font-bold uppercase tracking-wider text-sm">Chronos Verified</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                            <h2 className="text-2xl font-serif text-white mb-6 border-b border-[#333] pb-4">Description from Seller</h2>
                            <p className="text-gray-400 leading-relaxed max-w-none whitespace-pre-wrap">
                                {listing.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Right: Details & Action */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <p className="text-[#D4AF37] mb-2">{listing.brand}</p>
                            <h1 className="text-3xl font-serif text-white mb-6 leading-tight">{listing.watchName}</h1>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-4xl font-medium text-white">${listing.askingPrice?.toLocaleString()}</span>
                                {listing.originalPurchasePrice && (
                                    <span className="text-gray-500 line-through text-lg">${listing.originalPurchasePrice?.toLocaleString()}</span>
                                )}
                            </div>

                            <button className="w-full bg-[#D4AF37] text-black py-4 rounded font-bold uppercase tracking-widest hover:bg-white transition-colors mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                                Secure Purchase
                            </button>
                            
                            <p className="text-xs text-gray-500 flex justify-center gap-1 my-4">
                                <Eye className="w-4 h-4" /> {listing.views || 1} people viewed this listing
                            </p>
                        </div>

                        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                            <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-[#333] pb-2">
                                    <span className="text-gray-500">Condition</span>
                                    <span className="text-white capitalize">{listing.condition.replace('-', ' ')}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#333] pb-2">
                                    <span className="text-gray-500">Box & Papers</span>
                                    <span className="text-white">{listing.hasWarranty ? 'Full Set' : 'Watch Only'}</span>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <span className="text-gray-500">Verification</span>
                                    <span className={listing.isChronosVerified ? 'text-green-500 flex items-center gap-1' : 'text-yellow-500 flex items-center gap-1'}>
                                        {listing.isChronosVerified ? <ShieldCheck className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                                        {listing.isChronosVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <SellerProfile 
                            seller={listing.seller} 
                            isVerified={listing.isChronosVerified} 
                            listingsCount={1}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
