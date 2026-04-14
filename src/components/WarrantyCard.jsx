import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Calendar, Clock } from 'lucide-react';

export default function WarrantyCard({ warranty }) {
    const { product, serialNumber, warrantyExpiryDate, nextServiceDueDate, movementType } = warranty;
    
    const isExpired = new Date(warrantyExpiryDate).getTime() < new Date().getTime();

    return (
        <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-[#0a0a0a] p-6 flex justify-center items-center border-r border-[#222]">
                    <img 
                        src={product?.images?.[0] || '/placeholder.png'} 
                        alt={product?.name}
                        className="w-full max-w-[200px] h-auto object-contain"
                    />
                </div>
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl text-white font-serif mb-1">{product?.name}</h3>
                                <p className="text-gray-400 text-sm">{product?.brand}</p>
                            </div>
                            <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${isExpired ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/50'}`}>
                                <ShieldCheck className="w-3 h-3" />
                                {isExpired ? 'Expired' : 'Active'}
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Serial Number</p>
                            <p className="text-white font-mono bg-[#1a1a1a] px-3 py-1 rounded border border-[#222] inline-block">
                                {serialNumber}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Expiration Date</p>
                                <p className="text-white">{new Date(warrantyExpiryDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Next Service</p>
                                <p className="text-white">{new Date(nextServiceDueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#333] flex justify-between items-center">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Movement: {movementType}</span>
                        <Link href={`/warranty/${serialNumber}`} className="text-[#D4AF37] hover:text-white font-medium text-sm transition-colors uppercase tracking-widest">
                            Manage Service &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
