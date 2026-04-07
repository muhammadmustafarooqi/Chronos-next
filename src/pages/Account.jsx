import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, LogOut, Package, Heart, Settings } from 'lucide-react';
import VIPMembershipCard from '../components/VIPMembershipCard';

const Account = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const menuItems = [
        { icon: Package, label: 'My Orders', path: '/orders', description: 'Track your purchases' },
        { icon: Heart, label: 'Wishlist', path: '/wishlist', description: 'Your saved items' },
        { icon: Settings, label: 'Settings', path: '/settings', description: 'Account preferences' },
    ];

    return (
        <div className="min-h-screen bg-luxury-black">
            {/* Header */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal to-luxury-black" />
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 bg-luxury-gold/10 border-2 border-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl font-serif text-luxury-gold">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </motion.div>
                </div>
            </section>

            {/* Account Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* VIP Membership Dashboard */}
                    <div className="mb-12">
                        <VIPMembershipCard />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Profile Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
                                <User className="text-luxury-gold" size={20} />
                                Profile Information
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5">
                                    <Mail className="text-luxury-gold flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Email</p>
                                        <p className="text-white">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5">
                                    <Phone className="text-luxury-gold flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Phone</p>
                                        <p className="text-white">{user.phone || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5">
                                    <Calendar className="text-luxury-gold flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Member Since</p>
                                        <p className="text-white">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            {menuItems.map((item, index) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center gap-4 p-6 glass-card hover:border-luxury-gold/30 transition-all group"
                                >
                                    <div className="w-12 h-12 border border-luxury-gold/30 flex items-center justify-center group-hover:bg-luxury-gold/10 transition-colors">
                                        <item.icon className="text-luxury-gold" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium group-hover:text-luxury-gold transition-colors">
                                            {item.label}
                                        </h3>
                                        <p className="text-gray-500 text-sm">{item.description}</p>
                                    </div>
                                </Link>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-6 border border-red-500/30 hover:bg-red-500/10 transition-all group"
                            >
                                <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                    <LogOut className="text-red-400" size={20} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-red-400 font-medium">Sign Out</h3>
                                    <p className="text-gray-500 text-sm">Log out of your account</p>
                                </div>
                            </button>
                        </motion.div>
                    </div>

                    {/* Recent Activity Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 glass-card p-8 text-center"
                    >
                        <Package className="text-gray-600 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-serif text-white mb-2">No Recent Orders</h3>
                        <p className="text-gray-500 mb-6">Start exploring our collection of luxury timepieces</p>
                        <Link to="/shop" className="btn-primary inline-block">
                            Browse Collection
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Account;
