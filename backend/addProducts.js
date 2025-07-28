const mongoose = require('mongoose');
const Product = require('./models/Product');

// Direct connection string
const MONGO_URI = 'mongodb+srv://crazycool2030:ET9QXN930KtaOT5m@cluster0.fxwkbua.mongodb.net/store-website?retryWrites=true&w=majority&appName=Cluster0';

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    stock: 25
  },
  {
    name: "Smartphone Case - Premium Leather",
    description: "Handcrafted genuine leather case for iPhone and Samsung phones.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1603313011108-4c4b0b0b0b0b?w=400",
    stock: 50
  },
  {
    name: "Laptop Stand - Adjustable",
    description: "Ergonomic aluminum laptop stand with adjustable height.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    stock: 15
  },
  {
    name: "Coffee Mug - Ceramic",
    description: "Large 16oz ceramic coffee mug with comfortable handle.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 100
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400",
    stock: 30
  }
];

async function addProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add new products
    const result = await Product.insertMany(products);
    console.log(`Added ${result.length} products successfully!`);
    
    // Show the products
    result.forEach(product => {
      console.log(`- ${product.name}: $${product.price}`);
    });
    
    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addProducts(); 