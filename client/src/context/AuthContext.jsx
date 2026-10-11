import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecommerce_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ecommerce_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (err) {
        console.error('Failed to verify token', err);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('ecommerce_token', data.token);
    localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
    setIsAuthModalOpen(false);
    return data.user;
  };

  const register = async (name, email, password, role = 'USER') => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('ecommerce_token', data.token);
    localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
    setIsAuthModalOpen(false);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ecommerce_token');
    localStorage.removeItem('ecommerce_user');
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginDemoAdmin = async () => {
    return login('admin@ecommerce.com', 'Admin@123');
  };

  const loginDemoCustomer = async () => {
    return login('customer@ecommerce.com', 'Customer@123');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    setAuthModalTab,
    login,
    register,
    logout,
    loginDemoAdmin,
    loginDemoCustomer
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
