import React from 'react';
import Link from 'next/link';

export default function AuctionCard({ auction }) {
    const { product, currentPrice, status, endTime } = auction;

    return (
        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg overflow-hidden group hover:border-[#D4AF37] transition-colors duration-300">
            <div className="relative aspect-square overflow-hidden bg-[#111]">
                <img 
                    src={product.images?.[0] || '/placeholder.png'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    {status === 'live' ? (
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">Live Now</span>
                    ) : status === 'upcoming' ? (
                        <span className="bg-[#222] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Upcoming</span>
                    ) : (
                        <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Ended</span>
                    )}
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-xl text-white font-serif mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{product.brand}</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Bid</p>
                        <p className="text-xl text-[#D4AF37] font-medium">${currentPrice?.toLocaleString()}</p>
                    </div>
                    <Link href={`/auctions/${auction._id}`} className="bg-[#222] hover:bg-[#D4AF37] hover:text-black text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                        View Room
                    </Link>
                </div>
            </div>
        </div>
    );
}
