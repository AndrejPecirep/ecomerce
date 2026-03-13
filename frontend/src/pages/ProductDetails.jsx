import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../api/axiosConfig";

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then(res => {
      setProduct(res.data.find(p => p.id == id));
    });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container">
      <img src={product.image} className="detail-img" />

      <div className="detail-box">
        <h1>{product.name}</h1>
        <p>${product.price}</p>
        <p>{product.description}</p>

        <button className="btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}