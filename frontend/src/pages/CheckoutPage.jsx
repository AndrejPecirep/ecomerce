import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/axiosConfig';

export default function CheckoutPage({ cart, token, clearCart }) {
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in before placing an order.');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createOrder({
        products: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        address,
        note,
      }, token);
      clearCart();
      nav('/order-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container two-col-layout">
      <form className="panel checkout-form" onSubmit={handleSubmit}>
        <h1>Checkout</h1>
        <p>Orders are placed online and fulfilled manually. No card data is processed in the app.</p>
        <label>Delivery address</label>
        <textarea className="text-input text-area" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, postal code" required />
        <label>Order note</label>
        <textarea className="text-input text-area" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note for delivery or pickup" />
        {error && <div className="alert error-alert">{error}</div>}
        <button className="btn btn-primary" disabled={loading} type="submit">{loading ? 'Placing order…' : 'Place order'}</button>
      </form>
      <aside className="summary-card">
        <h2>Order summary</h2>
        {cart.map((item) => (
          <div className="summary-row" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <strong>€{(Number(item.price) * item.quantity).toFixed(2)}</strong>
          </div>
        ))}
        <div className="summary-row total-row"><span>Total</span><strong>€{total.toFixed(2)}</strong></div>
      </aside>
    </div>
  );
}
