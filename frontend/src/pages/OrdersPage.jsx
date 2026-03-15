import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api/axiosConfig';

export default function OrdersPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchOrders(token)
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load orders'));
  }, [token]);

  if (!token) {
    return <div className="container empty-state">Please log in to view your orders.</div>;
  }

  return (
    <div className="container section-gap">
      <div className="panel">
        <h1>Your orders</h1>
        {error && <div className="alert error-alert">{error}</div>}
        {orders.length === 0 ? (
          <div className="empty-state">You have no orders yet.</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-head">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <span>{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  <span className="status-pill">{order.status}</span>
                </div>
                <div className="order-items">
                  {(order.products || []).map((item) => (
                    <div key={`${order.id}-${item.id}`} className="summary-row">
                      <span>{item.name} × {item.quantity}</span>
                      <strong>€{(Number(item.price) * item.quantity).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <strong>€{Number(order.total).toFixed(2)}</strong>
                </div>
                <p className="muted-text"><strong>Delivery:</strong> {order.address}</p>
                {order.note && <p className="muted-text"><strong>Note:</strong> {order.note}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
