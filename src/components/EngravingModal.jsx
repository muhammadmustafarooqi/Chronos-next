import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PenTool, Check, Info } from 'lucide-react';

const FONTS = [
    { id: 'serif', name: 'Classic Serif', family: 'serif', label: 'Optima' },
    { id: 'sans', name: 'Modern Sans', family: 'sans-serif', label: 'Helvetica' },
    { id: 'cursive', name: 'Elegant Cursive', family: 'cursive', label: 'Snell Roundhand' },
];

const EngravingModal = ({ isOpen, onClose, onSave }) => {
    const [text, setText] = useState('');
    const [selectedFont, setSelectedFont] = useState(FONTS[0]);
    const maxLength = 25;

    // Metallic texture background for the case back simulator
    const caseBackStyle = {
        background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 20%, #b8b8b8 50%, #ffffff 80%, #e0e0e0 100%)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1), inset 0 0 10px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.5)',
        borderRadius: '50%',
        position: 'relative',
    };

    const handleSave = () => {
        onSave({ text, font: selectedFont.id });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-luxury-charcoal border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-black/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Left: Interactive Preview */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center bg-[#0a0a0a] border-r border-white/5 relative">
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #D4AF37 0%, transparent 60%)' }} />
                            
                            <h3 className="text-white font-serif text-xl absolute top-8 left-8 flex items-center gap-2 z-10">
                                <PenTool size={18} className="text-luxury-gold" /> Live Preview
                            </h3>

                            {/* The Watch Case Back */}
                            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mt-12 mb-8 z-10" style={caseBackStyle}>
                                {/* Brushed metal effect using SVG filter (simulated with CSS circles for simplicity here) */}
                                <div className="absolute inset-2 rounded-full border border-black/5" />
                                <div className="absolute inset-4 rounded-full border border-black/5" />
                                <div className="absolute inset-[20%] rounded-full border border-black/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
                                
                                {/* Inner Text Area - The engraved text */}
                                <div className="absolute inset-0 flex items-center justify-center p-12 text-center overflow-hidden">
                                    {text ? (
                                        <motion.p
                                            key={selectedFont.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-black/80 font-medium break-words w-full"
                                            style={{ 
                                                fontFamily: selectedFont.family, 
                                                fontSize: text.length > 15 ? '1.25rem' : '1.5rem',
                                                textShadow: '1px 1px 0px rgba(255,255,255,0.5), -1px -1px 0px rgba(0,0,0,0.2)',
                                                letterSpacing: selectedFont.id === 'serif' ? '0.1em' : 'normal',
                                            }}
                                        >
                                            {text}
                                        </motion.p>
                                    ) : (
                                        <p className="text-black/30 text-sm uppercase tracking-widest font-sans">
                                            Your Engraving Here
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <p className="text-gray-500 text-xs text-center z-10 max-w-xs">
                                Preview is an approximation. Slight adjustments may be made by our artisans to ensure perfect mechanical alignment.
                            </p>
                        </div>

                        {/* Right: Controls */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] mb-2">Personalisation</span>
                            <h2 className="text-3xl font-serif text-white mb-2">Engrave Your Timepiece</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Add a personal touch to your watch case back. A name, a date, or a short message to commemorate an eternal moment.
                            </p>

                            <div className="space-y-8">
                                {/* Text Input */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="text-white text-xs uppercase tracking-widest font-semibold">Your Message</label>
                                        <span className={`text-xs ${text.length > maxLength * 0.8 ? 'text-luxury-gold' : 'text-gray-500'}`}>
                                            {text.length}/{maxLength}
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
                                        placeholder="e.g. 14 • 10 • 2024"
                                        className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-lg focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Font Selector */}
                                <div>
                                    <label className="text-white text-xs uppercase tracking-widest font-semibold mb-3 block">Typography Style</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {FONTS.map(font => (
                                            <button
                                                key={font.id}
                                                onClick={() => setSelectedFont(font)}
                                                className={`p-3 border text-left transition-all ${
                                                    selectedFont.id === font.id
                                                        ? 'border-luxury-gold bg-luxury-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                                        : 'border-white/10 hover:border-white/30 text-gray-400'
                                                }`}
                                            >
                                                <span className="block text-white text-lg mb-1" style={{ fontFamily: font.family }}>Aa</span>
                                                <span className={`text-[10px] uppercase tracking-wider ${selectedFont.id === font.id ? 'text-luxury-gold' : 'text-gray-500'}`}>
                                                    {font.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notice */}
                                <div className="flex gap-3 p-4 bg-white/5 border border-white/5">
                                    <Info className="text-luxury-gold flex-shrink-0" size={16} />
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        Personalised items cannot be returned or exchanged. Please allow an additional 3-5 business days for delivery. Complimentary service.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!text.trim()}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                                            text.trim()
                                                ? 'bg-luxury-gold text-black hover:bg-white border hover:border-white'
                                                : 'bg-white/10 text-gray-500 cursor-not-allowed border-transparent'
                                        }`}
                                    >
                                        <Check size={16} />
                                        Confirm Engraving
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EngravingModal;
