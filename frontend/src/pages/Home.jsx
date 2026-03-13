import React from "react";
import { useEffect, useState } from "react";
import { fetchProducts, fetchCategories, searchProducts } from "../api/axiosConfig";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data));
    fetchCategories().then(res => setCategories(res.data));
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (!cat) fetchProducts().then(res => setProducts(res.data));
    else searchProducts("", cat).then(res => setProducts(res.data));
  };

  return (
    <div className="container">

      <div className="cat-bar">
        <button className="cat-btn" onClick={() => handleCategoryChange("")}>All</button>
        {categories.map(c => (
          <button
            key={c}
            className={`cat-btn ${selectedCategory === c ? "active" : ""}`}
            onClick={() => handleCategoryChange(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

    </div>
  );
}
