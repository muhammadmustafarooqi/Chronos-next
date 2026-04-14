"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = (typeof window !== 'undefined' ? localStorage.getItem('chronos-theme') : null);
            // Check system preference if no saved preference
            if (!saved) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return saved;
        }
        return 'dark';
    });

    useEffect(() => {
        localStorage.setItem('chronos-theme', theme);

        // Update HTML class for CSS targeting
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = (event) => {
        const isAppearanceTransition =
            typeof document !== 'undefined' &&
            document.startViewTransition &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!isAppearanceTransition || !event) {
            setTheme(prev => prev === 'dark' ? 'light' : 'dark');
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
            Math.max(x, (typeof window !== 'undefined' ? window.innerWidth : 1000) - x),
            Math.max(y, (typeof window !== 'undefined' ? window.innerHeight : 800) - y)
        );

        const transition = document.startViewTransition(() => {
            setTheme(prev => prev === 'dark' ? 'light' : 'dark');
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];
            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 500,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        });
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            toggleTheme,
            isDark
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

