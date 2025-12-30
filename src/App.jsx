import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WatchProvider } from './context/WatchContext';
import { OrderProvider } from './context/OrderContext';
import { CustomerProvider } from './context/CustomerContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';

// Storefront Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Brands from './pages/Brands';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import MyOrders from './pages/MyOrders';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WatchProvider>
            <OrderProvider>
              <CustomerProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Router>
                    <ScrollToTop />
                    <Routes>
                      {/* Admin Routes */}
                      <Route path="/admin/*" element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminLayout>
                            <Routes>
                              <Route index element={<AdminDashboard />} />
                              <Route path="products" element={<AdminProducts />} />
                              <Route path="orders" element={<AdminOrders />} />
                              <Route path="customers" element={<AdminCustomers />} />
                              <Route path="settings" element={<AdminSettings />} />
                            </Routes>
                          </AdminLayout>
                        </ProtectedRoute>
                      } />

                      {/* Storefront Routes */}
                      <Route path="*" element={
                        <Layout>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/brands" element={<Brands />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/account" element={
                              <ProtectedRoute>
                                <Account />
                              </ProtectedRoute>
                            } />
                            <Route path="/orders" element={
                              <ProtectedRoute>
                                <MyOrders />
                              </ProtectedRoute>
                            } />
                          </Routes>
                        </Layout>
                      } />
                    </Routes>
                  </Router>
                </WishlistProvider>
              </CartProvider>
            </CustomerProvider>
          </OrderProvider>
        </WatchProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
  );
}

export default App;
