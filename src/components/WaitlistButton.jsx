'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';

export default function WaitlistButton({ dropId, isLive }) {
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    const joinWaitlist = async () => {
        if (isLive) return; // Cannot join waitlist if already live
        
        setStatus('loading');
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (!token) throw new Error('You must be logged in to join the waitlist.');

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/drops/${dropId}/waitlist`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setStatus('success');
            setMessage(res.data?.message || 'Added to waitlist');
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || err.message);
            // Hide error after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
        }
    };

    if (isLive) {
        return (
            <button className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest px-8 py-3 rounded hover:bg-white transition-colors w-full sm:w-auto">
                Shop Now
            </button>
        );
    }

    if (status === 'success') {
        return (
            <button disabled className="bg-green-500/10 border border-green-500 text-green-500 font-bold uppercase tracking-widest px-8 py-3 rounded w-full sm:w-auto flex items-center justify-center gap-2">
                <Bell className="w-5 h-5" />
                {message}
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button 
                onClick={joinWaitlist}
                disabled={status === 'loading'}
                className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest px-8 py-3 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#D4AF37]"
            >
                <Bell className="w-5 h-5" />
                {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
            </button>
            {status === 'error' && <span className="text-red-500 text-xs italic text-center">{message}</span>}
        </div>
    );
}
