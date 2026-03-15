import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AddProduct from './pages/AddProduct';
import OrderSuccess from './pages/OrderSuccess';
import { decodeTokenPayload } from './utils/auth';

function AppInner() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (token && !user) {
      const payload = decodeTokenPayload(token);
      if (payload) {
        setUser({ id: payload.id, email: payload.email, name: payload.name, role: payload.role });
      }
    }
  }, [token, user]);

  const searchTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('query') || '';
  }, [location.search]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const handleLogin = (newToken, nextUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(newToken);
    setUser(nextUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  return (
    <>
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        isOwner={user?.role === 'owner'}
        isLoggedIn={Boolean(token)}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} externalSearch={searchTerm} />} />
        <Route path="/search" element={<Home addToCart={addToCart} externalSearch={searchTerm} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} token={token} clearCart={clearCart} />} />
        <Route path="/orders" element={<OrdersPage token={token} />} />
        <Route path="/add-product" element={<AddProduct token={token} isOwner={user?.role === 'owner'} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
