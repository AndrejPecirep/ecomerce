import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ search, setSearch, cartCount, isOwner, isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/search?query=${encodeURIComponent(query)}` : '/');
  };

  return (
    <header className="nav-shell">
      <div className="container nav">
        <div className="brand-wrap">
          <button className="brand" onClick={() => navigate('/')}>NovaStore</button>
          <span className="brand-badge">Modern commerce</span>
        </div>

        <form className="nav-search" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        <nav className="nav-links">
          <Link className={location.pathname === '/' ? 'active-link' : ''} to="/">Shop</Link>
          <Link className={location.pathname === '/cart' ? 'active-link' : ''} to="/cart">Cart ({cartCount})</Link>
          {isLoggedIn && <Link className={location.pathname === '/orders' ? 'active-link' : ''} to="/orders">Orders</Link>}
          {isOwner && <Link className={location.pathname === '/add-product' ? 'active-link' : ''} to="/add-product">Add product</Link>}
          {!isLoggedIn ? (
            <>
              <Link className={location.pathname === '/login' ? 'active-link' : ''} to="/login">Login</Link>
              <Link className="btn btn-dark" to="/register">Create account</Link>
            </>
          ) : (
            <button className="btn btn-outline" onClick={onLogout}>Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}
