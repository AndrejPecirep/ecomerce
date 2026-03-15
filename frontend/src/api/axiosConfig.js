import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE,
});

export const fetchProducts = () => API.get('/products');
export const searchProducts = (query, category) =>
  API.get(`/products/search?query=${encodeURIComponent(query || '')}&category=${encodeURIComponent(category || '')}`);
export const fetchCategories = () => API.get('/products/categories');
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const createProduct = (data, token) =>
  API.post('/products', data, { headers: { Authorization: `Bearer ${token}` } });
export const createOrder = (data, token) =>
  API.post('/orders', data, { headers: { Authorization: `Bearer ${token}` } });
export const fetchOrders = (token) =>
  API.get('/orders', { headers: { Authorization: `Bearer ${token}` } });

export default API;
