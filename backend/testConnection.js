const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://crazycool2030:ET9QXN930KtaOT5m@cluster0.fxwkbua.mongodb.net/store-website?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB connection...');

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  mongoose.connection.close();
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('\nPossible solutions:');
  console.log('1. Check your internet connection');
  console.log('2. Verify MongoDB Atlas is accessible');
  console.log('3. Check if the connection string is correct');
}); 