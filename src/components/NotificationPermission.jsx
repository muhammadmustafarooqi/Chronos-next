'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BellRing, BellOff } from 'lucide-react';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function NotificationPermission() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(reg => {
                reg.pushManager.getSubscription().then(sub => {
                    setIsSubscribed(!!sub);
                });
            });
        }
    }, []);

    const handleSubscribe = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') throw new Error('Permission denied');

            const reg = await navigator.serviceWorker.ready;
            const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BKfFKBulLF9MvHops4wEPn5aQNkdI4ZL7gzmdrEUgPEINBJvBigGrzt7wzdDEivu0qIIRudPhCzJLpIK1yTOams";
            
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_KEY)
            });

            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/push/subscribe`, { subscription: sub }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            setIsSubscribed(true);
        } catch (err) {
            console.error('Push setup failed', err);
        } finally {
            setLoading(false);
        }
    };

    if (isSubscribed) {
        return (
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                <BellRing className="w-4 h-4" /> Push Enabled
            </div>
        );
    }

    return (
        <button 
            onClick={handleSubscribe} 
            disabled={loading}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
            <BellOff className="w-4 h-4" /> {loading ? 'Enabling...' : 'Enable Notifications'}
        </button>
    );
}
