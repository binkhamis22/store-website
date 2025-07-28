const express = require('express');
const cors = require('cors');
const { dbHelpers } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbHelpers.findUserByEmail(email);
    
    if (user && user.password === password) {
      res.json({
        token: 'fake-jwt-token',
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone,
          isAdmin: user.isAdmin 
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await dbHelpers.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = await dbHelpers.createUser({ name, email, password, phone });
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Debug route
app.get('/api/auth/debug', async (req, res) => {
  try {
    const users = await dbHelpers.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await dbHelpers.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ message: 'Failed to load products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image, stock, discount } = req.body;
    const productData = {
      name,
      description,
      price: parseFloat(price),
      image,
      stock: parseInt(stock),
      discount: discount ? parseFloat(discount) : 0
    };
    
    const newProduct = await dbHelpers.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, image, stock, discount } = req.body;
    
    const productData = {
      name,
      description,
      price: parseFloat(price),
      image,
      stock: parseInt(stock),
      discount: discount ? parseFloat(discount) : 0
    };
    
    const updatedProduct = await dbHelpers.updateProduct(id, productData);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await dbHelpers.deleteProduct(id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Orders routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await dbHelpers.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('Error getting orders:', err);
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

app.get('/api/orders/my', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['user-id'];
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }
    
    const orders = await dbHelpers.getOrdersByUser(parseInt(userId));
    res.json(orders);
  } catch (err) {
    console.error('Error getting user orders:', err);
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const orders = await dbHelpers.getAllOrders();
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Error getting order:', err);
    res.status(500).json({ message: 'Failed to load order' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { products, total, user: userId } = req.body;
    
    const orderData = {
      userId: parseInt(userId),
      products,
      total: parseFloat(total),
      status: 'pending'
    };
    
    const newOrder = await dbHelpers.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const updatedOrder = await dbHelpers.updateOrder(id, updateData);
    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await dbHelpers.deleteOrder(id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

// Debug routes
app.get('/api/orders-debug', async (req, res) => {
  try {
    const orders = await dbHelpers.getAllOrders();
    res.json({
      totalOrders: orders.length,
      orders: orders.map(o => ({ 
        id: o.id, 
        status: o.status, 
        total: o.total,
        createdAt: o.createdAt 
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users-debug', async (req, res) => {
  try {
    const users = await dbHelpers.getAllUsers();
    res.json({
      totalUsers: users.length,
      users: users.map(u => ({ 
        id: u.id, 
        name: u.name, 
        email: u.email,
        isAdmin: u.isAdmin
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Database Server is running! 🗄️');
});

app.listen(PORT, () => {
  console.log(`✅ Database server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log('🗄️ Using SQLite database for persistent storage');
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
}); 