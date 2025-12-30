import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    Truck,
    MapPin,
    CreditCard,
    Check,
    ShoppingBag,
    ArrowLeft,
    Banknote,
    Shield,
    Clock
} from 'lucide-react';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { addOrder } = useOrders();
    const { user } = useAuth();
    const { error: showError, success: showSuccess } = useToast();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
    });

    // Pre-fill user data
    React.useEffect(() => {
        if (user && !shippingData.email) {
            const nameToSplit = user.name || (user.email ? user.email.split('@')[0] : 'Guest');
            const names = nameToSplit.split(' ');
            setShippingData(prev => ({
                ...prev,
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleShippingChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        try {
            const customerName = `${shippingData.firstName} ${shippingData.lastName}`.trim() || 'Guest Customer';

            // Prepare order data for API
            const orderData = {
                customerName: customerName,
                email: shippingData.email,
                phone: shippingData.phone,
                items: cart.map(item => ({
                    id: item._id || item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.images ? item.images[0] : (item.image || 'https://via.placeholder.com/150')
                })),
                totalAmount: cartTotal,
                shippingAddress: {
                    street: shippingData.address,
                    apartment: shippingData.apartment,
                    city: shippingData.city,
                    state: shippingData.state,
                    zipCode: shippingData.zipCode,
                    country: shippingData.country
                },
                paymentMethod: paymentMethod
            };

            console.log('Creating order:', orderData);

            // Call API through OrderContext (which handles MongoDB and fallback)
            const result = await addOrder(orderData);

            const orderId = result?.order?.id || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            setOrderNumber(orderId);
            setIsProcessing(false);
            setOrderPlaced(true);
            clearCart();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error placing order:', error);
            setIsProcessing(false);
            showError(error.message || 'There was an error placing your order. Please try again.');
        }
    };

    // Empty cart check
    if (cart.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="text-gray-600" size={36} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif text-white mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 text-sm sm:text-base">Add some luxury timepieces to proceed with checkout.</p>
                    <Link to="/shop" className="btn-primary">
                        Explore Collection
                    </Link>
                </div>
            </div>
        );
    }

    // Order Confirmation
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-luxury-black py-12 sm:py-20">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                            <Check className="text-white" size={32} />
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                            Order Confirmed!
                        </h1>
                        <p className="text-gray-400 text-base sm:text-lg mb-2">
                            Thank you for your order
                        </p>
                        <p className="text-luxury-gold text-lg sm:text-xl font-medium mb-6 sm:mb-8">
                            Order #{orderNumber}
                        </p>

                        <div className="glass-card p-6 sm:p-8 mb-6 sm:mb-8 text-left">
                            <h3 className="text-white font-serif text-lg mb-6 flex items-center gap-3">
                                <Banknote className="text-luxury-gold" size={20} />
                                Cash on Delivery
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Payment Method</span>
                                    <span className="text-white">Pay on Delivery</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-gray-400">Delivery Address</span>
                                    <span className="text-white sm:text-right">
                                        {shippingData.address}, {shippingData.city}<br />
                                        {shippingData.state} {shippingData.zipCode}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Estimated Delivery</span>
                                    <span className="text-white">3-5 Business Days</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between text-base sm:text-lg">
                                    <span className="text-white font-medium">Amount to Pay</span>
                                    <span className="text-luxury-gold font-serif font-bold">
                                        ${cartTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
                            A confirmation email has been sent to {shippingData.email}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/shop" className="btn-primary">
                                Continue Shopping
                            </Link>
                            <Link to="/" className="btn-outline">
                                Return Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-black">
            {/* Header */}
            <div className="bg-luxury-charcoal border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex items-center justify-between">
                        <Link to="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={18} />
                            <span className="text-sm hidden sm:inline">Continue Shopping</span>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-serif text-white">Checkout</h1>
                        <div className="w-8 sm:w-24" />
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="border-b border-white/5">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex items-center justify-center gap-4">
                        {[
                            { num: 1, label: 'Shipping' },
                            { num: 2, label: 'Payment' },
                        ].map((s, index) => (
                            <React.Fragment key={s.num}>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${step >= s.num
                                        ? 'bg-luxury-gold text-luxury-black'
                                        : 'bg-white/10 text-gray-500'
                                        }`}>
                                        {step > s.num ? <Check size={14} /> : s.num}
                                    </div>
                                    <span className={`text-xs sm:text-sm ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {index < 1 && (
                                    <div className={`w-12 sm:w-20 h-px ${step > 1 ? 'bg-luxury-gold' : 'bg-white/10'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Shipping */}
                            {step === 1 && (
                                <motion.div
                                    key="shipping"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                        <MapPin className="text-luxury-gold" size={22} />
                                        <h2 className="text-xl sm:text-2xl font-serif text-white">Shipping Information</h2>
                                    </div>

                                    <form onSubmit={handleShippingSubmit} className="space-y-5 sm:space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">First Name *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={shippingData.firstName}
                                                    onChange={handleShippingChange}
                                                    required
                                                    className="input-luxury"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Last Name *</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={shippingData.lastName}
                                                    onChange={handleShippingChange}
                                                    required
                                                    className="input-luxury"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={shippingData.email}
                                                    onChange={handleShippingChange}
                                                    required
                                                    className="input-luxury"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={shippingData.phone}
                                                    onChange={handleShippingChange}
                                                    required
                                                    className="input-luxury"
                                                    placeholder="+1 (234) 567-890"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Street Address *</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={shippingData.address}
                                                onChange={handleShippingChange}
                                                required
                                                className="input-luxury"
                                                placeholder="123 Main Street"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Apartment, Suite, etc. (optional)</label>
                                            <input
                                                type="text"
                                                name="apartment"
                                                value={shippingData.apartment}
                                                onChange={handleShippingChange}
                                                className="input-luxury"
                                                placeholder="Apt 4B"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-sm text-gray-400 mb-2">City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={shippingData.city}
                                                    onChange={handleShippingChange}
                                                    required
                                                    className="input-luxury"
                                                    placeholder="New York"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">State *</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={shippingData.state}
                                                    onChange={handleShippingChange}
                                                    required
                                                    className="input-luxury"
                                                    placeholder="NY"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">ZIP Code *</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={shippingData.zipCode}
                                                    onChange={handleShippingChange}
                                                    required
                                                    className="input-luxury"
                                                    placeholder="10001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Country</label>
                                                <select
                                                    name="country"
                                                    value={shippingData.country}
                                                    onChange={handleShippingChange}
                                                    className="input-luxury bg-luxury-black"
                                                    style={{ colorScheme: 'dark' }}
                                                >
                                                    <option value="United States" className="bg-luxury-black">United States</option>
                                                    <option value="Canada" className="bg-luxury-black">Canada</option>
                                                    <option value="United Kingdom" className="bg-luxury-black">United Kingdom</option>
                                                    <option value="Germany" className="bg-luxury-black">Germany</option>
                                                    <option value="France" className="bg-luxury-black">France</option>
                                                    <option value="Other" className="bg-luxury-black">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-primary w-full mt-6 sm:mt-8">
                                            Continue to Payment
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                        <CreditCard className="text-luxury-gold" size={22} />
                                        <h2 className="text-xl sm:text-2xl font-serif text-white">Payment Method</h2>
                                    </div>

                                    {/* Shipping Summary */}
                                    <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <Truck className="text-luxury-gold" size={18} />
                                                <span className="text-white font-medium text-sm sm:text-base">Shipping to</span>
                                            </div>
                                            <button
                                                onClick={() => setStep(1)}
                                                className="text-luxury-gold text-sm hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            {shippingData.firstName} {shippingData.lastName}<br />
                                            {shippingData.address}{shippingData.apartment && `, ${shippingData.apartment}`}<br />
                                            {shippingData.city}, {shippingData.state} {shippingData.zipCode}<br />
                                            {shippingData.country}
                                        </p>
                                    </div>

                                    {/* Payment Options */}
                                    <div className="space-y-4 mb-6 sm:mb-8">
                                        {/* Cash on Delivery */}
                                        <label
                                            className={`block p-4 sm:p-6 border transition-all ${paymentMethod === 'cod'
                                                ? 'border-luxury-gold bg-luxury-gold/5'
                                                : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-luxury-gold' : 'border-gray-500'
                                                    }`}>
                                                    {paymentMethod === 'cod' && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-luxury-gold" />
                                                    )}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cod"
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="hidden"
                                                />
                                                <Banknote className="text-luxury-gold" size={22} />
                                                <div className="flex-1">
                                                    <span className="text-white font-medium text-sm sm:text-base">Cash on Delivery</span>
                                                    <p className="text-gray-500 text-xs sm:text-sm">Pay when you receive your order</p>
                                                </div>
                                            </div>
                                        </label>

                                        {/* Credit Card - Coming Soon */}
                                        <label className="block p-4 sm:p-6 border border-white/10 opacity-50 cursor-not-allowed">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                                                <CreditCard className="text-gray-500" size={22} />
                                                <div className="flex-1">
                                                    <span className="text-gray-400 font-medium text-sm sm:text-base">Credit / Debit Card</span>
                                                    <p className="text-gray-600 text-xs sm:text-sm">Coming soon</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-b border-white/5 mb-6 sm:mb-8">
                                        {[
                                            { icon: Shield, label: 'Secure' },
                                            { icon: Truck, label: 'Insured' },
                                            { icon: Clock, label: '24/7 Support' },
                                        ].map((badge, index) => (
                                            <div key={index} className="text-center">
                                                <badge.icon className="text-luxury-gold mx-auto mb-1 sm:mb-2" size={18} />
                                                <span className="text-gray-500 text-[10px] sm:text-xs">{badge.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="btn-outline flex-1 order-2 sm:order-1"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing}
                                            className="btn-primary flex-1 flex items-center justify-center gap-2 order-1 sm:order-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Place Order'
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="glass-card p-4 sm:p-6 lg:sticky lg:top-24">
                            <h3 className="text-lg sm:text-xl font-serif text-white mb-4 sm:mb-6 flex items-center gap-3">
                                <ShoppingBag className="text-luxury-gold" size={18} />
                                Order Summary
                            </h3>

                            {/* Cart Items */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3 sm:gap-4">
                                        <div className="w-14 h-18 sm:w-16 sm:h-20 bg-luxury-charcoal overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.images ? item.images[0] : item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] sm:text-xs text-luxury-gold uppercase tracking-wider">
                                                {item.brand}
                                            </p>
                                            <h4 className="text-white text-xs sm:text-sm truncate">{item.name}</h4>
                                            <p className="text-gray-500 text-[10px] sm:text-xs">Qty: {item.quantity}</p>
                                            <p className="text-white text-xs sm:text-sm mt-1">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 sm:pt-6 space-y-2 sm:space-y-3">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">${cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-luxury-gold">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-gray-400">Tax</span>
                                    <span className="text-white">At delivery</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between pt-2">
                                    <span className="text-white font-medium text-sm sm:text-base">Total</span>
                                    <span className="text-luxury-gold text-xl sm:text-2xl font-serif font-bold">
                                        ${cartTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {paymentMethod === 'cod' && (
                                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-luxury-gold/10 border border-luxury-gold/30">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <Banknote className="text-luxury-gold flex-shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-white text-xs sm:text-sm font-medium">Cash on Delivery</p>
                                            <p className="text-gray-400 text-[10px] sm:text-xs mt-1">
                                                Pay ${cartTotal.toLocaleString()} on arrival
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
