'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function RentalCheckout({ product, onClose }) {
    const [period, setPeriod] = useState(7);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    let dailyRateRatio = 0;
    if (period === 7) dailyRateRatio = 0.015;
    else if (period === 14) dailyRateRatio = 0.012;
    else if (period === 30) dailyRateRatio = 0.010;

    const dailyRate = product.price * dailyRateRatio;
    const totalRentalFee = dailyRate * period;
    const depositAmount = product.price * 0.20;
    const creditTowardPurchase = totalRentalFee * 0.80;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (!token) throw new Error('You must be logged in to reserve a rental.');

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rentals`,
                { productId: product._id, rentalPeriodDays: period, phone },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to process rental reservation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                {success ? (
                    <div className="p-12 text-center">
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="bg-green-500/20 text-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-10 h-10" />
                        </motion.div>
                        <h2 className="text-3xl font-serif text-white mb-4">Reservation Confirmed</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Your reservation for the {product.name} has been placed. Our concierge team will contact you shortly to arrange secure shipping and deposit verification.
                        </p>
                        <button onClick={onClose} className="bg-[#D4AF37] text-black px-8 py-3 rounded font-medium hover:bg-white transition-colors">
                            Return to Rentals
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row">
                        {/* Left Side - Info */}
                        <div className="bg-[#0a0a0a] p-8 md:w-5/12 flex flex-col justify-between border-r border-[#222]">
                            <div>
                                <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-full h-auto mb-6 drop-shadow-2xl" />
                                <h3 className="text-xl text-white font-serif mb-1">{product.name}</h3>
                                <p className="text-gray-500 text-sm">{product.brand}</p>
                            </div>
                            <div className="mt-8 space-y-4 text-sm text-gray-400">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                    <p>Fully insured secure delivery & returns.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                    <p>80% of rental fees can be applied if you decide to buy.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="p-8 md:w-7/12 relative">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            
                            <h2 className="text-2xl text-white font-serif mb-6">Select Duration</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-3 gap-3">
                                    {[7, 14, 30].map(days => (
                                        <button
                                            key={days}
                                            type="button"
                                            onClick={() => setPeriod(days)}
                                            className={`py-3 px-2 rounded-lg border text-center transition-all ${period === days ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-[#333] bg-[#1a1a1a] text-gray-400 hover:border-[#D4AF37]/50'}`}
                                        >
                                            <span className="block text-xl font-medium mb-1">{days}</span>
                                            <span className="block text-xs uppercase tracking-wider">Days</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-[#333]">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Rental Period</span>
                                        <span className="text-white">{period} Days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Daily Rate</span>
                                        <span className="text-white">${dailyRate.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Security Deposit (Refundable)</span>
                                        <span className="text-white">${depositAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-medium pt-3 border-t border-[#333]">
                                        <span className="text-white">Total Rental Fee</span>
                                        <span className="text-[#D4AF37] text-lg">${totalRentalFee.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-green-500 text-right">
                                        + ${creditTowardPurchase.toLocaleString()} credit towards purchase
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="For delivery coordination"
                                        className="w-full bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm p-3 bg-red-500/10 rounded">{error}</p>}

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-white transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Reserve Rental'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
