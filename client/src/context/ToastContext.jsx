import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, ShoppingBag } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'success', duration = 3500, action }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, title, message, type, action };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200/80 flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in"
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                {toast.message}
              </p>
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-xs font-bold text-teal-600 hover:text-teal-700 underline flex items-center gap-1"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-600 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
