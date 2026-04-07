import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

export const RecentlyViewedProvider = ({ children }) => {
    const [recentlyViewed, setRecentlyViewed] = useState(() => {
        try {
            const saved = localStorage.getItem('chronos-recently-viewed');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('chronos-recently-viewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    const addToRecentlyViewed = (product) => {
        if (!product) return;
        const pid = product._id || product.id;
        setRecentlyViewed(prev => {
            // Remove if already present
            const filtered = prev.filter(p => (p._id || p.id) !== pid);
            // Add to front, limit to 8
            return [product, ...filtered].slice(0, 8);
        });
    };

    const clearRecentlyViewed = () => setRecentlyViewed([]);

    return (
        <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
};
