const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for demo (you can replace with a database)
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@store.com',
    password: 'admin123',
    isAdmin: true
  }
];

let products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    stock: 25,
    discount: 0
  },
  {
    id: 2,
    name: "Smartphone Case - Premium Leather",
    description: "Handcrafted genuine leather case for phones.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1603313011108-4c4b0b0b0b0b?w=400",
    stock: 50,
    discount: 15
  },
  {
    id: 3,
    name: "Laptop Stand - Adjustable",
    description: "Ergonomic aluminum laptop stand.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    stock: 15,
    discount: 0
  }
];

let orders = [];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      token: 'fake-jwt-token',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin 
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    phone,
    isAdmin: false
  };
  
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Products routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, description, price, image, stock, discount } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price: parseFloat(price),
    image,
    stock: parseInt(stock),
    discount: discount ? parseFloat(discount) : 0
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Orders routes
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { products: orderProducts, total, user: userId } = req.body;
  const newOrder = {
    id: orders.length + 1,
    userId: parseInt(userId),
    products: orderProducts,
    total: parseFloat(total),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Health check
app.get('/', (req, res) => {
  res.send('Netlify Functions API is running! 🚀');
});

module.exports.handler = serverless(app); 