const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// Debug route to see all orders (no auth required for debugging)
router.get('/debug', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json({
      totalOrders: orders.length,
      orders: orders.map(o => ({ 
        id: o._id, 
        status: o.status, 
        total: o.total,
        createdAt: o.createdAt,
        user: o.user ? o.user.email : 'Unknown'
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Create order (customer)
router.post('/', auth, async (req, res) => {
  const { products, total, bankDetails } = req.body;
  const order = new Order({
    user: req.user.id,
    products,
    total,
    bankDetails,
    status: 'pending',
  });
  await order.save();
  res.status(201).json(order);
});

// Get user's orders
router.get('/my', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('products.product');
  res.json(orders);
});

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  const orders = await Order.find().populate('user').populate('products.product');
  res.json(orders);
});

// Update order (customer can update their own orders, admin can update any)
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Updating order:', req.params.id, req.body);

    // Find the order first to check ownership
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('user').populate('products.product');

    console.log('Order updated successfully:', updatedOrder);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    console.log('Updating order status:', req.params.id, status);

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).populate('user').populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Attempting to delete order with ID:', req.params.id);
    console.log('ID type:', typeof req.params.id);

    // Validate ObjectId format
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
      return res.status(400).json({ message: 'Invalid order ID provided' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log('Order not found with ID:', req.params.id);
      return res.status(404).json({ message: `Order not found with id: ${req.params.id}` });
    }

    console.log('Found order to delete:', order._id);
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

module.exports = router; 