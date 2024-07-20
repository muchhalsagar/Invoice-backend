const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
