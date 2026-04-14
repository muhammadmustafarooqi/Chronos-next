"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { watches as initialWatches } from '@/data/watches';

const WatchContext = createContext();

export const useWatches = () => useContext(WatchContext);

export const WatchProvider = ({ children }) => {
    const [watches, setWatches] = useState(initialWatches);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch watches from API on mount
    useEffect(() => {
        const fetchWatches = async () => {
            try {
                const response = await api.products.getAll({ limit: 100 });
                if (response.data.products && response.data.products.length > 0) {
                    // Map MongoDB _id to id for compatibility
                    const mappedProducts = response.data.products.map(p => ({
                        ...p,
                        id: p._id || p.id
                    }));
                    setWatches(mappedProducts);
                } else {
                    // Use initial data if no products in DB
                    setWatches(initialWatches);
                }
            } catch (err) {
                console.error('Error fetching watches:', err);
                setError(err.message || 'Failed to load products from server.');
                // Fall back to initial data
                setWatches(initialWatches);
            } finally {
                setLoading(false);
            }
        };
        fetchWatches();
    }, []);

    const addWatch = async (watchData) => {
        try {
            const response = await api.products.create({
                ...watchData,
                images: watchData.images || ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80']
            });
            const newWatch = {
                ...response.data.product,
                id: response.data.product._id || response.data.product.id
            };
            setWatches(prev => [newWatch, ...prev]);
            return { success: true, product: newWatch };
        } catch (err) {
            console.error('Error adding watch:', err);
            // Fallback to local state
            const newWatch = {
                ...watchData,
                id: Date.now(),
                images: watchData.images || ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80']
            };
            setWatches(prev => [newWatch, ...prev]);
            return { success: false, product: newWatch, message: err.message };
        }
    };

    const updateWatch = async (id, updatedData) => {
        try {
            const response = await api.products.update(id, updatedData);
            const updatedWatch = {
                ...response.data.product,
                id: response.data.product._id || response.data.product.id
            };
            setWatches(prev => prev.map(w =>
                (w.id === id || w._id === id) ? updatedWatch : w
            ));
            return { success: true, product: updatedWatch };
        } catch (err) {
            console.error('Error updating watch:', err);
            // Fallback to local state
            setWatches(prev => prev.map(w =>
                (w.id === id || w._id === id) ? { ...w, ...updatedData } : w
            ));
            return { success: true };
        }
    };

    const deleteWatch = async (id) => {
        try {
            await api.products.delete(id);
            setWatches(prev => prev.filter(w => w.id !== id && w._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting watch:', err);
            // Fallback to local state
            setWatches(prev => prev.filter(w => w.id !== id && w._id !== id));
            return { success: false, message: err.message };
        }
    };

    const getWatchById = (id) => {
        return watches.find(w => w.id === id || w._id === id || String(w.id) === String(id));
    };

    const getFeaturedWatches = () => watches.filter(w => w.isFeatured);
    const getNewArrivals = () => watches.filter(w => w.isNew);

    const getCategories = () => {
        const cats = [...new Set(watches.map(w => w.category).filter(Boolean))];
        return ['All', ...cats.sort()];
    };

    const getBrands = () => {
        const brands = [...new Set(watches.map(w => w.brand).filter(Boolean))];
        return ['All', ...brands.sort()];
    };

    return (
        <WatchContext.Provider value={{
            watches,
            loading,
            error,
            addWatch,
            updateWatch,
            deleteWatch,
            getWatchById,
            getFeaturedWatches,
            getNewArrivals,
            getCategories,
            getBrands
        }}>
            {children}
        </WatchContext.Provider>
    );
};

