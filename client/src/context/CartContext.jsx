import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecommerce_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (product, quantity = 1, showDrawer = true) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock)
          }
        ];
      }
    });

    showToast({
      title: 'Added to Cart 🛍️',
      message: `${quantity}× ${product.title.slice(0, 30)}...`,
      type: 'success',
      action: {
        label: 'View Cart',
        onClick: () => setIsCartDrawerOpen(true)
      }
    });

    if (showDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== productId));
    if (item) {
      showToast({
        title: 'Item Removed',
        message: `${item.title.slice(0, 30)}... removed from cart`,
        type: 'info'
      });
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const validQty = Math.min(quantity, item.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
