"use client";
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import WatchMatchmaker from './WatchMatchmaker';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-luxury-black text-white overflow-x-hidden">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <CartDrawer />
            <WatchMatchmaker />
        </div>
    );
};

export default Layout;

