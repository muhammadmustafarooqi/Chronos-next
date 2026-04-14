"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('chronos-token') : null));

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = (typeof window !== 'undefined' ? localStorage.getItem('chronos-token') : null);
            if (savedToken) {
                try {
                    const response = await api.auth.getMe();
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Auth init error:', error);
                    localStorage.removeItem('chronos-token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const register = async (userData) => {
        try {
            const response = await api.auth.register(userData);
            const { user: newUser, token: newToken } = response.data;

            localStorage.setItem('chronos-token', newToken);
            setToken(newToken);
            setUser(newUser);

            return { success: true, message: 'Registration successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.auth.login(email, password);
            const { user: loggedInUser, token: newToken } = response.data;

            localStorage.setItem('chronos-token', newToken);
            setToken(newToken);
            setUser(loggedInUser);

            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('chronos-token');
        setToken(null);
        setUser(null);
    };

    const updateUser = async (updatedData) => {
        try {
            const response = await api.auth.updateProfile(updatedData);
            setUser(response.data.user);
            return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isAuthenticated: !!user,
            register,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

