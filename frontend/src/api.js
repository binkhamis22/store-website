// API configuration

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
  
  createProduct: (productData) => {
    console.log('Creating product:', productData);
    return fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    }).then(res => {
      console.log('Create product response status:', res.status);
      return res.json();
    }).catch(err => {
      console.error('Create product error:', err);
      throw err;
    });
  },

  updateProduct: (id, productData) => {
    console.log('Updating product:', id, productData);
    return fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    }).then(res => {
      console.log('Update product response status:', res.status);
      return res.json();
    }).catch(err => {
      console.error('Update product error:', err);
      throw err;
    });
  },

  deleteProduct: (id) => {
    console.log('Deleting product:', id);
    return fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE'
    }).then(res => {
      console.log('Delete product response status:', res.status);
      return res.json();
    }).catch(err => {
      console.error('Delete product error:', err);
      throw err;
    });
  },

  // Orders
  getOrders: () => fetch(`${API_BASE_URL}/api/orders`).then(res => res.json()),
  
  getMyOrders: (userId) => fetch(`${API_BASE_URL}/api/orders/my?userId=${userId}`).then(res => res.json()),
  
  createOrder: (orderData) => fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  }).then(res => res.json()),

  updateOrder: (id, updateData) => {
    console.log('Updating order:', id, updateData);
    return fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    }).then(res => {
      console.log('Update order response status:', res.status);
      return res.json();
    }).catch(err => {
      console.error('Update order error:', err);
      throw err;
    });
  },

  deleteOrder: (id) => {
    console.log('Deleting order:', id);
    return fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'DELETE'
    }).then(res => {
      console.log('Delete order response status:', res.status);
      return res.json();
    }).catch(err => {
      console.error('Delete order error:', err);
      throw err;
    });
  },

  // Debug
  debugUsers: () => fetch(`${API_BASE_URL}/api/auth/debug`).then(res => res.json()),
  debugOrders: () => fetch(`${API_BASE_URL}/api/orders-debug`).then(res => res.json())
};

export default API; 