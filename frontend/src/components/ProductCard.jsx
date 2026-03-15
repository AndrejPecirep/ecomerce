import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <article className="product-card">
      <button className="product-card-link" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-copy">
          <span className="pill">{product.category}</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      </button>

      <div className="product-footer">
        <div>
          <div className="price">€{Number(product.price).toFixed(2)}</div>
          <div className="stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
        </div>
        <button className="btn btn-primary" disabled={product.stock < 1} onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
