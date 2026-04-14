import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WatchMatchmaker from '@/components/WatchMatchmaker';
import CompareDrawer from '@/components/CompareDrawer';

export default function StorefrontLayout({ children }) {
    return (
        <div className="flex-grow flex flex-col w-full h-full relative">
            <Navbar />
            <main className="flex-grow w-full">
                {children}
            </main>
            <Footer />
            <CartDrawer />
            <WatchMatchmaker />
        </div>
    );
}

