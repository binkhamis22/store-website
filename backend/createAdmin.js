const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Direct connection string
const MONGO_URI = 'mongodb+srv://crazycool2030:ET9QXN930KtaOT5m@cluster0.fxwkbua.mongodb.net/store-website?retryWrites=true&w=majority&appName=Cluster0';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@store.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@store.com');
      console.log('Password: admin123');
      mongoose.connection.close();
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@store.com',
      password: hashedPassword,
      isAdmin: true
    });
    
    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@store.com');
    console.log('Password: admin123');
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin(); 