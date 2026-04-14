import React from 'react';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import RentalCard from '../../../components/RentalCard';

async function getRentableProducts() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
        const allProducts = res.data?.data?.products || [];
        return allProducts.filter(p => p.isRentable);
    } catch {
        return [];
    }
}

export default async function RentalsPage() {
    const products = await getRentableProducts();

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-4 block">Exclusive Program</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Try Before You Buy</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Experience the world's most prestigious timepieces in your daily life. Rent for 7, 14, or 30 days. Should you decide to keep the piece, 80% of your rental fee becomes a credit toward the purchase.
                    </p>
                </div>
                
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <RentalCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-[#222] rounded-2xl bg-[#111]">
                        <p className="text-gray-400 uppercase tracking-widest">No pieces currently available for rent.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
