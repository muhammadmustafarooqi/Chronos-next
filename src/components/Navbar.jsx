"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useVIP } from '@/context/VIPContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import VIPBadge from '@/components/VIPBadge';

/* ─── Thin SVG icons — no Lucide generics ─────────────────── */
const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="7.5" cy="7.5" r="5.5" />
        <line x1="11.5" y1="11.5" x2="16.5" y2="16.5" />
    </svg>
);
const IconBag = ({ count }) => (
    <span className="relative">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M2 5h14l-1.5 10H3.5L2 5Z" />
            <path d="M6 5a3 3 0 0 1 6 0" />
        </svg>
        {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--gold)] text-black text-[9px] font-semibold
                             w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {count}
            </span>
        )}
    </span>
);
const IconHeart = ({ count }) => (
    <span className="relative">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M9 15S2 10.5 2 5.8A4 4 0 0 1 9 3.5 4 4 0 0 1 16 5.8C16 10.5 9 15 9 15Z" />
        </svg>
        {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--gold)] text-black text-[9px] font-semibold
                             w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {count}
            </span>
        )}
    </span>
);
const IconUser = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="9" cy="6" r="3.5" />
        <path d="M1.5 16a7.5 7.5 0 0 1 15 0" />
    </svg>
);
const IconSun = () => (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="8.5" cy="8.5" r="3.5" />
        {[0,45,90,135,180,225,270,315].map(a => {
            const r = a * Math.PI / 180;
            return <line key={a} x1={8.5+5.5*Math.sin(r)} y1={8.5-5.5*Math.cos(r)}
                         x2={8.5+7.5*Math.sin(r)} y2={8.5-7.5*Math.cos(r)} />;
        })}
    </svg>
);
const IconMoon = () => (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M14 9.5A6.5 6.5 0 0 1 7.5 3a6.5 6.5 0 1 0 6.5 6.5Z" />
    </svg>
);
const IconClose = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" />
    </svg>
);
const IconMenu = () => (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.2">
        <line x1="0" y1="1" x2="22" y2="1" />
        <line x1="4" y1="8" x2="22" y2="8" />
        <line x1="0" y1="15" x2="22" y2="15" />
    </svg>
);

/* ─── Mega-menu data ───────────────────────────────────────── */
const MENUS = {
    Collection: {
        sections: [
            {
                heading: 'By Category',
                links: ['Sport & Dive', 'Dress & Formal', 'Chronograph', 'GMT & Travel', 'Skeleton & Tourbillon'],
            },
            {
                heading: 'By Material',
                links: ['Stainless Steel', 'Yellow Gold', 'Rose Gold', 'Ceramic & Carbon', 'Platinum'],
            },
        ],
        featured: {
            label: 'New Arrivals',
            title: 'The Perpetual Edit',
            sub: 'Curated additions for the discerning collector.',
            href: '/shop?filter=new',
        },
    },
    Brands: {
        sections: [
            {
                heading: 'Maisons',
                links: ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'A. Lange & Söhne', 'Vacheron Constantin'],
            },
            {
                heading: 'Independents',
                links: ['F.P. Journe', 'MB&F', 'Richard Mille', 'H. Moser & Cie', 'De Bethune'],
            },
        ],
        featured: {
            label: 'Spotlight',
            title: 'Maison of the Season',
            sub: 'Exploring the legacy of Patek Philippe.',
            href: '/brands',
        },
    },
    'The Vault': {
        sections: [
            {
                heading: 'Vintage',
                links: ['1950s & Earlier', '1960s Icons', '1970s Sport', '1980s Rarities', 'Archive Pieces'],
            },
            {
                heading: 'Pre-Owned',
                links: ['Recently Added', 'Under $5,000', '$5k – $25k', '$25k – $100k', 'Investment Grade'],
            },
        ],
        featured: {
            label: 'The Vault',
            title: 'Horological Rarities',
            sub: 'Authenticated vintage and pre-owned timepieces.',
            href: '/vault',
        },
    },
};

/* ─── Left / Right nav split ──────────────────────────────── */
const LEFT_LINKS  = ['Collection', 'Matchmaker', 'The Vault'];
const RIGHT_LINKS = ['Brands', 'Our Story'];

/* ═══════════════════════════════════════════════════════════ */
const Navbar = () => {
    const { setIsCartOpen, cartCount }  = useCart();
    const { wishlistCount }             = useWishlist();
    const { isAuthenticated, user }     = useAuth();
    const { isDark, toggleTheme }       = useTheme();
    const { enrolled }                  = useVIP();
    const router                        = useRouter();
    const pathname                      = usePathname();

    const [isScrolled,      setIsScrolled]      = useState(false);
    const [isMobileOpen,    setIsMobileOpen]    = useState(false);
    const [isSearchOpen,    setIsSearchOpen]    = useState(false);
    const [searchQuery,     setSearchQuery]     = useState('');
    const [activeMenu,      setActiveMenu]      = useState(null); // string | null
    const [mounted,         setMounted]         = useState(false);

    const leaveTimer = useRef(null);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setIsMobileOpen(false); }, [pathname]);

    const handleMouseEnter = (label) => {
        clearTimeout(leaveTimer.current);
        if (MENUS[label]) setActiveMenu(label);
    };
    const handleMouseLeave = () => {
        leaveTimer.current = setTimeout(() => setActiveMenu(null), 150);
    };

    const navLink = (label, href) => {
        const isActive = pathname === href;
        const hasMega  = !!MENUS[label];
        return (
            <div
                key={label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(label)}
                onMouseLeave={handleMouseLeave}
            >
                <Link
                    href={href || '#'}
                    className={`group relative flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-300
                        ${isActive ? 'text-[var(--gold)]' : 'text-white/70 hover:text-white'}`}
                >
                    {label}
                    {hasMega && (
                        <svg className={`mt-px transition-transform duration-300 ${activeMenu===label ? 'rotate-180':''}`}
                             width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="currentColor" strokeWidth="1.4">
                            <polyline points="1,1 4,4 7,1"/>
                        </svg>
                    )}
                    {/* Active dot */}
                    {isActive && <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--gold)]" />}
                </Link>
            </div>
        );
    };

    const pathFor = (label) => {
        const map = { Collection: '/shop', Matchmaker: '/matchmaker', 'The Vault': '/vault', Brands: '/brands', 'Our Story': '/about' };
        return map[label] || '/';
    };

    /* ── CSS vars ──────────────────────────────────────────── */
    const style = {
        '--gold': '#C9A84C',
        '--gold-light': '#E2C97E',
        '--black': '#0A0A0A',
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cinzel:wght@400;500&display=swap');
                .nav-font { font-family: 'Cinzel', serif; }
                .logo-font { font-family: 'Cormorant Garamond', serif; }
            `}</style>

            {/* ── Top Bar ────────────────────────────────────────── */}
            <div className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-8 nav-font
                             text-[9px] tracking-[0.25em] text-white/40 border-b border-white/5 transition-all duration-500
                             ${isScrolled ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100'}`}
                 style={{ background: 'rgba(10,10,10,0.97)' }}>
                COMPLIMENTARY SHIPPING ON ORDERS OVER $500 &nbsp;·&nbsp; ESTABLISHED 2010
            </div>

            {/* ── Main Nav ───────────────────────────────────────── */}
            <motion.nav
                style={style}
                initial={{ y: -120 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed left-0 right-0 z-50 transition-all duration-500
                    ${isScrolled
                        ? 'top-0 bg-[rgba(10,10,10,0.97)] backdrop-blur-2xl py-4 border-b border-white/8'
                        : 'top-8 bg-transparent py-5'
                    }`}
            >
                {/* Gold hairline */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-[1400px] mx-auto px-8">
                    <div className="flex items-center justify-between gap-12">

                        {/* ── LEFT LINKS ────────────────────────── */}
                        <div className="hidden lg:flex items-center gap-9">
                            {LEFT_LINKS.map(l => navLink(l, pathFor(l)))}
                        </div>

                        {/* ── LOGO (centered) ───────────────────── */}
                        <Link href="/" className="flex-shrink-0 text-center group">
                            <div className="logo-font flex flex-col items-center leading-none select-none">
                                <span className="text-[10px] nav-font tracking-[0.5em] text-[var(--gold)]/70 font-normal mb-1">
                                    MAISON DE
                                </span>
                                <span className="text-[2.6rem] md:text-[3rem] font-light tracking-[0.12em] text-white
                                                 group-hover:text-[var(--gold-light)] transition-colors duration-500">
                                    CHRONOS
                                </span>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="block w-10 h-px bg-[var(--gold)]/40" />
                                    <span className="text-[8px] nav-font tracking-[0.4em] text-[var(--gold)]/50">HORLOGERIE</span>
                                    <span className="block w-10 h-px bg-[var(--gold)]/40" />
                                </div>
                            </div>
                        </Link>

                        {/* ── RIGHT LINKS ───────────────────────── */}
                        <div className="hidden lg:flex items-center gap-9">
                            {RIGHT_LINKS.map(l => navLink(l, pathFor(l)))}
                            {user?.isAdmin && navLink('Dashboard', '/admin')}

                            {/* Divider */}
                            <span className="w-px h-5 bg-white/15" />

                            {/* Theme */}
                            <button onClick={toggleTheme}
                                    className="text-white/50 hover:text-[var(--gold)] transition-colors duration-300">
                                {mounted && (isDark ? <IconSun /> : <IconMoon />)}
                            </button>

                            {/* Search */}
                            <button onClick={() => setIsSearchOpen(true)}
                                    className="text-white/50 hover:text-[var(--gold)] transition-colors duration-300">
                                <IconSearch />
                            </button>

                            {/* Wishlist */}
                            <Link href="/wishlist" className="text-white/50 hover:text-[var(--gold)] transition-colors duration-300">
                                <IconHeart count={wishlistCount} />
                            </Link>

                            {/* Account */}
                            <Link href={isAuthenticated ? '/account' : '/login'}
                                  className="text-white/50 hover:text-[var(--gold)] transition-colors duration-300">
                                <IconUser />
                            </Link>

                            {/* VIP badge */}
                            {isAuthenticated && enrolled && (
                                <VIPBadge size="xs" showLabel={false} />
                            )}

                            {/* Cart */}
                            <button onClick={() => setIsCartOpen(true)}
                                    className="text-white/50 hover:text-[var(--gold)] transition-colors duration-300">
                                <IconBag count={cartCount} />
                            </button>
                        </div>

                        {/* ── MOBILE: icons + hamburger ─────────── */}
                        <div className="flex lg:hidden items-center gap-4">
                            <button onClick={() => setIsSearchOpen(true)} className="text-white/60"><IconSearch /></button>
                            <button onClick={() => setIsCartOpen(true)}   className="text-white/60"><IconBag count={cartCount} /></button>
                            <button onClick={() => setIsMobileOpen(v => !v)} className="text-white/70">
                                {isMobileOpen ? <IconClose /> : <IconMenu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── MEGA MENU ─────────────────────────────────── */}
                <AnimatePresence>
                    {activeMenu && MENUS[activeMenu] && (
                        <motion.div
                            key={activeMenu}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            onMouseEnter={() => clearTimeout(leaveTimer.current)}
                            onMouseLeave={handleMouseLeave}
                            className="absolute left-0 right-0 top-full"
                            style={{ background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}
                        >
                            {/* Top gold line */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

                            <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-[1fr_1fr_340px] gap-12">
                                {/* Sections */}
                                {MENUS[activeMenu].sections.map(sec => (
                                    <div key={sec.heading}>
                                        <p className="nav-font text-[9px] tracking-[0.3em] text-[var(--gold)]/70 mb-5 uppercase">
                                            {sec.heading}
                                        </p>
                                        <ul className="space-y-3">
                                            {sec.links.map(lnk => (
                                                <li key={lnk}>
                                                    <Link
                                                        href={`/shop?filter=${encodeURIComponent(lnk.toLowerCase())}`}
                                                        onClick={() => setActiveMenu(null)}
                                                        className="logo-font text-[1.05rem] font-light text-white/60 hover:text-white
                                                                   transition-colors duration-200 tracking-wide block"
                                                    >
                                                        {lnk}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                {/* Featured panel */}
                                {(() => {
                                    const f = MENUS[activeMenu].featured;
                                    return (
                                        <Link href={f.href} onClick={() => setActiveMenu(null)}
                                              className="group relative flex flex-col justify-end p-7 overflow-hidden border border-white/8
                                                         hover:border-[var(--gold)]/30 transition-all duration-500">
                                            {/* BG pattern */}
                                            <div className="absolute inset-0"
                                                 style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)' }} />
                                            <div className="absolute top-5 right-5 w-20 h-20 rounded-full"
                                                 style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />
                                            <span className="nav-font text-[9px] tracking-[0.3em] text-[var(--gold)]/70 mb-2 relative z-10">
                                                {f.label}
                                            </span>
                                            <h3 className="logo-font text-[1.4rem] font-light text-white leading-tight mb-2 relative z-10">
                                                {f.title}
                                            </h3>
                                            <p className="text-[11px] text-white/40 tracking-wide leading-relaxed mb-4 relative z-10">
                                                {f.sub}
                                            </p>
                                            <span className="nav-font text-[9px] tracking-[0.25em] text-[var(--gold)] flex items-center gap-2 relative z-10
                                                             group-hover:gap-3 transition-all duration-300">
                                                EXPLORE
                                                <svg width="18" height="8" viewBox="0 0 18 8" fill="none" stroke="currentColor" strokeWidth="1">
                                                    <line x1="0" y1="4" x2="14" y2="4"/>
                                                    <polyline points="10,1 14,4 10,7"/>
                                                </svg>
                                            </span>
                                        </Link>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ── MOBILE MENU ────────────────────────────────────── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.35, ease: [0.16,1,0.3,1] }}
                        className="fixed inset-0 z-40 lg:hidden flex flex-col"
                        style={{ background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(24px)' }}
                    >
                        {/* Logo top */}
                        <div className="flex items-center justify-center pt-24 pb-10 border-b border-white/8">
                            <span className="logo-font text-3xl font-light tracking-[0.18em] text-white">CHRONOS</span>
                        </div>

                        <nav className="flex-1 flex flex-col items-center justify-center gap-7">
                            {[...LEFT_LINKS, ...RIGHT_LINKS].map((l, i) => (
                                <motion.div key={l}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 + 0.1 }}>
                                    <Link href={pathFor(l)}
                                          className={`logo-font text-2xl font-light tracking-wide
                                              ${pathname === pathFor(l) ? 'text-[var(--gold)]' : 'text-white/70 hover:text-white'}
                                              transition-colors duration-200`}>
                                        {l}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        <div className="flex items-center justify-center gap-8 pb-16">
                            <button onClick={toggleTheme} className="text-white/40 hover:text-[var(--gold)] transition-colors">
                                {mounted && (isDark ? <IconSun /> : <IconMoon />)}
                            </button>
                            <Link href="/wishlist" className="text-white/40 hover:text-[var(--gold)] transition-colors">
                                <IconHeart count={wishlistCount} />
                            </Link>
                            <Link href={isAuthenticated ? '/account' : '/login'} className="text-white/40 hover:text-[var(--gold)] transition-colors">
                                <IconUser />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── SEARCH MODAL ───────────────────────────────────── */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[60] flex flex-col items-center justify-start pt-[22vh] px-6"
                        style={{ background: 'rgba(5,5,5,0.96)', backdropFilter: 'blur(24px)' }}
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            className="w-full max-w-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <p className="nav-font text-[9px] tracking-[0.35em] text-[var(--gold)]/60 mb-6 text-center">
                                SEARCH THE COLLECTION
                            </p>
                            <div className="relative border-b border-white/20 focus-within:border-[var(--gold)]/60 transition-colors duration-300">
                                <input
                                    type="text"
                                    placeholder="Timepiece, brand or reference…"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && searchQuery.trim()) {
                                            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }
                                        if (e.key === 'Escape') { setIsSearchOpen(false); setSearchQuery(''); }
                                    }}
                                    className="w-full bg-transparent logo-font text-2xl font-light text-white py-4 pr-12
                                               placeholder-white/20 focus:outline-none tracking-wide"
                                />
                                <button onClick={() => setIsSearchOpen(false)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                                    <IconClose />
                                </button>
                            </div>
                            <p className="nav-font text-[9px] tracking-[0.2em] text-white/20 mt-5 text-center">
                                PRESS ENTER TO SEARCH · ESC TO CLOSE
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;