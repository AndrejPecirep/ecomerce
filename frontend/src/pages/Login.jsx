import React, { useState } from 'react';
import { loginUser } from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(form);
      onLogin(res.data.token, res.data.user);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-shell">
      <form className="form-card" onSubmit={submit}>
        <h1>Welcome back</h1>
        <p>Sign in to manage orders, checkout faster and access the owner dashboard.</p>
        <input className="text-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="text-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <div className="alert error-alert">{error}</div>}
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}
