import React from 'react';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import DropCountdown from '../../../components/DropCountdown';
import WaitlistButton from '../../../components/WaitlistButton';
import Link from 'next/link';

async function getDrops() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/drops`);
        return res.data?.data?.drops || [];
    } catch {
        return [];
    }
}

export default async function DropsPage() {
    const drops = await getDrops();

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Limited Drops</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Highly anticipated releases with severe allocations. Gold and Platinum VIP members receive exclusive early access 48 hours before public release.
                    </p>
                </div>

                <div className="space-y-24">
                    {drops.map((drop, index) => {
                        const isLive = drop.status === 'live' || drop.status === 'gold-access';
                        return (
                            <div key={drop._id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                                <div className={`aspect-[4/3] relative rounded-2xl overflow-hidden bg-[#111] p-12 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                                    <img 
                                        src={drop.product?.images?.[0] || '/placeholder.png'} 
                                        alt={drop.dropName}
                                        className="w-full h-full object-contain"
                                    />
                                    {drop.status === 'gold-access' && (
                                        <div className="absolute top-6 left-6 bg-[#D4AF37] text-black px-4 py-1 rounded font-bold text-sm tracking-wider uppercase">
                                            Gold+ VIP Access Live
                                        </div>
                                    )}
                                </div>
                                <div className={index % 2 !== 0 ? 'lg:order-1' : ''}>
                                    <div className="mb-4 flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${
                                            drop.status === 'scheduled' ? 'bg-[#222] text-[#D4AF37] border border-[#D4AF37]' :
                                            drop.status === 'gold-access' ? 'bg-[#D4AF37] text-black' :
                                            drop.status === 'live' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
                                        }`}>
                                            {drop.status.replace('-', ' ')}
                                        </span>
                                        <span className="text-gray-500 text-sm">{drop.product?.brand}</span>
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-serif text-white mb-6 leading-tight">
                                        {drop.dropName}
                                    </h2>
                                    <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                                        {drop.description}
                                    </p>
                                    
                                    {!isLive && drop.status === 'scheduled' && (
                                        <p className="text-white text-sm uppercase tracking-widest mb-4">Releasing In</p>
                                    )}
                                    
                                    {!isLive && drop.status === 'scheduled' && (
                                        <DropCountdown releaseDate={drop.releaseDate} />
                                    )}

                                    <div className="flex items-center gap-4">
                                        <WaitlistButton dropId={drop._id} isLive={isLive} />
                                        {isLive && (
                                            <Link href={`/product/${drop.product?._id}`} className="text-gray-400 hover:text-white underline underline-offset-4 transition-colors">
                                                View Specifications
                                            </Link>
                                        )}
                                    </div>
                                    
                                    <div className="mt-8 pt-8 border-t border-[#222] flex gap-8">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Edition Size</p>
                                            <p className="text-white font-medium">{drop.quantity} Pieces</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Retail Price</p>
                                            <p className="text-[#D4AF37] font-medium">${drop.product?.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {drops.length === 0 && (
                        <div className="text-center py-24 border border-[#222] rounded-2xl bg-[#111]">
                            <p className="text-gray-400 uppercase tracking-widest">No upcoming drops scheduled.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
