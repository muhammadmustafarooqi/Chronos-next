import React from 'react';
import axios from 'axios';
import { cookies } from 'next/headers';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import AuctionRoom from '../../../../components/AuctionRoom';

async function getAuction(id) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auctions/${id}`);
        return res.data?.data?.auction || null;
    } catch {
        return null;
    }
}

async function getUser(token) {
    if (!token) return null;
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data?.data?.user || null;
    } catch {
        return null;
    }
}

export default async function AuctionDetailPage({ params }) {
    const { id } = await params;
    const auction = await getAuction(id);
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = await getUser(token);

    if (!auction) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <h1 className="text-2xl text-white font-serif">Auction Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            <Navbar />
            <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <AuctionRoom 
                    auctionId={id} 
                    initialAuction={auction} 
                    token={token} 
                    currentUser={user} 
                />
            </main>
            <Footer />
        </div>
    );
}
