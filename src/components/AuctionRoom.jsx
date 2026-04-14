'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import BidHistory from './BidHistory';
import { Clock } from 'lucide-react';

export default function AuctionRoom({ auctionId, initialAuction, token, currentUser }) {
    const [auction, setAuction] = useState(initialAuction);
    const [bidAmount, setBidAmount] = useState(initialAuction.currentPrice + 50);
    const [timeLeft, setTimeLeft] = useState('');
    const [socket, setSocket] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
            transports: ['websocket', 'polling']
        });

        s.on('connect', () => {
            s.emit('join-auction', auctionId);
        });

        s.on('bid-placed', (data) => {
            setAuction(prev => {
                const newBids = [{
                    user: data.userId, // We might not have user id here but we have customerName
                    customerName: data.customerName,
                    amount: data.amount,
                    timestamp: data.timestamp
                }, ...prev.bids];
                
                // Show notification if we were outbid
                if (prev.bids.length > 0 && prev.bids[0].customerName === currentUser?.name && data.customerName !== currentUser?.name) {
                    setNotification("You've been outbid!");
                    setTimeout(() => setNotification(null), 3000);
                }

                return { ...prev, currentPrice: data.newCurrentPrice, bids: newBids };
            });
            setBidAmount(data.newCurrentPrice + 50);
        });

        s.on('time-extended', (data) => {
            setAuction(prev => ({ ...prev, endTime: data.newEndTime }));
            setNotification("Auction extended by 2 minutes!");
            setTimeout(() => setNotification(null), 3000);
        });

        s.on('bid-error', (data) => {
            alert(data.message || 'Error placing bid');
        });

        setSocket(s);

        return () => {
            s.emit('leave-auction', auctionId);
            s.disconnect();
        }
    }, [auctionId, currentUser]);

    useEffect(() => {
        const timer = setInterval(() => {
            const end = new Date(auction.endTime).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('Ended');
                if (auction.status !== 'ended') {
                    setAuction(prev => ({ ...prev, status: 'ended' }));
                }
            } else {
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [auction.endTime, auction.status]);

    const handlePlaceBid = (e) => {
        e.preventDefault();
        if (!socket || !token) return alert('Must be logged in to bid.');
        if (bidAmount < auction.currentPrice + 50) return alert('Bid too low.');

        socket.emit('place-bid', {
            auctionId,
            amount: Number(bidAmount),
            userId: currentUser.id,
            customerName: currentUser.name,
            token
        });
    };

    const isWinner = auction.status === 'ended' && auction.bids[0]?.customerName === currentUser?.name;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <div className="bg-[#111] rounded-2xl overflow-hidden border border-[#333] aspect-square relative flex items-center justify-center p-8">
                    <img src={auction.product.images?.[0] || '/placeholder.png'} alt={auction.product.name} className="max-w-full max-h-full object-contain" />
                </div>
            </div>

            <div className="flex flex-col">
                {notification && (
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/50 p-4 rounded-lg mb-6">
                        {notification}
                    </motion.div>
                )}

                <h1 className="text-4xl font-serif text-white mb-2">{auction.product.name}</h1>
                <p className="text-xl text-gray-400 mb-8">{auction.product.brand}</p>

                <div className="bg-[#111] border border-[#333] rounded-xl p-6 mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Current Price</p>
                        <motion.p 
                            key={auction.currentPrice}
                            initial={{ scale: 1.1, color: '#fff' }}
                            animate={{ scale: 1, color: '#D4AF37' }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-medium"
                        >
                            ${auction.currentPrice?.toLocaleString()}
                        </motion.p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-end"><Clock className="w-4 h-4 mr-1"/> Time Left</p>
                        <p className={`text-2xl font-mono ${timeLeft === 'Ended' ? 'text-red-500' : 'text-white'}`}>{timeLeft}</p>
                    </div>
                </div>

                {auction.status === 'live' ? (
                    <form onSubmit={handlePlaceBid} className="mb-8 p-6 bg-[#0a0a0a] border border-[#222] rounded-xl">
                        <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wide">Enter Bid Amount (Min: ${(auction.currentPrice + 50).toLocaleString()})</label>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input 
                                    type="number" 
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    min={auction.currentPrice + 50}
                                    className="w-full bg-[#111] border border-[#333] text-white pl-8 pr-4 py-3 rounded focus:outline-none focus:border-[#D4AF37] transition-colors"
                                />
                            </div>
                            <button type="submit" disabled={!token} className="bg-[#D4AF37] text-black px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50">
                                Place Bid
                            </button>
                        </div>
                        {!token && <p className="text-red-500 text-sm mt-3">You must be logged in to place a bid.</p>}
                    </form>
                ) : (
                    <div className="mb-8 p-6 bg-[#0a0a0a] border border-[#222] rounded-xl text-center">
                        {isWinner ? (
                            <>
                                <h3 className="text-2xl text-[#D4AF37] font-serif mb-2">Congratulations!</h3>
                                <p className="text-white">You won this auction with a bid of ${auction.currentPrice.toLocaleString()}. Our concierge will contact you shortly.</p>
                            </>
                        ) : (
                            <h3 className="text-xl text-gray-400 font-serif">This auction has ended.</h3>
                        )}
                    </div>
                )}

                <div className="mt-auto">
                    <h3 className="text-lg text-white mb-4 uppercase tracking-wider">Bid History ({auction.bids.length})</h3>
                    <BidHistory bids={auction.bids} />
                </div>
            </div>
        </div>
    );
}
