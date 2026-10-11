import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  Wallet,
  DollarSign
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/constants';

export default function CheckoutPage() {
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '104 Silicon Valley Blvd, Suite 400',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
    phone: '+1 (555) 321-9876'
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvc: '123'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please Sign In to Checkout</h2>
        <p className="text-xs text-slate-600">
          You need an account to place an order and track its shipment.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-600">Add products to your cart before proceeding to checkout.</p>
        <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Go to Shop
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const itemsPayload = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: itemsPayload,
          shippingAddress: formData,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      navigate(`/order-success/${data.order.id}`);
    } catch (err) {
      setError(err.message || 'Error processing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Secure Checkout</h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Shipping Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Recipient Name</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Credit Card')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2 text-teal-600" />
                <div className="text-xs font-bold">Credit / Debit Card</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Visa, Mastercard, Amex</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI / Wallet')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'UPI / Wallet'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Wallet className="w-5 h-5 mb-2 text-teal-600" />
                <div className="text-xs font-bold">Digital Wallet / UPI</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Instant transfer</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <DollarSign className="w-5 h-5 mb-2 text-teal-600" />
                <div className="text-xs font-bold">Cash on Delivery</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Pay upon package arrival</div>
              </button>
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Simulated Card Details</span>
                  <span className="flex items-center gap-1 text-teal-600">
                    <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      readOnly
                      value={cardData.cardNumber}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      readOnly
                      value={cardData.expDate}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      readOnly
                      value={cardData.cvc}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Items Summary & Submit */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base">Review Your Items ({cartItems.length})</h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={handleImageError}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-800">
                  {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-bold text-slate-800">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Due</span>
                <span className="text-xl text-teal-700">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-xl shadow-teal-600/25 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              {loading ? 'Processing Order...' : `Pay $${total.toFixed(2)} & Place Order`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 text-center">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Money-back guarantee & encrypted checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
