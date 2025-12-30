import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    ChevronRight,
    MoreVertical,
    Eye,
    Trash2,
    Package,
    Truck,
    CheckCircle,
    Clock,
    X,
    ExternalLink,
    RefreshCw
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import api from '../../services/api';

const AdminOrders = () => {
    const { updateOrderStatus, deleteOrder } = useOrders();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch ALL orders from API for admin
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.orders.getAll();
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        const id = o.id || '';
        const name = o.customerName || '';
        const search = searchTerm.toLowerCase();
        return id.toLowerCase().includes(search) || name.toLowerCase().includes(search);
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Processing': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={14} />;
            case 'Shipped': return <Truck size={14} />;
            case 'Processing': return <Package size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Order Management</h1>
                    <p className="text-gray-400">Track and manage customer orders.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchOrders}
                        disabled={loading}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-luxury-gold/50 transition-colors text-sm flex items-center gap-2"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-luxury-gold/50 transition-colors text-sm">
                        Export Orders
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-luxury-black border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-sm hover:border-luxury-gold/50 transition-colors">
                    <Filter size={18} />
                    <span>Filter Status</span>
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-luxury-black border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-serif font-semibold text-luxury-gold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-300">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-white">
                                        ${(order.totalAmount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-gray-400 hover:text-luxury-gold bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteOrder(order.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative bg-luxury-black border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-2xl font-serif font-bold text-white">Order Details</h2>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold mb-3">Customer Info</h3>
                                        <p className="text-white font-medium">{selectedOrder.customerName}</p>
                                        <p className="text-gray-400 text-sm">{selectedOrder.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold mb-3">Shipping Address</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{selectedOrder.shippingAddress}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold mb-4">Ordered Items</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center text-luxury-gold border border-white/5">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package size={24} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{item.name}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-white">${item.price.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div>
                                        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold mb-3">Order Status</h3>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                                        >
                                            <option className="bg-luxury-black">Pending</option>
                                            <option className="bg-luxury-black">Processing</option>
                                            <option className="bg-luxury-black">Shipped</option>
                                            <option className="bg-luxury-black">Delivered</option>
                                        </select>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-bold mb-1">Total Amount</h3>
                                        <p className="text-3xl font-serif font-bold text-white">${(selectedOrder.totalAmount || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end gap-3">
                                <button className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                                    Print Invoice
                                </button>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="btn-primary py-2 px-8 rounded-full text-xs"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
