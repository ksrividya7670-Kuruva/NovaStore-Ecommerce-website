import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  Search,
  ShieldCheck,
  Package,
  LogOut,
  Menu,
  X,
  Heart,
  Sparkles,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ onSearch }) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-teal-200 text-[11px] py-1.5 px-4 font-semibold tracking-wide border-b border-teal-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            <span>⚡ Summer Sale 2026: Free express delivery on orders over $150</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-teal-400" /> Real-Time Package Tracking
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> 100% Genuine Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-all">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-800 to-emerald-600 bg-clip-text text-transparent">
                  NovaStore
                </span>
                <span className="text-[10px] block font-bold text-slate-600 uppercase tracking-widest -mt-1">
                  E-Commerce
                </span>
              </div>
            </Link>

            {/* Centered Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search products, categories, specs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-100/80 border border-slate-200/80 rounded-full focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-2.5 group-focus-within:text-teal-600 transition-colors" />
              </div>
            </form>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2.5">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Admin Panel
                </Link>
              )}

              {/* Wishlist Link */}
              <Link
                to="/?tab=wishlist"
                className="relative p-2.5 text-slate-700 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute 0 top-1 right-1 bg-red-500 text-white font-extrabold text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                className="relative p-2.5 text-slate-700 hover:text-teal-600 rounded-full hover:bg-slate-100 transition-colors"
                title="Quick Bag"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-teal-600 text-white font-black text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-md shadow-teal-600/30 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown / Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                    <span className="hidden sm:inline max-w-[110px] truncate">{user?.name}</span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-600">Signed in as</p>
                        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{user?.name}</p>
                        <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                          Role: {user?.role}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/my-orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Package className="w-4 h-4 text-slate-600" />
                        My Orders & Tracking
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all hover:scale-105"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 md:hidden text-slate-600 hover:text-slate-900"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 rounded-xl outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
                </div>
              </form>
              <div className="flex flex-col gap-1.5 pt-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold rounded-xl text-slate-700 hover:bg-slate-100"
                >
                  Shop Home
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-bold rounded-xl text-slate-700 hover:bg-slate-100"
                  >
                    My Orders & Tracking
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-bold rounded-xl text-amber-700 bg-amber-50"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
