import React from 'react';

export default function Cart({ cart, updateQuantity, removeItem }) {
  if (cart.length === 0) {
    return <div className="empty-state">Your cart is empty.</div>;
  }

  return (
    <div className="cart-list">
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} className="cart-thumb" />
          <div className="cart-copy">
            <strong>{item.name}</strong>
            <span>€{Number(item.price).toFixed(2)}</span>
          </div>
          <div className="qty-box">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <button className="remove-link" onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
