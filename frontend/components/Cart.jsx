import React from "react";
export default function Cart({ cart, setCart }) {

  const removeItem = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div>
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <div>{item.name}</div>
          <div>{item.quantity} × ${item.price}</div>
          <span className="remove" onClick={() => removeItem(item.id)}>Remove</span>
        </div>
      ))}

      <h2 className="total">Total: ${total}</h2>
    </div>
  );
}