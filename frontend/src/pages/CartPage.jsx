import React from "react";
import Cart from "../components/Cart";

export default function CartPage({ cart, setCart }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Your Cart</h1>
      <Cart cart={cart} setCart={setCart} />
    </div>
  );
}
