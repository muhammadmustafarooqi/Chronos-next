"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within an OrderProvider');
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated, token } = useAuth();

    // Fetch orders when user logs in
    useEffect(() => {
        const fetchOrders = async () => {
            if (isAuthenticated && token) {
                setLoading(true);
                try {
                    const response = await api.orders.getAll();
                    setOrders(response.data.orders || []);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    // Fallback to localStorage for offline support
                    const saved = (typeof window !== 'undefined' ? localStorage.getItem('chronos-orders') : null);
                    if (saved) {
                        setOrders(JSON.parse(saved));
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrders();
    }, [isAuthenticated, token]);

    // Sync with other tabs for offline support
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'chronos-orders') {
                try {
                    const newOrders = e.newValue ? JSON.parse(e.newValue) : [];
                    setOrders(newOrders || []);
                } catch (err) {
                    console.error('Error syncing orders:', err);
                }
            }
        };

        typeof window !== 'undefined' && window.addEventListener('storage', handleStorageChange);
        return () => typeof window !== 'undefined' && window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addOrder = async (orderData) => {
        try {
            const response = await api.orders.create(orderData);
            const newOrder = response.data.order;
            setOrders(prev => {
                const updated = [newOrder, ...prev];
                // Also save to localStorage as backup
                localStorage.setItem('chronos-orders', JSON.stringify(updated));
                return updated;
            });
            return { success: true, order: newOrder };
        } catch (error) {
            console.error('Error creating order:', error);
            // Fallback: save to localStorage
            const fallbackOrder = {
                ...orderData,
                id: orderData.id || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                date: new Date().toISOString(),
                status: 'Pending'
            };
            setOrders(prev => {
                const updated = [fallbackOrder, ...prev];
                localStorage.setItem('chronos-orders', JSON.stringify(updated));
                return updated;
            });
            return { success: true, order: fallbackOrder };
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.orders.updateStatus(orderId, newStatus);
            setOrders(prev => {
                const updated = prev.map(order =>
                    (order.id === orderId || order._id === orderId)
                        ? { ...order, status: newStatus }
                        : order
                );
                localStorage.setItem('chronos-orders', JSON.stringify(updated));
                return updated;
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating order:', error);
            // Fallback to local update
            setOrders(prev => {
                const updated = prev.map(order =>
                    (order.id === orderId || order._id === orderId)
                        ? { ...order, status: newStatus }
                        : order
                );
                localStorage.setItem('chronos-orders', JSON.stringify(updated));
                return updated;
            });
            return { success: true };
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await api.orders.delete(orderId);
            setOrders(prev => {
                const updated = prev.filter(order =>
                    order.id !== orderId && order._id !== orderId
                );
                localStorage.setItem('chronos-orders', JSON.stringify(updated));
                return updated;
            });
            return { success: true };
        } catch (error) {
            console.error('Error deleting order:', error);
            // Fallback to local delete
            setOrders(prev => {
                const updated = prev.filter(order =>
                    order.id !== orderId && order._id !== orderId
                );
                localStorage.setItem('chronos-orders', JSON.stringify(updated));
                return updated;
            });
            return { success: true };
        }
    };

    const refreshOrders = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const response = await api.orders.getAll();
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error refreshing orders:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider value={{
            orders,
            loading,
            addOrder,
            updateOrderStatus,
            deleteOrder,
            refreshOrders
        }}>
            {children}
        </OrderContext.Provider>
    );
};

