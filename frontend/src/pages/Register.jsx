import React, { useState } from 'react';
import { registerUser } from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(form);
      nav('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-shell">
      <form className="form-card" onSubmit={submit}>
        <h1>Create account</h1>
        <p>Join the store to place orders and track your purchases.</p>
        <input className="text-input" type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="text-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="text-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <div className="alert error-alert">{error}</div>}
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
    </div>
  );
}
