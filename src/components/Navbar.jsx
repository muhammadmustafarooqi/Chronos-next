import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Heart, User, Sun, Moon, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useVIP } from '../context/VIPContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { setIsCartOpen, cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { isAuthenticated, user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { enrolled, tier } = useVIP();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Collection' },
        { path: '/vault', label: 'The Vault' },
        { path: '/brands', label: 'Brands' },
        { path: '/admin', label: 'Dashboard', adminOnly: true },
        { path: '/about', label: 'Our Story' },
    ].filter(link => !link.adminOnly || user?.isAdmin);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-luxury-black/95 backdrop-blur-xl border-b border-white/10 py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="relative group">
                            <span className="text-2xl md:text-3xl font-serif font-bold tracking-wider">
                                <span className="text-gradient-gold">CHRONOS</span>
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative text-sm uppercase tracking-[0.15em] font-medium transition-colors hover-underline ${location.pathname === link.path
                                        ? 'text-luxury-gold'
                                        : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-white/80 hover:text-luxury-gold transition-colors"
                                aria-label="Toggle theme"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isDark ? 'dark' : 'light'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                    </motion.div>
                                </AnimatePresence>
                            </button>

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-white/80 hover:text-luxury-gold transition-colors"
                            >
                                <Search size={20} />
                            </button>

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className="hidden md:flex p-2 text-white/80 hover:text-luxury-gold transition-colors relative"
                            >
                                <Heart size={20} />
                                <AnimatePresence>
                                    {wishlistCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                            {wishlistCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            {/* Account */}
                            <Link
                                to={isAuthenticated ? "/account" : "/login"}
                                className="hidden md:flex items-center gap-1.5 p-2 text-white/80 hover:text-luxury-gold transition-colors relative group"
                            >
                                <User size={20} />
                                {enrolled && (
                                    <span style={{ color: tier?.color || '#D4AF37' }}>
                                        <Crown size={12} className="opacity-0 group-hover:opacity-100 absolute -top-1 -right-1 transition-opacity" />
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-white/80 hover:text-luxury-gold transition-colors"
                            >
                                <ShoppingBag size={20} />
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="lg:hidden p-2 text-white/80 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X size={24} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu size={24} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <div className="absolute inset-0 bg-luxury-black/95 backdrop-blur-xl" />
                        <div className="relative h-full flex flex-col items-center justify-center">
                            <nav className="flex flex-col items-center gap-8">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={link.path}
                                            className={`text-2xl font-serif tracking-wider ${location.pathname === link.path
                                                ? 'text-luxury-gold'
                                                : 'text-white hover:text-luxury-gold'
                                                } transition-colors`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute bottom-20 flex gap-6"
                            >
                                <button
                                    onClick={toggleTheme}
                                    className="text-white/60 hover:text-luxury-gold transition-colors"
                                >
                                    {isDark ? <Sun size={24} /> : <Moon size={24} />}
                                </button>
                                <Link to="/wishlist" className="text-white/60 hover:text-luxury-gold transition-colors">
                                    <Heart size={24} />
                                </Link>
                                <Link to={isAuthenticated ? "/account" : "/login"} className="text-white/60 hover:text-luxury-gold transition-colors">
                                    <User size={24} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <div className="absolute inset-0 bg-luxury-black/95 backdrop-blur-xl" />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search timepieces, brands..."
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchQuery.trim()) {
                                            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }
                                        if (e.key === 'Escape') {
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }
                                    }}
                                    className="w-full bg-luxury-charcoal border border-white/10 rounded-none py-5 pl-16 pr-6 text-white text-lg focus:outline-none focus:border-luxury-gold transition-colors"
                                />
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                             
                             <p className="text-gray-500 text-sm mt-4 text-center">
                                 Press <kbd className="px-1.5 py-0.5 text-xs border border-white/20 rounded">Enter</kbd> to search · <kbd className="px-1.5 py-0.5 text-xs border border-white/20 rounded">Esc</kbd> to close
                             </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
