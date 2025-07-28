import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/.netlify/functions/api';

const API = {
  // Auth
  login: (credentials) => fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(res => res.json()),

  register: (userData) => fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(res => res.json()),

  // Products
  getProducts: () => fetch(`${API_BASE_URL}/api/products`).then(res => res.json()),
  
  createProduct: (productData) => fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  }).then(res => res.json()),

  updateProduct: (id, productData) => fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  }).then(res => res.json()),

  deleteProduct: (id) => fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Orders
  getOrders: () => fetch(`${API_BASE_URL}/api/orders`).then(res => res.json()),
  
  getMyOrders: (userId) => fetch(`${API_BASE_URL}/api/orders/my?userId=${userId}`).then(res => res.json()),
  
  createOrder: (orderData) => fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  }).then(res => res.json()),

  updateOrder: (id, updateData) => fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  }).then(res => res.json()),

  deleteOrder: (id) => fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Debug
  debugUsers: () => fetch(`${API_BASE_URL}/api/auth/debug`).then(res => res.json()),
  debugOrders: () => fetch(`${API_BASE_URL}/api/orders-debug`).then(res => res.json())
};

export default API; 