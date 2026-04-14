"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';

const CustomerContext = createContext();

export const useCustomers = () => {
    const context = useContext(CustomerContext);
    if (!context) throw new Error('useCustomers must be used within a CustomerProvider');
    return context;
};

export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated, token } = useAuth();

    // Fetch customers when admin logs in
    useEffect(() => {
        const fetchCustomers = async () => {
            if (isAuthenticated && user?.isAdmin && token) {
                setLoading(true);
                try {
                    const response = await api.customers.getAll();
                    setCustomers(response.data.customers || []);
                } catch (error) {
                    console.error('Error fetching customers:', error);
                    // Fallback to localStorage
                    const saved = (typeof window !== 'undefined' ? localStorage.getItem('chronos-customers') : null);
                    if (saved) {
                        setCustomers(JSON.parse(saved));
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchCustomers();
    }, [isAuthenticated, user?.isAdmin, token]);

    // Sync with other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'chronos-customers') {
                try {
                    const newCustomers = e.newValue ? JSON.parse(e.newValue) : [];
                    setCustomers(newCustomers || []);
                } catch (err) {
                    console.error('Error syncing customers:', err);
                }
            }
        };

        typeof window !== 'undefined' && window.addEventListener('storage', handleStorageChange);
        return () => typeof window !== 'undefined' && window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateCustomerStatus = async (customerId, newStatus) => {
        try {
            await api.customers.updateStatus(customerId, newStatus);
            setCustomers(prev => {
                const updated = prev.map(customer =>
                    (customer.id === customerId || customer._id === customerId)
                        ? { ...customer, status: newStatus }
                        : customer
                );
                localStorage.setItem('chronos-customers', JSON.stringify(updated));
                return updated;
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating customer:', error);
            // Fallback to local update
            setCustomers(prev => {
                const updated = prev.map(customer =>
                    (customer.id === customerId || customer._id === customerId)
                        ? { ...customer, status: newStatus }
                        : customer
                );
                localStorage.setItem('chronos-customers', JSON.stringify(updated));
                return updated;
            });
            return { success: true };
        }
    };

    const addCustomer = async (customer) => {
        // Customer is auto-added when orders are created
        // This is mainly for local state management
        setCustomers(prev => {
            const updated = [customer, ...prev];
            localStorage.setItem('chronos-customers', JSON.stringify(updated));
            return updated;
        });
    };

    const deleteCustomer = async (customerId) => {
        try {
            await api.customers.delete(customerId);
            setCustomers(prev => {
                const updated = prev.filter(c =>
                    c.id !== customerId && c._id !== customerId
                );
                localStorage.setItem('chronos-customers', JSON.stringify(updated));
                return updated;
            });
            return { success: true };
        } catch (error) {
            console.error('Error deleting customer:', error);
            return { success: false, message: error.message };
        }
    };

    const refreshCustomers = async () => {
        if (!user?.isAdmin) return;
        setLoading(true);
        try {
            const response = await api.customers.getAll();
            setCustomers(response.data.customers || []);
        } catch (error) {
            console.error('Error refreshing customers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomerContext.Provider value={{
            customers,
            loading,
            updateCustomerStatus,
            addCustomer,
            deleteCustomer,
            refreshCustomers
        }}>
            {children}
        </CustomerContext.Provider>
    );
};

