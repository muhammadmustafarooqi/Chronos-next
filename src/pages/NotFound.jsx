import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
            {/* Ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 60%)' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center max-w-lg relative"
            >
                {/* 404 Number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="mb-6"
                >
                    <span
                        className="text-[10rem] font-serif font-bold leading-none select-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        404
                    </span>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-4 justify-center mb-8">
                    <div className="h-px w-16 bg-luxury-gold/30" />
                    <span className="text-luxury-gold text-xs uppercase tracking-[0.4em]">Page Not Found</span>
                    <div className="h-px w-16 bg-luxury-gold/30" />
                </div>

                <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    This Page Doesn't Exist
                </h1>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    The page you're looking for may have been moved, removed, or never existed.
                    Let us guide you back to our curated collection.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/" className="btn-primary flex items-center gap-2">
                        <Home size={16} />
                        Return Home
                    </Link>
                    <Link to="/shop" className="btn-outline flex items-center gap-2">
                        <ArrowLeft size={16} />
                        View Collection
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
