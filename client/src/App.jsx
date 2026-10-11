import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
                <Navbar />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:id" element={<OrderConfirmationPage />} />
                    <Route path="/my-orders" element={<OrdersPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                  </Routes>
                </main>
                <Footer />
                <AuthModal />
                <CartDrawer />
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
