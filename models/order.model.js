const mongoose = require('mongoose');
const crypto = require('crypto')

const orderSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.UUID, default: crypto.randomUUID() },
    orderDate: Date,
    products: [
      {
        product: { type: mongoose.Schema.Types.UUID, ref: 'Product' }, // Reference to Product collection
        quantity: Number
      }
    ]
  },
  { timestamps: true });
  
  const Order = mongoose.model('Order', orderSchema);
  
  module.exports = { Order };
