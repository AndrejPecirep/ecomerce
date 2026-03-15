import React, { useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchProducts } from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

export default function Home({ addToCart, externalSearch = '' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).then(([productsRes, categoriesRes]) => {
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    const q = externalSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, externalSearch]);

  return (
    <div className="page-shell">
      <section className="hero container">
        <div>
          <span className="eyebrow">Professional storefront</span>
          <h1>Sell products with a clean, modern shopping experience.</h1>
          <p>
            NovaStore is optimized for a fast storefront, owner product management and a simple order flow
            without handling card data in the app.
          </p>
        </div>
        <div className="hero-card">
          <div>
            <strong>{products.length}</strong>
            <span>Products available</span>
          </div>
          <div>
            <strong>{categories.length}</strong>
            <span>Curated categories</span>
          </div>
        </div>
      </section>

      <section className="container section-gap">
        <div className="toolbar">
          <div className="category-row">
            <button className={`chip ${selectedCategory === '' ? 'chip-active' : ''}`} onClick={() => setSelectedCategory('')}>All</button>
            {categories.map((category) => (
              <button
                key={category}
                className={`chip ${selectedCategory === category ? 'chip-active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {externalSearch && <div className="search-hint">Showing results for “{externalSearch}”</div>}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">No products match the current filters.</div>
        )}
      </section>
    </div>
  );
}
