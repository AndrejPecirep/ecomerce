import React from "react";
import { useState } from "react";
import { loginUser } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    nav("/");
  };

  return (
    <form className="form" onSubmit={submit}>
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button className="btn">Login</button>
    </form>
  );
}