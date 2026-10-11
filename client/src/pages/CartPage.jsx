import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/constants';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, shipping, tax, total } =
    useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    navigate('/checkout');
  };

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-600">
            Looks like you haven't added anything to your cart yet. Explore our latest items!
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-600 mt-1">
            Review your items and proceed to secure checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Alert Bar */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-teal-900">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-teal-600" />
                {remainingForFreeShipping === 0
                  ? '🎉 Congratulations! You unlocked Free Express Shipping!'
                  : `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping!`}
              </span>
              <span>{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-teal-200/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={handleImageError}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      {item.category}
                    </span>
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-bold text-slate-800 text-sm hover:text-teal-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-600 mt-0.5">
                      ${item.price.toFixed(2)} each
                    </p>
                    <span className="inline-block mt-1 text-[11px] text-slate-600">
                      Max available: {item.stock}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total line item price */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-slate-900 block">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-600 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg">Order Summary</h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-800">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-bold text-slate-800">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl text-teal-700">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/20 text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600 pt-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
