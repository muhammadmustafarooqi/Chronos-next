"use client";

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { VIPProvider } from '@/context/VIPContext';
import { WatchProvider } from '@/context/WatchContext';
import { OrderProvider } from '@/context/OrderContext';
import { CustomerProvider } from '@/context/CustomerContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import Toast from './Toast';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <VIPProvider>
            <WatchProvider>
              <OrderProvider>
                <CustomerProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <RecentlyViewedProvider>
                        {children}
                        <Toast />
                      </RecentlyViewedProvider>
                    </WishlistProvider>
                  </CartProvider>
                </CustomerProvider>
              </OrderProvider>
            </WatchProvider>
          </VIPProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
