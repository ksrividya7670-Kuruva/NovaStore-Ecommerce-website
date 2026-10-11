import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Service Highlights */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Fast Shipping</h4>
              <p className="text-xs text-slate-600">On all orders over $150</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
              <p className="text-xs text-slate-600">100% encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Returns</h4>
              <p className="text-xs text-slate-600">Hassle-free guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Support</h4>
              <p className="text-xs text-slate-600">Dedicated assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">NovaStore</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full-Stack E-Commerce platform built for seamless online shopping, instant order tracking, and dynamic admin inventory management.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Shop Categories</h5>
            <ul className="text-xs space-y-2 text-slate-600">
              <li>Electronics & Laptops</li>
              <li>Audio & Headphones</li>
              <li>Accessories & Keyboards</li>
              <li>Wearables & Smartwatches</li>
              <li>Gaming & Consoles</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Support</h5>
            <ul className="text-xs space-y-2 text-slate-600">
              <li>Order Tracking</li>
              <li>Shipping & Delivery</li>
              <li>Return Policy</li>
              <li>FAQs & Help Desk</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Project Specs</h5>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>⚡ React 18 + Vite</p>
              <p>🚀 Node.js + Express REST APIs</p>
              <p>🗄️ Prisma ORM with SQLite / SQL</p>
              <p>🔐 JWT & Role-Based Access (Admin/User)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 NovaStore E-Commerce Web Application. Built with modern full-stack web technologies.
        </div>
      </div>
    </footer>
  );
}
