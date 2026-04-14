import React from 'react';
import axios from 'axios';
import AuctionCard from '../../../components/AuctionCard';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

async function getAuctions() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auctions`);
        return res.data?.data?.auctions || [];
    } catch {
        return [];
    }
}

export default async function AuctionsPage() {
    const auctions = await getAuctions();
    
    const live = auctions.filter(a => a.status === 'live');
    const upcoming = auctions.filter(a => a.status === 'upcoming');

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Live Auction Room</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">Bid on exclusive, limited-edition, and highly sought-after timepieces in real-time against collectors worldwide.</p>
                </div>
                
                {live.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-serif text-white">Live Now</h2>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {live.map(a => <AuctionCard key={a._id} auction={a} />)}
                        </div>
                    </div>
                )}

                {upcoming.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-serif text-white mb-8">Upcoming Auctions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {upcoming.map(a => <AuctionCard key={a._id} auction={a} />)}
                        </div>
                    </div>
                )}
                
                {auctions.length === 0 && (
                    <div className="text-center py-20 border border-[#222] rounded-xl">
                        <p className="text-gray-400 uppercase tracking-widest">No active auctions at the moment.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
