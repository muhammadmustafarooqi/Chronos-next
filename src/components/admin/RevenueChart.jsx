'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
    if (!data || data.length === 0) return <div className="text-gray-500">No revenue data available.</div>;

    const formattedData = data.map(v => ({
        date: v.date,
        revenue: v.revenue
    }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis 
                        dataKey="date" 
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
                        tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#D4AF37' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
