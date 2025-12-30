import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
    const icons = {
        success: <CheckCircle className="text-emerald-400" size={20} />,
        error: <AlertCircle className="text-red-400" size={20} />,
        info: <Info className="text-blue-400" size={20} />,
        warning: <AlertTriangle className="text-amber-400" size={20} />
    };

    const colors = {
        success: 'border-emerald-500/20 bg-emerald-500/5',
        error: 'border-red-500/20 bg-red-500/5',
        info: 'border-blue-500/20 bg-blue-500/5',
        warning: 'border-amber-500/20 bg-amber-500/5'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-4 p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[type]}`}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            
            <div className="flex-1">
                <p className="text-sm font-medium text-white/90 leading-relaxed">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
            >
                <X size={16} />
            </button>
            <motion.div 
                className={`absolute bottom-0 left-0 h-0.5 ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-amber-500'}`}
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
            />
        </motion.div>
    );
};

export default Toast;
