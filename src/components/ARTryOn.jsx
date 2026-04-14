"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Download, Share2, AlertTriangle, Maximize2, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const MEDIAPIPE_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js';
const CAMERA_UTILS_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1640029074/camera_utils.js';

const ARTryOn = ({ productImage, watchName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus]  = useState('idle'); // idle | loading | tracking | error
    const [error, setError]    = useState('');
    const videoRef  = useRef(null);
    const canvasRef = useRef(null);
    const handsRef  = useRef(null);
    const cameraRef = useRef(null);
    const watchImgRef = useRef(null);
    const { success: showSuccess, error: showError } = useToast();

    // Pre-load watch image
    useEffect(() => {
        if (!productImage) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = productImage;
        img.onload = () => { watchImgRef.current = img; };
    }, [productImage]);

    const drawFrame = useCallback((results) => {
        const canvas = canvasRef.current;
        const video  = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 480;

        // Mirror the video
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        if (!results.multiHandLandmarks?.length || !watchImgRef.current) return;

        // Use wrist landmark (0) and middle-finger MCP (9) as anchor
        const landmarks = results.multiHandLandmarks[0];
        const wrist     = landmarks[0];
        const mcp       = landmarks[9];

        const wx = (1 - wrist.x) * canvas.width;   // mirrored x
        const wy = wrist.y * canvas.height;
        const mx = (1 - mcp.x)   * canvas.width;
        const my = mcp.y          * canvas.height;

        const dx    = mx - wx;
        const dy    = my - wy;
        const angle = Math.atan2(dy, dx);
        const dist  = Math.hypot(dx, dy);
        const size  = dist * 1.8; // watch width relative to wrist-to-MCP distance

        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(angle - Math.PI / 2);
        ctx.drawImage(watchImgRef.current, -size / 2, -size * 0.25, size, size * 0.55);
        ctx.restore();

        setStatus('tracking');
    }, []);

    const startAR = useCallback(async () => {
        setStatus('loading');
        setError('');

        // Request camera
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        } catch {
            setStatus('error');
            setError('Camera permission denied. Please allow camera access and try again.');
            return;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(() => {});
        }

        // Dynamically load MediaPipe
        const loadScript = (src) =>
            new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
                const s = document.createElement('script');
                s.src = src;
                s.onload  = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });

        try {
            await loadScript(CAMERA_UTILS_CDN);
            await loadScript(MEDIAPIPE_CDN);
        } catch {
            // Fallback — MediaPipe failed to load, show static mockup
            setStatus('error');
            setError('Hand tracking library could not be loaded. Showing static preview.');
            return;
        }

        if (!window.Hands) {
            setStatus('error');
            setError('Hand tracking unavailable. Showing static preview instead.');
            return;
        }

        const hands = new window.Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
        });
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.5,
        });
        hands.onResults(drawFrame);
        handsRef.current = hands;

        // Process frames
        const processLoop = async () => {
            if (!videoRef.current || videoRef.current.paused) return;
            await hands.send({ image: videoRef.current });
            requestAnimationFrame(processLoop);
        };
        videoRef.current.addEventListener('loadeddata', processLoop, { once: true });
    }, [drawFrame]);

    const stopAR = useCallback(() => {
        const video = videoRef.current;
        if (video?.srcObject) {
            video.srcObject.getTracks().forEach(t => t.stop());
            video.srcObject = null;
        }
        handsRef.current = null;
        setStatus('idle');
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(startAR, 200);
    };

    const handleClose = () => {
        stopAR();
        setIsOpen(false);
    };

    const capture = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');

        // Try Web Share API first
        if (navigator.share && navigator.canShare) {
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], `chronos-${watchName}.png`, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: `${watchName} — Chronos Try-On` });
                    showSuccess('Shared successfully!');
                    return;
                }
            } catch { /* fallback to download */ }
        }

        // Fallback: download
        const link = document.createElement('a');
        link.download = `chronos-${watchName}-tryon.png`;
        link.href = dataUrl;
        link.click();
        showSuccess('Image saved!');
    };

    return (
        <>
            <button
                id="ar-try-on-btn"
                onClick={handleOpen}
                className="flex items-center gap-2.5 px-6 py-3 border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all duration-300 text-xs uppercase tracking-[0.2em] font-semibold"
            >
                <Camera size={16} />
                Try On
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 z-10 bg-black/80 backdrop-blur-md">
                            <div>
                                <p className="text-luxury-gold text-[10px] uppercase tracking-[0.3em]">AR Try-On</p>
                                <p className="text-white text-sm font-medium">{watchName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {status === 'tracking' && (
                                    <button
                                        id="ar-capture-btn"
                                        onClick={capture}
                                        className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-black text-xs uppercase tracking-widest font-bold hover:bg-yellow-400 transition-colors"
                                    >
                                        <Download size={14} /> Save
                                    </button>
                                )}
                                <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Close AR">
                                    <X size={22} />
                                </button>
                            </div>
                        </div>

                        {/* Camera / Canvas area */}
                        <div className="flex-1 relative overflow-hidden">
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                                playsInline
                                muted
                            />
                            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" />

                            {/* Status overlays */}
                            {status === 'loading' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-4">
                                    <Loader2 size={40} className="text-luxury-gold animate-spin" />
                                    <p className="text-white text-sm">Activating camera...</p>
                                </div>
                            )}

                            {status === 'error' && (
                                /* Graceful fallback — show static wrist mockup with watch overlaid */
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] gap-6 p-8">
                                    <AlertTriangle size={36} className="text-amber-400" />
                                    <p className="text-gray-300 text-sm text-center max-w-xs">{error}</p>
                                    {/* Static mock */}
                                    <div className="relative w-64 h-64 mt-4">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-4 border-gray-600">
                                            <div className="text-gray-500 text-xs uppercase tracking-wider">Wrist Preview</div>
                                        </div>
                                        {productImage && (
                                            <img
                                                src={productImage}
                                                alt={watchName}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 object-contain drop-shadow-2xl"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {status === 'idle' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                                    <Loader2 size={32} className="text-luxury-gold animate-spin" />
                                </div>
                            )}

                            {status === 'tracking' && (
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                    <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 text-white text-xs flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        Hold your wrist toward the camera
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ARTryOn;
