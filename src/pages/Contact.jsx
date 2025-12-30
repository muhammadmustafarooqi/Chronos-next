import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
    const { success: showSuccess } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setIsSubmitted(true);
        showSuccess("Your message has been sent successfully. Our concierge will contact you soon.");
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Our Showroom',
            lines: ['123 Luxury Avenue', 'New York, NY 10001'],
        },
        {
            icon: Phone,
            title: 'Call Us',
            lines: ['+1 (234) 567-890', '+1 (234) 567-891'],
        },
        {
            icon: Mail,
            title: 'Email Us',
            lines: ['concierge@chronos.com', 'support@chronos.com'],
        },
        {
            icon: Clock,
            title: 'Business Hours',
            lines: ['Mon - Fri: 10AM - 7PM', 'Sat - Sun: 11AM - 5PM'],
        },
    ];

    return (
        <div className="bg-luxury-black min-h-screen">
            {/* Hero */}
            <section className="relative py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal to-luxury-black" />
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                            Get in Touch
                        </span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                            Contact Us
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Our concierge team is available to assist you with any inquiries about our collection
                            or to arrange a private viewing.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 border border-white/5 hover:border-luxury-gold/30 transition-colors group"
                            >
                                <div className="w-12 h-12 border border-luxury-gold/30 flex items-center justify-center mb-4 group-hover:bg-luxury-gold/10 transition-colors">
                                    <info.icon className="text-luxury-gold" size={20} />
                                </div>
                                <h3 className="text-white font-medium mb-2">{info.title}</h3>
                                {info.lines.map((line, i) => (
                                    <p key={i} className="text-gray-500 text-sm">{line}</p>
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form & Map */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">
                                Send Us a Message
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input-luxury"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="input-luxury"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-luxury"
                                            placeholder="+1 (234) 567-890"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Subject *</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="input-luxury cursor-pointer bg-luxury-black"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="" className="bg-luxury-black text-gray-400">Select a subject</option>
                                            <option value="inquiry" className="bg-luxury-black text-white">Product Inquiry</option>
                                            <option value="viewing" className="bg-luxury-black text-white">Private Viewing</option>
                                            <option value="service" className="bg-luxury-black text-white">Watch Service</option>
                                            <option value="other" className="bg-luxury-black text-white">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="input-luxury resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitted}
                                    className={`btn-primary w-full flex items-center justify-center gap-3 ${isSubmitted ? 'bg-green-500' : ''
                                        }`}
                                >
                                    {isSubmitted ? (
                                        <>
                                            <Check size={18} /> Message Sent
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} /> Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Map Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="h-full min-h-[500px] bg-luxury-charcoal border border-white/5 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <MapPin className="text-luxury-gold mx-auto mb-4" size={48} />
                                    <h3 className="text-xl font-serif text-white mb-2">Visit Our Showroom</h3>
                                    <p className="text-gray-500 mb-6">
                                        123 Luxury Avenue<br />
                                        New York, NY 10001
                                    </p>
                                    <a
                                        href="https://maps.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline inline-block"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </div>

                            {/* Corner Decoration */}
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-luxury-gold/20 -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
