import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import Toast from './components/Toast';

import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';

import { DEFAULT_CART_ITEMS } from './data/mockData';
import './App.css';

const CART_STORAGE_KEY = 'quickbite_cart';
const USER_STORAGE_KEY = 'quickbite_user';

// Scroll to top helper component when navigating
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * Main QuickBite React Application Component
 * Manages central cart state with localStorage persistence, user authentication, routes, and modal feedback.
 */
function App() {
  // 1. Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return DEFAULT_CART_ITEMS;
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
      return DEFAULT_CART_ITEMS;
    }
  });

  // 2. User State (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (e) {
      console.error('Error loading user from localStorage:', e);
      return null;
    }
  });

  // 3. Toast Feedback State
  const [toast, setToast] = useState({ message: '', type: 'success', key: 0 });

  // 4. Order Confirmation Modal State
  const [orderModal, setOrderModal] = useState({ isOpen: false, details: null });

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cart]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, key: Date.now() });
  };

  // Add Item to Cart
  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (ci) => ci.name.toLowerCase() === item.name.toLowerCase()
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        showToast(`Increased quantity of "${item.name}" in cart! 🛒`, 'success');
        return updated;
      } else {
        const newItem = {
          id: item.id || 'dish-' + Date.now(),
          name: item.name,
          restaurant: item.restaurant || 'QuickBite Kitchen',
          price: parseFloat(item.price) || 0,
          quantity: 1,
          isVeg: item.isVeg !== undefined ? item.isVeg : true,
          subtitle: item.subtitle || item.description || 'Freshly prepared authentic delicacy'
        };
        showToast(`"${item.name}" added to cart! 🍽️`, 'success');
        return [...prevCart, newItem];
      }
    });
  };

  // Update Item Quantity
  const handleUpdateQuantity = (itemId, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + change;
            if (newQty <= 0) {
              showToast(`Removed "${item.name}" from cart.`, 'info');
              return null;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Remove Item Completely
  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((i) => i.id === itemId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.name}" from cart.`, 'info');
      }
      return prevCart.filter((i) => i.id !== itemId);
    });
  };

  // Clear Entire Cart
  const handleClearCart = () => {
    setCart([]);
  };

  // User Login / Sign Up
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  };

  // User Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    showToast('Logged out successfully.', 'info');
  };

  // Order Placement Success
  const handleCheckoutSuccess = (details) => {
    setOrderModal({ isOpen: true, details });
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="quickbite-app">
      <ScrollToTop />

      {/* Global Navbar */}
      <Navbar
        cartCount={cartCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Page Routing */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/restaurants"
          element={<Restaurants />}
        />
        <Route
          path="/menu"
          element={
            <Menu
              onAddToCart={handleAddToCart}
              cart={cart}
              cartCount={cartCount}
              cartTotal={cartTotal}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onCheckoutSuccess={handleCheckoutSuccess}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLoginSuccess={handleLoginSuccess}
              showToast={showToast}
            />
          }
        />
      </Routes>

      {/* Global Footer */}
      <Footer />

      {/* Order Confirmation Modal */}
      <OrderModal
        isOpen={orderModal.isOpen}
        details={orderModal.details}
        onClose={() => setOrderModal({ isOpen: false, details: null })}
      />

      {/* Toast Feedback Notification */}
      <Toast
        key={toast.key}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success', key: 0 })}
      />
    </div>
  );
}

export default App;
