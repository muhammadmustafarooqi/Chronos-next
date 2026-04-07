import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('chronos-cart');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { success: showSuccess } = useToast();

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('chronos-cart', JSON.stringify(cart));
    }, [cart]);

    // Helper: get consistent product ID (handles both local integer IDs and MongoDB _id)
    const getProductId = (product) => product._id || product.id;

    const addToCart = (product) => {
        const pid = getProductId(product);
        setCart(prev => {
            const existing = prev.find(item => getProductId(item) === pid);
            if (existing) {
                return prev.map(item =>
                    getProductId(item) === pid ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, id: pid, quantity: 1 }];
        });
        showSuccess(`${product.name} added to cart`);
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => getProductId(item) !== id && item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return removeFromCart(id);
        setCart(prev => prev.map(item =>
            (getProductId(item) === id || item.id === id) ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (productId) => {
        return cart.some(item => getProductId(item) === productId || item.id === productId);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartTotal,
            cartCount,
            isInCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
