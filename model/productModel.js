const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // Percentage discount
  },
  quantity: {
    type: Number,
    required: true,
  }, // required: true,
  // category: {
  //  type: mongoose.Schema.Types.ObjectId,
  //  ref: 'Category',
  // },
  category: {
    type: String,
    required: true,  // Make it required if needed
  },
  tags: [
    {
      type: String, // Array of tags
    },
  ],
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived','Unpublished'],
    default: 'Draft',
  },
  images: [
    {
      type: String, // Store image URLs or file paths
    },
  ],
  
 createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
