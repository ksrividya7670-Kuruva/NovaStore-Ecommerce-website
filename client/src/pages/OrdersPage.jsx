import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/constants';

export default function OrdersPage() {
  const { token, isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch('/api/orders/my-orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please Sign In to View Orders</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Orders Found</h2>
        <p className="text-xs text-slate-600">You haven't placed any orders with NovaStore yet.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'PROCESSING':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Orders & Tracking</h1>
        <p className="text-xs text-slate-600 mt-1">
          Review your purchase history and monitor real-time shipment status
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 hover:border-teal-500/30 transition-all"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-slate-900 text-sm">Order #{order.id}</span>
                <span className="text-slate-600">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {order.trackingNumber}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 flex-shrink-0">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.title}
                      onError={handleImageError}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-100"
                    />
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-800 line-clamp-1 max-w-[140px]">
                        {item.product?.title}
                      </p>
                      <p className="text-slate-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Link */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold tracking-wider">
                    Total
                  </span>
                  <span className="text-base font-black text-slate-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <Link
                  to={`/order-success/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 rounded-xl text-xs font-bold transition-all"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Live Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
