const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// In-memory data storage (for testing without MongoDB)
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@store.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    id: 2,
    name: 'rrr',
    email: 'rrr@test.com',
    password: 'password123',
    isAdmin: false
  }
];

let products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    stock: 25,
    discount: 0
  },
  {
    id: 2,
    name: "Smartphone Case - Premium Leather",
    description: "Handcrafted genuine leather case for iPhone and Samsung phones.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1603313011108-4c4b0b0b0b0b?w=400",
    stock: 50,
    discount: 15
  },
  {
    id: 3,
    name: "Laptop Stand - Adjustable",
    description: "Ergonomic aluminum laptop stand with adjustable height.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    stock: 15,
    discount: 0
  }
];

let orders = [];

// Routes
app.get('/', (req, res) => {
  res.send('API is running (Simple Mode)');
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      token: 'fake-jwt-token',
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Registration request:', { name, email });
  console.log('Current users before registration:', users.map(u => ({ id: u.id, name: u.name, email: u.email })));
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    isAdmin: false
  };
  
  users.push(newUser);
  console.log('New user created:', newUser);
  console.log('Users after registration:', users.map(u => ({ id: u.id, name: u.name, email: u.email })));
  
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

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ message: 'Product deleted' });
});

app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, image, stock, discount } = req.body;

  console.log('Updating product with ID:', id);
  console.log('Update data:', req.body);

  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    console.log('Product not found with ID:', id);
    return res.status(404).json({ message: 'Product not found' });
  }

  // Update the product
  products[productIndex] = {
    ...products[productIndex],
    name,
    description,
    price: parseFloat(price),
    image,
    stock: parseInt(stock),
    discount: discount ? parseFloat(discount) : 0
  };

  console.log('Product updated successfully:', products[productIndex]);
  res.json(products[productIndex]);
});

// Orders routes
app.get('/api/orders', (req, res) => {
  console.log('Getting all orders:', orders.map(o => ({ id: o.id, status: o.status })));
  res.json(orders);
});

app.get('/api/orders/my', (req, res) => {
  // Get user ID from query parameter or header
  const userId = req.query.userId || req.headers['user-id'];
  console.log('Getting orders for user:', userId);
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID required' });
  }
  
  const numericUserId = parseInt(userId);
  const userOrders = orders.filter(order => order.user && order.user.id === numericUserId);
  
  console.log('Found orders for user:', userOrders.length);
  res.json(userOrders);
});

app.get('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('Looking for order with ID:', id);
  console.log('Available orders:', orders.map(o => ({ id: o.id, status: o.status })));
  
  let order = orders.find(o => o.id === id);
  if (!order) {
    // Try as string
    order = orders.find(o => o.id.toString() === req.params.id);
  }
  
  if (!order) {
    return res.status(404).json({ message: `Order not found with id: ${id}` });
  }
  
  res.json(order);
});

// Test route to see all orders
app.get('/api/orders-debug', (req, res) => {
  res.json({
    totalOrders: orders.length,
    orders: orders.map(o => ({ 
      id: o.id, 
      status: o.status, 
      total: o.total,
      createdAt: o.createdAt 
    }))
  });
});

// Debug route to see users
app.get('/api/users-debug', (req, res) => {
  res.json({
    totalUsers: users.length,
    users: users.map(u => ({ 
      id: u.id, 
      name: u.name, 
      email: u.email,
      idType: typeof u.id
    }))
  });
});

app.post('/api/orders', (req, res) => {
  const { products: orderProducts, total, bankDetails, user: userId } = req.body;
  
  console.log('Order creation request:', { userId, userType: typeof userId });
  console.log('Available users:', users.map(u => ({ id: u.id, name: u.name, email: u.email })));
  
  // Get user information - convert userId to number for comparison
  const numericUserId = parseInt(userId) || 2;
  const user = users.find(u => u.id === numericUserId); // Default to customer "rrr"
  console.log('Found user for order:', user);
  
  const newOrder = {
    id: orders.length + 1,
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email
    } : null,
    products: orderProducts,
    total,
    bankDetails,
    status: 'pending',
    createdAt: new Date()
  };
  
  console.log('Creating new order:', newOrder);
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;
  
  console.log('Updating order:', { id, updateData, ordersCount: orders.length });
  
  // Try to find order by both number and string ID
  let order = orders.find(o => o.id === id);
  if (!order) {
    // Try as string
    order = orders.find(o => o.id.toString() === req.params.id);
  }
  
  if (!order) {
    console.log('Order not found:', id);
    return res.status(404).json({ message: `Order not found with id: ${id}` });
  }
  
  console.log('Found order:', order);
  
  // Update the order with new data
  Object.assign(order, updateData);
  
  console.log('Updated order:', order);
  res.json(order);
});

app.put('/api/orders/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  console.log('Updating order status:', { id, status, ordersCount: orders.length });
  console.log('All orders:', orders.map(o => ({ id: o.id, status: o.status })));
  
  // Try to find order by both number and string ID
  let order = orders.find(o => o.id === id);
  if (!order) {
    // Try as string
    order = orders.find(o => o.id.toString() === req.params.id);
  }
  
  if (!order) {
    console.log('Order not found:', id);
    return res.status(404).json({ message: `Order not found with id: ${id}` });
  }
  
  console.log('Found order:', order);
  order.status = status;
  console.log('Updated order status to:', status);
  
  res.json(order);
});

app.delete('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  console.log('Deleting order:', { id, ordersCount: orders.length });
  console.log('All orders before deletion:', orders.map(o => ({ id: o.id, status: o.status })));
  
  // Try to find order by both number and string ID
  let orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    // Try as string
    orderIndex = orders.findIndex(o => o.id.toString() === req.params.id);
  }
  
  if (orderIndex === -1) {
    console.log('Order not found for deletion:', id);
    console.log('Available order IDs:', orders.map(o => o.id));
    return res.status(404).json({ message: `Order not found with id: ${id}` });
  }
  
  const deletedOrder = orders[orderIndex];
  orders.splice(orderIndex, 1);
  
  console.log('Deleted order:', deletedOrder);
  console.log('Remaining orders:', orders.length);
  console.log('All orders after deletion:', orders.map(o => ({ id: o.id, status: o.status })));
  
  res.json({ message: 'Order deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}/api`);
  console.log(`🔑 Admin login: admin@store.com / admin123`);
}); 