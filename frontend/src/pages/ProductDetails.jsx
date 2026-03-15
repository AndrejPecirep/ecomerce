import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '../api/axiosConfig';

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then((res) => {
      setProduct(res.data.find((item) => String(item.id) === id) || null);
    });
  }, [id]);

  if (!product) {
    return <div className="container empty-state">Loading product…</div>;
  }

  return (
    <div className="container detail-layout">
      <img src={product.image} alt={product.name} className="detail-image" />
      <div className="detail-card">
        <span className="pill">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="detail-description">{product.description}</p>
        <div className="detail-meta">
          <strong>€{Number(product.price).toFixed(2)}</strong>
          <span>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</span>
        </div>
        <button className="btn btn-primary big-btn" disabled={product.stock < 1} onClick={() => addToCart(product)}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
