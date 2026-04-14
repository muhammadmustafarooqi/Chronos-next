import React from 'react';
import Link from 'next/link';
import { ShieldCheck, User } from 'lucide-react';

export default function ListingCard({ listing }) {
    const { product, watchName, brand, askingPrice, condition, isChronosVerified, images, sellerName, seller } = listing;

    return (
        <Link href={`/marketplace/${listing._id}`} className="block group">
            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-[#111]">
                    <img 
                        src={images?.[0] || product?.images?.[0] || '/placeholder.png'} 
                        alt={watchName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isChronosVerified && (
                        <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded flex items-center gap-1 shadow-lg">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Verified Authentic</span>
                        </div>
                    )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg text-white font-serif line-clamp-1">{watchName}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{brand}</p>
                    
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[#D4AF37] text-xl font-medium">${askingPrice?.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-widest border border-[#333] px-2 py-1 rounded bg-[#111]">{condition}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#222] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest leading-none">Seller</p>
                            <p className="text-sm text-gray-300">{sellerName || 'Anonymous Collector'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
