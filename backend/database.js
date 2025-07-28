const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'store.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    isAdmin BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err.message);
    } else {
      console.log('✅ Users table ready');
      createDefaultAdmin();
    }
  });

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0,
    discount REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating products table:', err.message);
    } else {
      console.log('✅ Products table ready');
      createSampleProducts();
    }
  });

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    products TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    bankDetails TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating orders table:', err.message);
    } else {
      console.log('✅ Orders table ready');
    }
  });
}

// Create default admin user
function createDefaultAdmin() {
  const adminUser = {
    name: 'Admin User',
    email: 'admin@store.com',
    password: 'admin123',
    isAdmin: 1
  };

  db.get('SELECT * FROM users WHERE email = ?', [adminUser.email], (err, row) => {
    if (err) {
      console.error('❌ Error checking admin user:', err.message);
    } else if (!row) {
      db.run('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', 
        [adminUser.name, adminUser.email, adminUser.password, adminUser.isAdmin], 
        function(err) {
          if (err) {
            console.error('❌ Error creating admin user:', err.message);
          } else {
            console.log('✅ Default admin user created');
          }
        }
      );
    } else {
      console.log('✅ Admin user already exists');
    }
  });
}

// Create sample products
function createSampleProducts() {
  const sampleProducts = [
    {
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      stock: 25,
      discount: 0
    },
    {
      name: "Smartphone Case - Premium Leather",
      description: "Handcrafted genuine leather case for iPhone and Samsung phones.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1603313011108-4c4b0b0b0b0b?w=400",
      stock: 50,
      discount: 15
    },
    {
      name: "Laptop Stand - Adjustable",
      description: "Ergonomic aluminum laptop stand with adjustable height.",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
      stock: 15,
      discount: 0
    }
  ];

  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('❌ Error checking products:', err.message);
    } else if (row.count === 0) {
      console.log('📦 Creating sample products...');
      sampleProducts.forEach(product => {
        db.run('INSERT INTO products (name, description, price, image, stock, discount) VALUES (?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.image, product.stock, product.discount],
          function(err) {
            if (err) {
              console.error('❌ Error creating product:', err.message);
            }
          }
        );
      });
      console.log('✅ Sample products created');
    } else {
      console.log('✅ Products already exist');
    }
  });
}

// Database helper functions
const dbHelpers = {
  // Users
  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, userData.phone],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...userData });
        }
      );
    });
  },

  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Products
  createProduct: (productData) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO products (name, description, price, image, stock, discount) VALUES (?, ?, ?, ?, ?, ?)',
        [productData.name, productData.description, productData.price, productData.image, productData.stock, productData.discount],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...productData });
        }
      );
    });
  },

  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  updateProduct: (id, productData) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE products SET name = ?, description = ?, price = ?, image = ?, stock = ?, discount = ? WHERE id = ?',
        [productData.name, productData.description, productData.price, productData.image, productData.stock, productData.discount, id],
        function(err) {
          if (err) reject(err);
          else resolve({ id, ...productData });
        }
      );
    });
  },

  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes > 0 });
      });
    });
  },

  // Orders
  createOrder: (orderData) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO orders (userId, products, total, status, bankDetails) VALUES (?, ?, ?, ?, ?)',
        [orderData.userId, JSON.stringify(orderData.products), orderData.total, orderData.status, JSON.stringify(orderData.bankDetails)],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...orderData });
        }
      );
    });
  },

  getAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT o.*, u.name as userName, u.email as userEmail FROM orders o JOIN users u ON o.userId = u.id', (err, rows) => {
        if (err) reject(err);
        else {
          // Parse JSON fields
          const orders = rows.map(row => ({
            ...row,
            products: JSON.parse(row.products),
            bankDetails: row.bankDetails ? JSON.parse(row.bankDetails) : null
          }));
          resolve(orders);
        }
      });
    });
  },

  getOrdersByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT o.*, u.name as userName, u.email as userEmail FROM orders o JOIN users u ON o.userId = u.id WHERE o.userId = ?', 
        [userId], (err, rows) => {
          if (err) reject(err);
          else {
            // Parse JSON fields
            const orders = rows.map(row => ({
              ...row,
              products: JSON.parse(row.products),
              bankDetails: row.bankDetails ? JSON.parse(row.bankDetails) : null
            }));
            resolve(orders);
          }
        }
      );
    });
  },

  updateOrder: (id, updateData) => {
    return new Promise((resolve, reject) => {
      const updates = [];
      const values = [];
      
      if (updateData.status) {
        updates.push('status = ?');
        values.push(updateData.status);
      }
      
      if (updateData.bankDetails) {
        updates.push('bankDetails = ?');
        values.push(JSON.stringify(updateData.bankDetails));
      }
      
      if (updates.length === 0) {
        resolve({ id });
        return;
      }
      
      values.push(id);
      const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
      
      db.run(query, values, function(err) {
        if (err) reject(err);
        else resolve({ id, updated: this.changes > 0 });
      });
    });
  },

  deleteOrder: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes > 0 });
      });
    });
  }
};

module.exports = { db, dbHelpers }; 