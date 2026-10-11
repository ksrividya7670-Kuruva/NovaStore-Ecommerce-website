import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/constants';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleCopyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto" />
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/" className="inline-block px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">
          Return to Store
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Order Placed', statusKey: 'PENDING', icon: CheckCircle2 },
    { title: 'Processing', statusKey: 'PROCESSING', icon: Clock },
    { title: 'Shipped', statusKey: 'SHIPPED', icon: Truck },
    { title: 'Delivered', statusKey: 'DELIVERED', icon: Package }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(order.status);
  let shippingData = {};
  try {
    shippingData = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
  } catch {
    shippingData = { address: order.shippingAddress };
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 text-center shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Thank You for Your Order!
          </h1>
          <p className="text-xs text-slate-600">
            We've received your order #{order.id} and are getting it ready for shipment.
          </p>
        </div>

        {/* Tracking Pill */}
        <div className="inline-flex items-center gap-3 bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-semibold text-slate-700">
          <span>Tracking Number:</span>
          <span className="font-mono font-bold text-teal-700">{order.trackingNumber}</span>
          <button
            onClick={handleCopyTracking}
            className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-slate-800 transition-colors"
            title="Copy Tracking Number"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visual Order Tracking Progress Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">Order Progress & Tracking</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            order.status === 'DELIVERED'
              ? 'bg-emerald-100 text-emerald-800'
              : order.status === 'CANCELLED'
              ? 'bg-red-100 text-red-800'
              : 'bg-teal-100 text-teal-800'
          }`}>
            Current Status: {order.status}
          </span>
        </div>

        {order.status === 'CANCELLED' ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-bold">
            This order has been cancelled and any inventory held has been restored.
          </div>
        ) : (
          <div className="relative flex items-center justify-between pt-4">
            {/* Horizontal connecting line */}
            <div className="absolute top-8 left-6 right-6 h-1 bg-slate-200 -z-0" />
            <div
              className="absolute top-8 left-6 h-1 bg-teal-600 -z-0 transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 90}%`
              }}
            />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.title} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-4 ring-teal-100'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-bold text-center ${
                      isCurrent
                        ? 'text-teal-700 font-extrabold'
                        : isPassed
                        ? 'text-slate-800'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" /> Shipping Destination
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 text-sm">{shippingData.fullName || order.user?.name}</p>
            <p>{shippingData.address}</p>
            <p>{shippingData.city}, {shippingData.postalCode}</p>
            <p>{shippingData.country}</p>
            <p className="pt-1 text-slate-600">Phone: {shippingData.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-4 h-4" /> Payment Details
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Method: {order.paymentMethod}</p>
            <p>Payment Status: <span className="text-emerald-600 font-bold">{order.paymentStatus}</span></p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <div className="pt-2 border-t border-slate-100 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Total Paid:</span>
              <span className="text-teal-700 font-black">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">Items in this Package</h3>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.title}
                  onError={handleImageError}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.product?.title}</h4>
                  <p className="text-[11px] text-slate-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-slate-900">
                ${(item.quantity * item.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-2">
        <Link
          to="/my-orders"
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
        >
          View All My Orders
        </Link>
        <Link
          to="/"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
