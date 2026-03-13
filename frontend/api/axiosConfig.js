import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({ baseURL: BASE });

// products
export const fetchProducts = () => API.get("/products");
export const searchProducts = (query, category) =>
  API.get(`/products/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category || "")}`);
export const fetchCategories = () => API.get("/products/categories");

// auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// orders & payment
// createPaymentIntent now expects { cart: [{ id, quantity }], currency }
// backend will verify amount server-side using product prices from DB
export const createPaymentIntent = (data) =>
  API.post("/payment/create-payment-intent", data);

// createOrder requires Authorization header with Bearer token
export const createOrder = (data, token) =>
  API.post("/orders", data, { headers: { Authorization: `Bearer ${token}` } });

export default API;