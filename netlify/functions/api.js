// Simple API function for Netlify Functions
const fs = require('fs');
const path = require('path');

// Data file path
const dataFilePath = path.join(process.cwd(), 'netlify', 'functions', 'data.json');

// Load data from file or use defaults
function loadData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      return {
        users: data.users || [],
        products: data.products || [],
        orders: data.orders || []
      };
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  // Default data if file doesn't exist
  return {
    users: [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@store.com',
        password: 'admin123',
        isAdmin: true
      }
    ],
    products: [
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
    ],
    orders: []
  };
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Load data
  let { users, products, orders } = loadData();

  try {
    const { path, httpMethod, body } = event;
    const parsedBody = body ? JSON.parse(body) : {};
    
    // Debug logging
    console.log('API Request:', { path, httpMethod, body: parsedBody });

    // Extract the actual path from the full path
    let actualPath = path.replace('/.netlify/functions/api', '');
    
    // If the path is empty or just '/', it means we're accessing the API directly
    if (!actualPath || actualPath === '/') {
      actualPath = '/';
    }
    
    console.log('Actual path:', actualPath);

    // Health check - when accessing API directly
    if (actualPath === '/' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'API is working!',
                  availableEndpoints: [
          'POST /api/auth/login',
          'POST /api/auth/register', 
          'GET /api/products',
          'POST /api/products',
          'PUT /api/products/{id}',
          'DELETE /api/products/{id}',
          'GET /api/orders',
          'GET /api/orders/my?userId={userId}',
          'POST /api/orders',
          'PUT /api/orders/{id}',
          'DELETE /api/orders/{id}'
        ],
          adminCredentials: {
            email: 'admin@store.com',
            password: 'admin123'
          }
        })
      };
    }

    // Auth routes
    if (actualPath === '/api/auth/login' && httpMethod === 'POST') {
      const { email, password } = parsedBody;
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            token: 'fake-jwt-token',
            user: { 
              id: user.id, 
              name: user.name, 
              email: user.email, 
              isAdmin: user.isAdmin 
            }
          })
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' })
        };
      }
    }

    if (actualPath === '/api/auth/register' && httpMethod === 'POST') {
      const { name, email, password, phone } = parsedBody;
      
      if (users.find(u => u.email === email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User already exists' })
        };
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
      saveData({ users, products, orders }); // Save after user registration
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'User registered successfully' })
      };
    }

    // Products routes
    if (actualPath === '/api/products' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products)
      };
    }

    // Create product
    if (actualPath === '/api/products' && httpMethod === 'POST') {
      console.log('Create product request:', { actualPath, body: parsedBody });
      const { name, description, price, image, stock, discount } = parsedBody;
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
      saveData({ users, products, orders }); // Save after product creation
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newProduct)
      };
    }

    // Update product
    if (actualPath.startsWith('/api/products/') && httpMethod === 'PUT') {
      console.log('Update product request:', { actualPath, productId: actualPath.split('/').pop() });
      const productId = parseInt(actualPath.split('/').pop());
      const { name, description, price, image, stock, discount } = parsedBody;
      
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Product not found' })
        };
      }
      
      products[productIndex] = {
        ...products[productIndex],
        name,
        description,
        price: parseFloat(price),
        image,
        stock: parseInt(stock),
        discount: discount ? parseFloat(discount) : 0
      };
      
      saveData({ users, products, orders }); // Save after product update
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products[productIndex])
      };
    }

    // Delete product
    if (actualPath.startsWith('/api/products/') && httpMethod === 'DELETE') {
      console.log('Delete product request:', { actualPath, productId: actualPath.split('/').pop() });
      const productId = parseInt(actualPath.split('/').pop());
      
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Product not found' })
        };
      }
      
      products.splice(productIndex, 1);
      saveData({ users, products, orders }); // Save after product deletion
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Product deleted successfully' })
      };
    }

    // Orders routes
    if (actualPath === '/api/orders' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(orders)
      };
    }

    // Get user's orders
    if (actualPath.startsWith('/api/orders/my') && httpMethod === 'GET') {
      const urlParams = new URLSearchParams(event.queryStringParameters || {});
      const userId = urlParams.get('userId');
      
      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User ID is required' })
        };
      }
      
      const userOrders = orders.filter(order => order.userId === parseInt(userId));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(userOrders)
      };
    }

    if (actualPath === '/api/orders' && httpMethod === 'POST') {
      const { products: orderProducts, total, user: userId } = parsedBody;
      const newOrder = {
        id: orders.length + 1,
        userId: parseInt(userId),
        products: orderProducts,
        total: parseFloat(total),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      orders.push(newOrder);
      saveData({ users, products, orders }); // Save after order creation
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newOrder)
      };
    }

    // Update order
    if (actualPath.startsWith('/api/orders/') && httpMethod === 'PUT') {
      const orderId = parseInt(actualPath.split('/').pop());
      const { status } = parsedBody;
      
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Order not found' })
        };
      }
      
      orders[orderIndex] = {
        ...orders[orderIndex],
        status
      };
      
      saveData({ users, products, orders }); // Save after order update
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(orders[orderIndex])
      };
    }

    // Delete order
    if (actualPath.startsWith('/api/orders/') && httpMethod === 'DELETE') {
      const orderId = parseInt(actualPath.split('/').pop());
      
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Order not found' })
        };
      }
      
      orders.splice(orderIndex, 1);
      saveData({ users, products, orders }); // Save after order deletion
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Order deleted successfully' })
      };
    }

    // Default response
    console.log('Route not found:', { actualPath, httpMethod, parsedBody });
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        message: 'Route not found', 
        path: actualPath,
        method: httpMethod,
        availableEndpoints: [
          'POST /api/auth/login',
          'POST /api/auth/register', 
          'GET /api/products',
          'POST /api/products',
          'PUT /api/products/{id}',
          'DELETE /api/products/{id}',
          'GET /api/orders',
          'GET /api/orders/my?userId={userId}',
          'POST /api/orders',
          'PUT /api/orders/{id}',
          'DELETE /api/orders/{id}'
        ]
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: error.message })
    };
  }
}; 