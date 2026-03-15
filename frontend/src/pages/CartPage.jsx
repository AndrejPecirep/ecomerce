import React from 'react';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart';

export default function CartPage({ cart, updateQuantity, removeItem }) {
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="container two-col-layout">
      <section className="panel">
        <h1>Your cart</h1>
        <Cart cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} />
      </section>
      <aside className="summary-card">
        <h2>Order summary</h2>
        <div className="summary-row"><span>Items</span><strong>{cart.length}</strong></div>
        <div className="summary-row"><span>Total</span><strong>€{total.toFixed(2)}</strong></div>
        <Link className={`btn btn-primary ${cart.length === 0 ? 'btn-disabled' : ''}`} to={cart.length ? '/checkout' : '#'}>
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}
