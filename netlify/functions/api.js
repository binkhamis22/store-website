// Simple API function for Netlify Functions
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

  // In-memory storage
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
          'GET /api/orders',
          'GET /api/orders/my?userId={userId}',
          'POST /api/orders'
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
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newOrder)
      };
    }

    // Default response
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
          'GET /api/orders',
          'POST /api/orders'
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