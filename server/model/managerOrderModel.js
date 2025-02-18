const mongoose = require('mongoose');

const ManagerOrderSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Manager', // Reference to Manager collection (if applicable)
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Product', // Reference to Product collection
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
});

module.exports = mongoose.model('ManagerOrder', ManagerOrderSchema);
