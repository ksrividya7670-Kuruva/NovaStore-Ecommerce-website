import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    loginDemoAdmin,
    loginDemoCustomer
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginDemoAdmin();
    } catch (err) {
      setError(err.message || 'Demo admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setError('');
    setLoading(true);
    try {
      await loginDemoCustomer();
    } catch (err) {
      setError(err.message || 'Demo customer login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-600 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="p-6 pb-0">
          <div className="text-center mb-6">
            <h3 className="text-xl font-extrabold text-slate-900">
              {authModalTab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {authModalTab === 'login'
                ? 'Sign in to access your orders and account settings'
                : 'Join NovaStore to enjoy seamless checkout & order tracking'}
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-3 mb-5">
            <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Instant Evaluator Demo Logins</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCustomer}
                disabled={loading}
                className="py-1.5 px-2 bg-white hover:bg-teal-600 hover:text-white text-teal-800 text-xs font-semibold rounded-lg border border-teal-200 shadow-sm transition-all"
              >
                👤 Customer Demo
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                disabled={loading}
                className="py-1.5 px-2 bg-white hover:bg-amber-600 hover:text-white text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 shadow-sm transition-all"
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setError('');
              }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                authModalTab === 'login'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-600'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setAuthModalTab('register');
                setError('');
              }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                authModalTab === 'register'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-600'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                />
                <User className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>
          </div>

          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    role === 'USER'
                      ? 'border-teal-600 bg-teal-50 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    role === 'ADMIN'
                      ? 'border-amber-600 bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Administrator
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Please wait...' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
