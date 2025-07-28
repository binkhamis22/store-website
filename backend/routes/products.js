const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Create product (admin only)
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  const { name, description, price, image, stock } = req.body;
  const product = new Product({ name, description, price, image, stock });
  await product.save();
  res.status(201).json(product);
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  
  console.log('Updating product with ID:', req.params.id);
  console.log('Update data:', req.body);
  console.log('User:', req.user.email);
  
  try {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!product) {
      console.log('Product not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Product updated successfully:', product);
  res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'CastError') {
      console.log('Invalid product ID format:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router; 