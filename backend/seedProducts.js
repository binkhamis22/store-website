const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const defaultProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    stock: 25
  },
  {
    name: "Smartphone Case - Premium Leather",
    description: "Handcrafted genuine leather case for iPhone and Samsung phones. Provides excellent protection and elegant style.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1603313011108-4c4b0b0b0b0b?w=400",
    stock: 50
  },
  {
    name: "Laptop Stand - Adjustable",
    description: "Ergonomic aluminum laptop stand with adjustable height. Improves posture and keeps your laptop cool during use.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    stock: 15
  },
  {
    name: "Coffee Mug - Ceramic",
    description: "Large 16oz ceramic coffee mug with comfortable handle. Microwave and dishwasher safe. Perfect for home or office.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 100
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400",
    stock: 30
  },
  {
    name: "Portable Power Bank - 10000mAh",
    description: "High-capacity portable charger with fast charging technology. Charges phones up to 3 times on a single charge.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400",
    stock: 40
  },
  {
    name: "Desk Lamp - LED",
    description: "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for studying or working.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
    stock: 20
  },
  {
    name: "Bluetooth Speaker - Waterproof",
    description: "Portable waterproof Bluetooth speaker with 360-degree sound. Perfect for outdoor activities and parties.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    stock: 35
  },
  {
    name: "Mechanical Keyboard - RGB",
    description: "Gaming mechanical keyboard with RGB backlighting and customizable keys. Premium build quality for gamers and typists.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
    stock: 12
  },
  {
    name: "Fitness Tracker - Smart Watch",
    description: "Advanced fitness tracker with heart rate monitor, GPS, and sleep tracking. Water-resistant and long battery life.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    stock: 18
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert default products
    const products = await Product.insertMany(defaultProducts);
    console.log(`Successfully added ${products.length} products to the database`);
    
    // Display the products
    console.log('\nAdded products:');
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price} (Stock: ${product.stock})`);
    });
    
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts(); 