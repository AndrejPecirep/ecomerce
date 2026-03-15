import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="auth-shell">
      <div className="form-card success-card">
        <h1>Order placed successfully</h1>
        <p>Your order has been saved in the system and will be processed by the store owner.</p>
        <Link className="btn btn-primary" to="/orders">View my orders</Link>
      </div>
    </div>
  );
}
