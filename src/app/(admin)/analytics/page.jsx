import React from 'react';
import axios from 'axios';
import { cookies } from 'next/headers';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import RevenueChart from '../../../components/admin/RevenueChart';
import FunnelChart from '../../../components/admin/FunnelChart';
import HeatmapGrid from '../../../components/admin/HeatmapGrid';
import { TrendingUp, Users, Smartphone, Bot } from 'lucide-react';

async function getAnalytics() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const headers = { Authorization: `Bearer ${token}` };
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const [revenueLine, productsData, vipData, featureData] = await Promise.all([
            axios.get(`${baseUrl}/api/analytics/revenue?period=30d`, { headers }),
            axios.get(`${baseUrl}/api/analytics/products`, { headers }),
            axios.get(`${baseUrl}/api/analytics/vip-funnel`, { headers }),
            axios.get(`${baseUrl}/api/analytics/features`, { headers })
        ]);

        return {
            revenue: revenueLine.data.data.revenue,
            products: productsData.data.data,
            funnel: vipData.data.data.funnel,
            features: featureData.data.data
        };
    } catch {
        return null;
    }
}

export default async function AnalyticsDashboard() {
    const data = await getAnalytics();

    if (!data) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <p>Not Authorized. Must be an admin.</p>
            </div>
        );
    }

    const totalRevenue30d = data.revenue.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b border-[#333] pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-serif text-white mb-2">Platform Overview</h1>
                        <p className="text-gray-400">Advanced Analytics Dashboard (Last 30 Days)</p>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 uppercase tracking-widest text-xs">Gross Revenue</p>
                            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <h3 className="text-3xl font-serif text-white">${totalRevenue30d.toLocaleString()}</h3>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 uppercase tracking-widest text-xs">Total VIPs</p>
                            <Users className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <h3 className="text-3xl font-serif text-white">{data.funnel.reduce((acc, curr) => acc + curr.count, 0)}</h3>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 uppercase tracking-widest text-xs">AR Try-Ons</p>
                            <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <h3 className="text-3xl font-serif text-white">{data.features.arTryOnSessions}</h3>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 uppercase tracking-widest text-xs">AI Chats</p>
                            <Bot className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <h3 className="text-3xl font-serif text-white">{data.features.conciergeChatsTotal}</h3>
                    </div>
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                        <h3 className="text-white font-medium uppercase tracking-widest mb-6 border-b border-[#333] pb-4">Revenue Trend</h3>
                        <RevenueChart data={data.revenue} />
                    </div>
                    <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                        <h3 className="text-white font-medium uppercase tracking-widest mb-6 border-b border-[#333] pb-4">VIP Tier Distribution</h3>
                        <FunnelChart data={data.funnel} />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                        <h3 className="text-white font-medium uppercase tracking-widest mb-6 border-b border-[#333] pb-4">Top Custom Configurations</h3>
                        <HeatmapGrid data={data.products.configuratorCombos} />
                    </div>
                    <div className="bg-[#111] p-8 rounded-xl border border-[#222]">
                        <h3 className="text-white font-medium uppercase tracking-widest mb-6 border-b border-[#333] pb-4">Top Selling Models</h3>
                        <div className="space-y-4">
                            {data.products.topPurchased.map((p, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{p.name || 'Model ' + p._id}</span>
                                    <span className="text-[#D4AF37] font-mono">{p.totalQuantity} Sold</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
