'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FunnelChart({ data }) {
    if (!data || data.length === 0) return <div className="text-gray-500">No VIP funnel data available.</div>;

    const formattedData = data.map(v => ({
        tier: v._id.charAt(0).toUpperCase() + v._id.slice(1),
        count: v.count
    }));

    const tierOrder = { Bronze: 1, Silver: 2, Gold: 3, Platinum: 4 };
    formattedData.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis 
                        dataKey="tier" 
                        stroke="#666" 
                        tick={{fill: '#666', fontSize: 12}}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis 
                        stroke="#666" 
                        tick={{fill: '#666', fontSize: 12}}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#D4AF37' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#D4AF37" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
