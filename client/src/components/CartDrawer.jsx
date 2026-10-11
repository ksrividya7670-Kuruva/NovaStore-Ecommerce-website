import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/constants';

export default function CartDrawer() {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    cartCount
  } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Your Shopping Bag</h3>
                <p className="text-[11px] text-slate-600">{cartCount} items selected</p>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="bg-teal-50/70 border-b border-teal-100 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-900">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-teal-600" />
                {remainingForFreeShipping === 0
                  ? '🎉 Free express shipping unlocked!'
                  : `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`}
              </span>
              <span>{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-teal-200/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items scroll area */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Your bag is empty</h4>
                <p className="text-xs text-slate-600">Looks like you haven't added any products yet.</p>
                <button
                  onClick={closeCartDrawer}
                  className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-700 transition-colors"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={handleImageError}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">
                      {item.category}
                    </span>
                    <h5 className="font-bold text-slate-800 text-xs truncate">{item.title}</h5>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-600 hover:text-red-600 p-1 rounded-md transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Subtotal</span>
                <span className="text-base font-black text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-600">Taxes & shipping calculated at checkout.</p>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-lg shadow-teal-600/20 text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewCartClick}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-colors"
                >
                  View Full Cart Details
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
