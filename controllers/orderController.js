const { Order } = require('../models/order.model')
const Product = require('../models/product.model')
const crypto = require('crypto');
const mongoose = require('mongoose');

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getOrders = (async (req, res) => {
    const order = await Order.find({});
    res.status(200).json(order);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
const createOrder = (async (req, res) => {
  try {
    const { products } = req.body;

    // Validate that all products in the request have valid IDs
    const productIds = products.map(product => product.product);
    const validProductIds = productIds.every(id => mongoose.Types.UUID.isValid(id));
    if (!validProductIds) {
      res.status(400).json({ error: 'Invalid product IDs in request' });
      return;
    }

    // Check if products have sufficient stock
    for (const productData of products) {
      const product = await Product.findById(productData.product);
      if (!product) {
        res.status(400).json({ error: 'Product not found' });
        return;
      }
      if (product.productStock < productData.quantity) {
        res.status(400).json({ error: 'Insufficient stock for product' });
        return;
      }
    }
    // Create the order and update product stock
    const order = await Order.create({ products });
    for (const productData of products) {
      const product = await Product.findById(productData.product);
      product.productStock -= productData.quantity;
      await product.save();
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//@desc Get contact
//@access private
const getOrder = (async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    res.status(200).json(order);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteOrder = (async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    await Order.deleteOne({ _id: req.params.id });
    res.status(204).json(order);
});

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    deleteOrder
};