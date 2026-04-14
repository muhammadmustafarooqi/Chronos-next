"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera as Instagram, Users as Facebook, Link2 as Twitter, Video as Youtube, MapPin, Phone, Mail, ArrowRight, Clock, CreditCard, Truck, Shield } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over $500' },
        { icon: Shield, title: '5 Year Warranty', desc: 'Full coverage included' },
        { icon: CreditCard, title: 'Secure Payment', desc: '100% protected' },
        { icon: Clock, title: '24/7 Support', desc: 'Dedicated concierge' },
    ];

    return (
        <footer className="bg-luxury-black relative overflow-hidden">
            {/* Features Bar */}
            <div className="border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-10">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="p-3 border border-luxury-gold/30 group-hover:border-luxury-gold group-hover:bg-luxury-gold/10 transition-all duration-300">
                                    <feature.icon className="text-luxury-gold" size={22} />
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium">{feature.title}</h4>
                                    <p className="text-gray-500 text-xs">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-b border-white/5 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                                Stay Connected
                            </span>
                            <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">
                                Join the CHRONOS Circle
                            </h3>
                            <p className="text-gray-400 mb-8">
                                Subscribe to receive exclusive access to new collections, private events, and personalized offers.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="input-luxury flex-1"
                                />
                                <button type="submit" className="btn-primary whitespace-nowrap">
                                    Subscribe
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="inline-block mb-6">
                                <span className="text-3xl font-serif font-bold text-gradient-gold">CHRONOS</span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                                Curating the world's finest timepieces for the distinguished collector since 2010.
                                Experience luxury, precision, and timeless elegance.
                            </p>
                            <div className="flex gap-4">
                                {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300"
                                    >
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-serif text-lg mb-6">Collection</h4>
                            <ul className="space-y-4">
                                {['New Arrivals', 'Luxury', 'Sport', 'Classic', 'Limited Edition'].map((item) => (
                                    <li key={item}>
                                        <Link 
                                            href="/shop"
                                            className="text-gray-400 hover:text-luxury-gold text-sm transition-colors flex items-center gap-2 group"
                                        >
                                            <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            <span>{item}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-white font-serif text-lg mb-6">Company</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Our Story', path: '/about' },
                                    { label: 'Brands', path: '/brands' },
                                    { label: 'Contact', path: '/contact' },
                                    { label: 'Careers', path: '/careers' },
                                    { label: 'Press', path: '/press' },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link 
                                            href={item.path}
                                            className="text-gray-400 hover:text-luxury-gold text-sm transition-colors flex items-center gap-2 group"
                                        >
                                            <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-serif text-lg mb-6">Get in Touch</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <MapPin size={18} className="text-luxury-gold mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-400 text-sm">
                                        123 Luxury Avenue<br />New York, NY 10001
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={18} className="text-luxury-gold flex-shrink-0" />
                                    <a href="tel:+1234567890" className="text-gray-400 hover:text-luxury-gold text-sm transition-colors">
                                        +1 (234) 567-890
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={18} className="text-luxury-gold flex-shrink-0" />
                                    <a href="mailto:concierge@chronos.com" className="text-gray-400 hover:text-luxury-gold text-sm transition-colors">
                                        concierge@chronos.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-xs">
                            © {currentYear} CHRONOS. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
                                <Link 
                                    key={item}
                                    href="/"
                                    className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 border border-luxury-gold/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 border border-luxury-gold/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        </footer>
    );
};

export default Footer;


