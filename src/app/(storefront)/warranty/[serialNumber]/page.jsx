'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import ServiceTimeline from '../../../../components/ServiceTimeline';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function WarrantyDetailClient() {
    const params = useParams();
    const serialNumber = params.serialNumber;
    
    const [warranty, setWarranty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [issue, setIssue] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [serviceSuccess, setServiceSuccess] = useState(false);

    useEffect(() => {
        const fetchWarranty = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/warranty/${serialNumber}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setWarranty(res.data?.data?.warranty);
            } catch (err) {
                setError('Could not securely load warranty information.');
            } finally {
                setLoading(false);
            }
        };
        fetchWarranty();
    }, [serialNumber]);

    const handleRequestService = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/warranty/${serialNumber}/service`, { issue }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServiceSuccess(true);
            setIssue('');
        } catch (err) {
            alert('Failed to submit service request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] pt-32 text-center text-white">Loading...</div>;
    if (error || !warranty) return <div className="min-h-screen bg-[#0a0a0a] pt-32 text-center text-white text-xl font-serif">Certificate void or unauthorized.</div>;

    const isExpired = new Date(warranty.warrantyExpiryDate).getTime() < new Date().getTime();

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-12 flex items-center justify-between border-b border-[#333] pb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-2">Digital Authenticity Certificate</h1>
                        <p className="text-gray-400 font-mono tracking-widest">{serialNumber}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <ShieldCheck className={`w-12 h-12 ${isExpired ? 'text-red-500' : 'text-[#D4AF37]'}`} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                        <img src={warranty.product?.images?.[0] || '/placeholder.png'} alt={warranty.product?.name} className="w-full max-h-80 object-contain drop-shadow-2xl mb-8" />
                        <h2 className="text-2xl font-serif text-white mb-1">{warranty.product?.name}</h2>
                        <p className="text-[#D4AF37] mb-6">{warranty.product?.brand}</p>
                        
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-[#333] pb-2">
                                <span className="text-gray-500 uppercase">Movement</span>
                                <span className="text-white capitalize">{warranty.movementType}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#333] pb-2">
                                <span className="text-gray-500 uppercase">Purchase Date</span>
                                <span className="text-white">{new Date(warranty.purchaseDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-gray-500 uppercase">Original Buyer</span>
                                <span className="text-white font-mono">{warranty.email?.replace(/.(?=.*@)/g, '*')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                            <h3 className="text-xl font-serif text-white mb-4">Warranty Status</h3>
                            <div className={`p-4 rounded border mb-6 flex items-start gap-3 ${isExpired ? 'bg-red-500/10 border-red-500/30' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30'}`}>
                                {isExpired ? <AlertCircle className="w-6 h-6 text-red-500" /> : <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />}
                                <div>
                                    <p className={`font-bold ${isExpired ? 'text-red-500' : 'text-[#D4AF37]'}`}>
                                        {isExpired ? 'Warranty Expired' : 'Active Warranty'}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Valid until {new Date(warranty.warrantyExpiryDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            <h4 className="text-white font-medium mb-2">Next Recommended Service</h4>
                            <p className="text-3xl font-serif text-[#D4AF37]">{new Date(warranty.nextServiceDueDate).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500 mt-2">Routine maintenance interval: {warranty.serviceIntervalYears} years.</p>
                        </div>

                        <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                            <h3 className="text-xl font-serif text-white mb-4">Request Factory Service</h3>
                            {serviceSuccess ? (
                                <div className="text-green-500 bg-green-500/10 p-4 rounded border border-green-500/30">
                                    Service request submitted successfully. A shipping label has been sent to your email.
                                </div>
                            ) : (
                                <form onSubmit={handleRequestService}>
                                    <label className="block text-sm text-gray-400 mb-2">Describe the issue or service needed:</label>
                                    <textarea 
                                        required
                                        rows="3"
                                        value={issue}
                                        onChange={e => setIssue(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#333] rounded p-3 text-white mb-4 focus:outline-none focus:border-[#D4AF37]"
                                        placeholder="e.g., Routine service, losing time, deep scratch on bezel"
                                    ></textarea>
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* We aren't querying the specific ServiceRequest for this UI stub, but if we did, we would map it to ServiceTimeline. */}
                {/* For demonstration: */}
                <div className="mt-16 bg-[#111] p-8 rounded-xl border border-[#222]">
                    <h3 className="text-2xl font-serif text-white mb-8">Service Tracking (Demo)</h3>
                    <ServiceTimeline 
                        timeline={[
                            { stage: 'submitted', timestamp: new Date() }
                        ]} 
                        currentStatus="submitted"
                    />
                </div>

            </main>
            <Footer />
        </div>
    );
}
