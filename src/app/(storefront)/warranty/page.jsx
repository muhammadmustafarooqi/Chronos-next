import React from 'react';
import axios from 'axios';
import { cookies } from 'next/headers';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import WarrantyCard from '../../../components/WarrantyCard';
import Link from 'next/link';

async function getWarranties(token) {
    if (!token) return [];
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/warranty`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data?.data?.warranties || [];
    } catch {
        return [];
    }
}

export default async function WarrantyPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const warranties = await getWarranties(token);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">My Collection Vault</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Manage your authentic Chronos timepieces, view warranty documents, and request factory servicing.
                    </p>
                </div>

                {!token ? (
                    <div className="text-center py-20 border border-[#222] rounded-xl bg-[#111]">
                        <p className="text-gray-400 mb-6">Please sign in to view your registered warranties.</p>
                        <Link href="/login" className="bg-[#D4AF37] text-black px-8 py-3 rounded font-medium hover:bg-white transition-colors">
                            Sign In
                        </Link>
                    </div>
                ) : warranties.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {warranties.map(warranty => (
                            <WarrantyCard key={warranty._id} warranty={warranty} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-[#222] rounded-xl bg-[#111]">
                        <p className="text-gray-400 uppercase tracking-widest mb-2">No Registered Timepieces.</p>
                        <p className="text-gray-500 text-sm">Watches purchased directly from Chronos are automatically registered here upon delivery.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
