"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        // Initialize from localStorage
        if (typeof window !== 'undefined') {
            const saved = (typeof window !== 'undefined' ? localStorage.getItem('chronos-wishlist') : null);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const { isAuthenticated, token } = useAuth();

    // Sync wishlist with API when user logs in
    useEffect(() => {
        const syncWishlist = async () => {
            if (isAuthenticated && token) {
                try {
                    const response = await api.wishlist.get();
                    const serverWishlist = response.data.wishlist || [];
                    // Map to consistent format
                    const mapped = serverWishlist.map(item => ({
                        ...item,
                        id: item._id || item.id
                    }));
                    setWishlist(mapped);
                    localStorage.setItem('chronos-wishlist', JSON.stringify(mapped));
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            }
        };
        syncWishlist();
    }, [isAuthenticated, token]);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('chronos-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = async (product) => {
        // Optimistic update
        setWishlist(prev => {
            if (prev.find(item => item.id === product.id || item._id === product.id)) {
                return prev;
            }
            return [...prev, product];
        });

        // Sync with API if authenticated
        if (isAuthenticated) {
            try {
                await api.wishlist.add(product._id || product.id);
            } catch (error) {
                console.error('Error adding to wishlist:', error);
            }
        }
    };

    const removeFromWishlist = async (id) => {
        // Optimistic update
        setWishlist(prev => prev.filter(item => item.id !== id && item._id !== id));

        // Sync with API if authenticated
        if (isAuthenticated) {
            try {
                await api.wishlist.remove(id);
            } catch (error) {
                console.error('Error removing from wishlist:', error);
            }
        }
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item.id === id || item._id === id);
    };

    const toggleWishlist = async (product) => {
        const productId = product._id || product.id;

        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(product);
        }
    };

    const clearWishlist = () => {
        setWishlist([]);
        localStorage.removeItem('chronos-wishlist');
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            clearWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

