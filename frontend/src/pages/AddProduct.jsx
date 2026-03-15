import React, { useState } from 'react';
import { createProduct } from '../api/axiosConfig';

const initialState = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  stock: 0,
};

export default function AddProduct({ token, isOwner }) {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await createProduct(form, token);
      setMessage('Product added successfully.');
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Could not create product');
    }
  };

  if (!isOwner) {
    return <div className="container empty-state">Only the owner account can add products.</div>;
  }

  return (
    <div className="auth-shell wide-shell">
      <form className="form-card wide-card" onSubmit={handleSubmit}>
        <h1>Add new product</h1>
        <p>Publish a new product with image, stock and category.</p>
        <input className="text-input" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea className="text-input text-area" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <div className="input-grid">
          <input className="text-input" type="number" step="0.01" min="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="text-input" type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        </div>
        <input className="text-input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input className="text-input" type="url" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert error-alert">{error}</div>}
        <button className="btn btn-primary" type="submit">Publish product</button>
      </form>
    </div>
  );
}
