import React from 'react';
import { User, Star, ShieldCheck, MapPin } from 'lucide-react';

export default function SellerProfile({ seller, isVerified, listingsCount }) {
    return (
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#333]">
                <div className="w-16 h-16 rounded-full bg-[#222] border border-[#D4AF37]/30 flex items-center justify-center">
                    <User className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div>
                    <h3 className="text-xl text-white font-serif flex items-center gap-2">
                        {seller?.name || 'Authorized Collector'}
                        {isVerified && <ShieldCheck className="w-5 h-5 text-green-500" />}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-[#D4AF37]" fill="#D4AF37" />
                        5.0 (Collector Hub)
                    </p>
                </div>
            </div>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-widest">Member Since</span>
                    <span className="text-white">{new Date(seller?.createdAt || Date.now()).getFullYear()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-widest">Active Listings</span>
                    <span className="text-white">{listingsCount || 1}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                    </span>
                    <span className="text-white">Escrow Hub</span>
                </div>
            </div>

            <div className="mt-8 bg-[#0a0a0a] p-4 rounded border border-[#222] text-xs text-gray-400">
                <p><strong className="text-white">Chronos Escrow Guarantee:</strong> Payment is held securely until the watch is authenticated and delivered to the buyer.</p>
            </div>
            
            <button className="w-full mt-6 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black py-3 rounded font-bold uppercase tracking-widest transition-colors">
                Contact Seller
            </button>
        </div>
    );
}
