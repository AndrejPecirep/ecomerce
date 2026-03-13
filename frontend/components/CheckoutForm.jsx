import React from "react";
import { useState } from "react";

export default function CheckoutForm({ onSubmit }) {
  const [address, setAddress] = useState("");

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(address); }}>
      <input
        className="input"
        type="text"
        placeholder="Delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />

      <button className="btn">Place Order</button>
    </form>
  );
}