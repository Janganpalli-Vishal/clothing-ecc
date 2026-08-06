const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Men', 'Women', 'Kids', 'Accessories', 'Footwear', 'Sports']
  },
  subCategory: {
    type: String,
    required: [true, 'Product sub-category is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size']
  }],
  colors: [{
    type: String,
    trim: true
  }],
  material: {
    type: String,
    required: [true, 'Material is required'],
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  weight: {
    type: String,
    trim: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  careInstructions: {
    type: String,
    trim: true
  },
  season: {
    type: String,
    enum: ['Summer', 'Winter', 'Spring', 'Fall', 'All Season'],
    default: 'All Season'
  },
  style: {
    type: String,
    trim: true
  },
  pattern: {
    type: String,
    trim: true
  },
  sleeveLength: {
    type: String,
    enum: ['Short', 'Long', 'Sleeveless', 'Half Sleeve', 'Three Quarter']
  },
  neckline: {
    type: String,
    trim: true
  },
  fit: {
    type: String,
    enum: ['Slim', 'Regular', 'Loose', 'Oversized']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
