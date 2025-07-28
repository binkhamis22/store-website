const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  stock: { type: Number, default: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 