import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Clock, ArrowRight } from 'lucide-react';

const About = () => {
    const stats = [
        { value: '2010', label: 'Founded' },
        { value: '500+', label: 'Luxury Timepieces' },
        { value: '15K+', label: 'Happy Collectors' },
        { value: '50+', label: 'Partner Brands' },
    ];

    const values = [
        {
            icon: Award,
            title: 'Authenticity Guaranteed',
            description: 'Every timepiece undergoes rigorous authentication by our certified horologists.'
        },
        {
            icon: Users,
            title: 'Expert Guidance',
            description: 'Our team of specialists provides personalized recommendations for every collector.'
        },
        {
            icon: Globe,
            title: 'Global Reach',
            description: 'Serving collectors worldwide with secure, insured shipping to every destination.'
        },
        {
            icon: Clock,
            title: 'Lifetime Service',
            description: 'Complimentary maintenance and support for the entire lifetime of your timepiece.'
        },
    ];

    return (
        <div className="bg-luxury-black min-h-screen">
            {/* Hero */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1509941943102-10c232535736?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Watchmaking"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-luxury-black/50" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                            Our Story
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                            A Legacy of <br />
                            <span className="text-gradient-gold">Excellence</span>
                        </h1>
                        <p className="text-gray-400 text-xl leading-relaxed">
                            Since 2010, CHRONOS has been the trusted destination for discerning collectors
                            seeking the world's most exceptional timepieces.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-serif text-gradient-gold mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 text-sm uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Heritage / Watchmaking Immersive Section */}
            <section className="relative py-32 bg-[#050505] overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-luxury-charcoal/50 to-transparent pointer-events-none" />
                <div className="absolute -left-40 top-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
                        
                        {/* Text Block - Overlapping the image on large screens */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="lg:col-span-5 lg:col-start-1 z-20"
                        >
                            <div className="bg-luxury-black/80 backdrop-blur-2xl border border-white/5 p-10 lg:p-14 shadow-2xl relative">
                                <div className="absolute top-0 left-0 w-1 h-12 bg-luxury-gold" />
                                
                                <span className="text-luxury-gold text-xs uppercase tracking-[0.4em] font-medium mb-6 block">
                                    Our Heritage
                                </span>
                                
                                <h2 className="text-5xl lg:text-6xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
                                    The Art of <br />
                                    <span className="text-gray-500 italic font-light">Watchmaking</span>
                                </h2>
                                
                                <div className="space-y-6 text-gray-400 text-sm leading-[1.9] font-light">
                                    <p>
                                        CHRONOS was founded with a singular vision: to create a sanctuary for those who understand
                                        that a timepiece is more than an instrument—it is the culmination of centuries of human ingenuity, 
                                        a statement of uncompromising values, and a wearable work of art.
                                    </p>
                                    <p>
                                        Our master curators travel the globe, building intimate relationships with the most prestigious
                                        manufacturers and elite private collectors. Every gear, every spring, and every polished facet 
                                        is meticulously verified to guarantee legendary provenance.
                                    </p>
                                    <p className="text-white/80 font-medium italic">
                                        "Time is the ultimate luxury. How you measure it should be extraordinary."
                                    </p>
                                </div>
                                
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-3 text-luxury-gold hover:text-white transition-colors mt-12 group"
                                >
                                    <span className="uppercase tracking-[0.3em] text-[10px] font-bold">Consult a Horologist</span>
                                    <ArrowRight size={16} className="transform group-hover:translate-x-3 transition-transform duration-500" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Image Block - Larger and slightly offset */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="lg:col-span-8 lg:col-start-5 lg:-ml-24 relative z-10"
                        >
                            <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                                    alt="The intricate movement of a luxury mechanical watch"
                                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                />
                                {/* Overlay styling */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute inset-x-0 bottom-0 p-8 flex justify-end pointer-events-none">
                                    <div className="text-right">
                                        <p className="text-luxury-gold text-[9px] uppercase tracking-[0.3em] mb-1">Precision</p>
                                        <p className="text-white/60 font-serif text-sm">Hand-assembled calibres.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Gold Frame */}
                            <div className="hidden lg:block absolute -inset-4 border border-luxury-gold/20 z-0 pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-28 bg-luxury-charcoal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                            Why Choose Us
                        </span>
                        <h2 className="text-4xl font-serif font-bold text-white">
                            Our Commitment to You
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-8 border border-white/5 hover:border-luxury-gold/30 transition-colors"
                            >
                                <div className="w-14 h-14 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="text-luxury-gold" size={24} />
                                </div>
                                <h3 className="text-lg font-serif text-white mb-3">{value.title}</h3>
                                <p className="text-gray-500 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-serif font-bold text-white mb-6">
                            Begin Your Collection Today
                        </h2>
                        <p className="text-gray-400 mb-10">
                            Discover the perfect timepiece that reflects your style and values.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/shop" className="btn-primary">
                                Explore Collection
                            </Link>
                            <Link to="/contact" className="btn-outline">
                                Schedule Consultation
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
