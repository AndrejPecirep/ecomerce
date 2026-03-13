import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate(`/product/${product.id}`)}>
      <img src={product.image} alt={product.name} />
      <h2 className="card-title">{product.name}</h2>
      <p className="card-price">${product.price}</p>
    </div>
  );
}