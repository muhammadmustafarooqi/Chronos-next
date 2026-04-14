"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User, Gem, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Parse response text to extract product links from _id mentions
const ParsedMessage = ({ text }) => {
    // Match patterns like: "Product Name (_id: 64abc...)" or "64abc..." as standalone 24-char hex
    const parts = [];
    const idRegex = /\(?_?id[:\s]+([a-f0-9]{24})\)?/gi;
    let last = 0;
    let match;
    const cleanText = text;

    while ((match = idRegex.exec(cleanText)) !== null) {
        if (match.index > last) {
            parts.push({ type: 'text', content: cleanText.slice(last, match.index) });
        }
        parts.push({ type: 'link', id: match[1] });
        last = match.index + match[0].length;
    }
    if (last < cleanText.length) {
        parts.push({ type: 'text', content: cleanText.slice(last) });
    }

    if (parts.length === 0) return <span className="whitespace-pre-wrap">{text}</span>;

    return (
        <span className="whitespace-pre-wrap">
            {parts.map((p, i) =>
                p.type === 'link' ? (
                    <Link
                        key={i}
                        href={`/product/${p.id}`}
                        className="inline-flex items-center gap-1 text-luxury-gold underline underline-offset-2 hover:text-yellow-300 transition-colors text-xs"
                    >
                        View Product <ExternalLink size={11} />
                    </Link>
                ) : (
                    <span key={i}>{p.content}</span>
                )
            )}
        </span>
    );
};

const WatchConcierge = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Welcome to Chronos. I'm your personal watch concierge — ask me anything about our collection, watch movements, or help finding your perfect timepiece.",
        }
    ]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const { error: showError } = useToast();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg = { role: 'user', content: text };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // Build the history to send (exclude un-sendable first welcome message for cleanliness)
            const historyToSend = newMessages.slice(1, -1); // skip first assistant greeting + current user msg
            const res = await fetch(`${API_BASE}/concierge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: historyToSend }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Concierge error');
            setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
        } catch (err) {
            showError('Our concierge is momentarily unavailable. Please try again.');
            setMessages(prev => prev.filter(m => m !== userMsg));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const SUGGESTIONS = [
        'Recommend a dress watch under $5,000',
        'What is a tourbillon?',
        'Best watches for diving',
        'Show me your most exclusive pieces',
    ];

    return (
        <>
            {/* Floating trigger button */}
            <motion.button
                id="watch-concierge-trigger"
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.5, type: 'spring', stiffness: 180 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 left-4 md:left-6 z-40 flex items-center gap-2 px-4 py-3 shadow-2xl border border-white/10 bg-luxury-charcoal backdrop-blur-xl"
                aria-label="Open Watch Concierge"
            >
                {/* Pulse ring */}
                <motion.span
                    animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 border border-luxury-gold/40"
                />
                <Bot size={18} className="text-luxury-gold" />
                <span className="text-white text-xs font-semibold uppercase tracking-[0.15em] hidden md:inline">
                    Concierge
                </span>
            </motion.button>

            {/* Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="watch-concierge-panel"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed bottom-20 left-4 md:left-6 z-50 w-[calc(100vw-2rem)] max-w-sm md:max-w-md flex flex-col shadow-2xl"
                        style={{
                            background: 'rgba(14,14,14,0.97)',
                            border: '1px solid rgba(212,175,55,0.2)',
                            height: 'min(500px, calc(100vh - 180px))',
                            backdropFilter: 'blur(24px)',
                        }}
                        role="dialog"
                        aria-label="Chronos Watch Concierge"
                    >
                        {/* Gold top accent */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Gem size={15} className="text-luxury-gold" />
                                <span className="text-white text-xs uppercase tracking-[0.25em] font-medium">
                                    Watch Concierge
                                </span>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-white transition-colors p-1"
                                aria-label="Close concierge"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-7 h-7 rounded-full border border-luxury-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Gem size={12} className="text-luxury-gold" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] px-3 py-2.5 text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-luxury-gold/10 border border-luxury-gold/20 text-white'
                                                : 'bg-white/5 border border-white/5 text-gray-200'
                                        }`}
                                    >
                                        <ParsedMessage text={msg.content} />
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <User size={12} className="text-white/60" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="w-7 h-7 rounded-full border border-luxury-gold/30 flex items-center justify-center">
                                        <Gem size={12} className="text-luxury-gold" />
                                    </div>
                                    <div className="bg-white/5 border border-white/5 px-4 py-3 flex items-center gap-2">
                                        <motion.div
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                        >
                                            <Loader2 size={14} className="text-luxury-gold animate-spin" />
                                        </motion.div>
                                        <span className="text-gray-500 text-xs">Consulting the archives...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Suggestions (only when no user messages yet) */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setInput(s); inputRef.current?.focus(); }}
                                        className="text-[10px] px-2.5 py-1.5 border border-luxury-gold/20 text-luxury-gold/70 hover:text-luxury-gold hover:border-luxury-gold/50 transition-colors uppercase tracking-wider"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/5 flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                id="concierge-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about our collection..."
                                rows={1}
                                className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 resize-none focus:outline-none focus:border-luxury-gold/50 transition-colors placeholder:text-gray-600 scrollbar-hide"
                                style={{ maxHeight: '100px', overflowY: 'auto' }}
                                disabled={loading}
                            />
                            <button
                                id="concierge-send"
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className={`p-2.5 flex items-center justify-center transition-all ${
                                    input.trim() && !loading
                                        ? 'bg-luxury-gold text-black hover:bg-yellow-400'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                }`}
                                aria-label="Send message"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default WatchConcierge;
