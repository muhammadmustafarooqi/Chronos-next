"use client";
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Save, Paintbrush } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN = () => typeof window !== 'undefined' ? localStorage.getItem('chronos-token') : null;

// ── Configuration Options ──────────────────────────────────
const STRAP_OPTIONS = [
    { id: 'black-leather', label: 'Black Leather',  swatch: '#1a1a1a',  category: 'Leather' },
    { id: 'brown-leather', label: 'Brown Leather',  swatch: '#6B3A2A',  category: 'Leather' },
    { id: 'tan-leather',   label: 'Tan Leather',    swatch: '#C08B5C',  category: 'Leather' },
    { id: 'black-rubber',  label: 'Black Rubber',   swatch: '#222222',  category: 'Rubber' },
    { id: 'blue-rubber',   label: 'Navy Rubber',    swatch: '#1B2A4A',  category: 'Rubber' },
    { id: 'steel',         label: 'Steel Bracelet', swatch: 'linear-gradient(135deg,#b0b0b0,#e0e0e0,#b0b0b0)', category: 'Bracelet' },
];

const DIAL_OPTIONS = [
    { id: 'black',     label: 'Noir',      swatch: '#111111' },
    { id: 'white',     label: 'Blanc',     swatch: '#F5F5F0' },
    { id: 'blue',      label: 'Bleu',      swatch: '#1B2A4A' },
    { id: 'green',     label: 'Vert',      swatch: '#1A3A2A' },
    { id: 'champagne', label: 'Champagne', swatch: '#D4AF37' },
];

const CASE_OPTIONS = [
    { id: 'polished',  label: 'Polished',   swatch: 'linear-gradient(135deg,#d0d0d0,#f5f5f5,#d0d0d0)' },
    { id: 'brushed',   label: 'Brushed',    swatch: 'linear-gradient(90deg,#a0a0a0,#c0c0c0,#a0a0a0)' },
    { id: 'pvd-black', label: 'PVD Black',  swatch: 'linear-gradient(135deg,#111,#2a2a2a,#111)' },
    { id: 'rose-gold', label: 'Rose Gold',  swatch: 'linear-gradient(135deg,#b76e79,#e8b4b8,#b76e79)' },
];

const Swatch = ({ option, selected, onSelect }) => (
    <button
        id={`swatch-${option.id}`}
        onClick={() => onSelect(option.id)}
        title={option.label}
        className={`w-8 h-8 transition-all duration-200 ${
            selected === option.id
                ? 'ring-2 ring-luxury-gold ring-offset-2 ring-offset-luxury-charcoal scale-110'
                : 'hover:scale-105 ring-1 ring-white/10'
        }`}
        style={{ background: option.swatch }}
        aria-label={option.label}
    />
);

const Section = ({ label, options, value, onChange }) => (
    <div>
        <p className="text-white text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold">{label}</p>
        <div className="flex flex-wrap gap-2.5 items-center">
            {options.map(o => (
                <div key={o.id} className="flex flex-col items-center gap-1.5">
                    <Swatch option={o} selected={value} onSelect={onChange} />
                    {value === o.id && (
                        <span className="text-luxury-gold text-[9px] uppercase tracking-wider">{o.label}</span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

// Live 2D watch preview (lightweight visual — no heavy 3D needed for config UI)
const WatchPreview = ({ config, productImage }) => {
    const dial    = DIAL_OPTIONS.find(d => d.id === config.dialColor) || DIAL_OPTIONS[0];
    const strap   = STRAP_OPTIONS.find(s => s.id === config.strapColor) || STRAP_OPTIONS[0];
    const caseOpt = CASE_OPTIONS.find(c => c.id === config.caseFinish) || CASE_OPTIONS[0];

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
            {/* Strap top */}
            <div className="w-8 h-16 mx-auto rounded-t-sm" style={{ background: strap.swatch }} />
            {/* Watch case */}
            <div
                className="w-36 h-36 rounded-full flex items-center justify-center shadow-2xl relative"
                style={{
                    background: caseOpt.swatch,
                    boxShadow: '0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
            >
                {/* Dial */}
                <div
                    className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: dial.swatch }}
                >
                    {productImage ? (
                        <img src={productImage} alt="watch dial" className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="text-center">
                            <div className="w-0.5 h-8 mx-auto mb-1" style={{ background: dial.id === 'black' ? '#fff' : '#111' }} />
                            <div className="text-[8px] uppercase tracking-widest" style={{ color: dial.id === 'black' ? '#D4AF37' : '#111' }}>
                                CHRONOS
                            </div>
                        </div>
                    )}
                </div>
                {/* Lug markers */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: caseOpt.swatch }} />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: caseOpt.swatch }} />
            </div>
            {/* Strap bottom */}
            <div className="w-8 h-16 mx-auto rounded-b-sm" style={{ background: strap.swatch }} />
        </div>
    );
};

const WatchConfigurator = ({ productId, productImage, productName, initialConfig = {} }) => {
    const [config, setConfig] = useState({
        strapColor: initialConfig.strapColor || 'black-leather',
        dialColor:  initialConfig.dialColor  || 'black',
        caseFinish: initialConfig.caseFinish || 'polished',
    });
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const { success: showSuccess, error: showError } = useToast();

    const update = useCallback((key) => (val) => setConfig(prev => ({ ...prev, [key]: val })), []);

    const saveConfig = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/configurations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(TOKEN() ? { Authorization: `Bearer ${TOKEN()}` } : {}),
                },
                body: JSON.stringify({ productId, ...config }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            const configId = data.data.config._id;
            const shareUrl = `${window.location.origin}/product/${productId}?config=${configId}`;

            // Copy to clipboard
            await navigator.clipboard.writeText(shareUrl).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
            showSuccess('Configuration saved! Share link copied to clipboard.');
        } catch (err) {
            showError('Could not save configuration. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-luxury-charcoal border border-white/10 overflow-hidden">
            {/* Gold top bar */}
            <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Live Preview */}
                <div className="relative min-h-[340px] md:min-h-0 bg-[#0a0a0a] border-r border-white/5 p-8 flex items-center justify-center">
                    <div className="absolute top-4 left-4 flex items-center gap-1.5">
                        <Paintbrush size={13} className="text-luxury-gold" />
                        <span className="text-white/50 text-[10px] uppercase tracking-widest">Live Preview</span>
                    </div>
                    <motion.div
                        key={JSON.stringify(config)}
                        initial={{ opacity: 0.7, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <WatchPreview config={config} productImage={productImage} />
                    </motion.div>
                </div>

                {/* Right: Controls */}
                <div className="p-6 md:p-8 flex flex-col gap-6">
                    <div>
                        <p className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] mb-1">Personalisation</p>
                        <h3 className="text-white text-xl font-serif">Configure Your Timepiece</h3>
                    </div>

                    <Section label="Strap" options={STRAP_OPTIONS} value={config.strapColor} onChange={update('strapColor')} />
                    <Section label="Dial"  options={DIAL_OPTIONS}   value={config.dialColor}  onChange={update('dialColor')}  />
                    <Section label="Case Finish" options={CASE_OPTIONS} value={config.caseFinish} onChange={update('caseFinish')} />

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 border-t border-white/10 mt-auto">
                        <button
                            id="save-config-btn"
                            onClick={saveConfig}
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-luxury-gold text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <span className="animate-spin border-2 border-black/30 border-t-black rounded-full w-4 h-4" />
                            ) : copied ? (
                                <><Check size={14} /> Link Copied!</>
                            ) : (
                                <><Save size={14} /> Save & Share</>
                            )}
                        </button>
                        <button
                            id="copy-config-btn"
                            onClick={() => setConfig({ strapColor: 'black-leather', dialColor: 'black', caseFinish: 'polished' })}
                            className="px-4 py-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs uppercase tracking-widest"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchConfigurator;
