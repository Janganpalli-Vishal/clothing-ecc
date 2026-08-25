const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Address = require('../models/Address');
const { protect, authorize } = require('../middleware/auth');

// Helper function to resolve shipping address from addressId or shippingAddress object
const resolveShippingAddress = async (reqBody, userId) => {
  if (reqBody.addressId) {
    const address = await Address.findOne({ _id: reqBody.addressId, user: userId });
    if (!address) {
      throw new Error('Selected shipping address not found');
    }
    return {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || 'India'
    };
  }

  if (reqBody.shippingAddress) {
    const sa = reqBody.shippingAddress;
    if (!sa.fullName || !sa.phone || !sa.addressLine1 || !sa.city || !sa.state || !sa.postalCode || !sa.country) {
      throw new Error('Please provide all required shipping address fields (fullName, phone, addressLine1, city, state, postalCode, country)');
    }
    return {
      fullName: sa.fullName,
      phone: sa.phone,
      addressLine1: sa.addressLine1,
      addressLine2: sa.addressLine2 || '',
      city: sa.city,
      state: sa.state,
      postalCode: sa.postalCode,
      country: sa.country
    };
  }

  throw new Error('Shipping address details or addressId must be provided');
};

// @route   POST /api/orders/summary
// @desc    Get checkout summary / preview (price, shipping, tax, stock availability)
// @access  Private
router.post('/summary', protect, async (req, res) => {
  try {
    let summaryItems = [];
    let itemsPrice = 0;
    let isAvailable = true;
    const unavailableItems = [];

    if (req.body.items && Array.isArray(req.body.items) && req.body.items.length > 0) {
      // Custom items provided (e.g. previewing direct buy or custom selection)
      for (const item of req.body.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.productId}`
          });
        }
        const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
        const itemTotal = unitPrice * item.quantity;
        itemsPrice += itemTotal;

        const hasStock = product.stock >= item.quantity;
        if (!hasStock) {
          isAvailable = false;
          unavailableItems.push({
            product: product.name,
            requested: item.quantity,
            available: product.stock
          });
        }

        summaryItems.push({
          product: product._id,
          name: product.name,
          image: product.images[0] || '',
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: unitPrice,
          totalPrice: itemTotal,
          inStock: hasStock
        });
      }
    } else {
      // Use cart items
      const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      for (const item of cart.items) {
        if (!item.product) continue;
        const unitPrice = item.price;
        const itemTotal = unitPrice * item.quantity;
        itemsPrice += itemTotal;

        const hasStock = item.product.stock >= item.quantity;
        if (!hasStock) {
          isAvailable = false;
          unavailableItems.push({
            product: item.product.name,
            requested: item.quantity,
            available: item.product.stock
          });
        }

        summaryItems.push({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0] || '',
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: unitPrice,
          totalPrice: itemTotal,
          inStock: hasStock
        });
      }
    }

    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    let shippingAddress = null;
    if (req.body.addressId || req.body.shippingAddress) {
      try {
        shippingAddress = await resolveShippingAddress(req.body, req.user.id);
      } catch (addrErr) {
        // Optional address resolution for summary
      }
    }

    res.status(200).json({
      success: true,
      data: {
        items: summaryItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isAvailable,
        unavailableItems,
        shippingAddress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/orders/direct
// @desc    Direct "Buy Now" checkout without cart
// @access  Private
router.post('/direct', protect, [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('size').notEmpty().withMessage('Size is required'),
  body('color').notEmpty().withMessage('Color is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { productId, quantity, size, color, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: `Selected size '${size}' is not available for this product`
      });
    }

    if (!product.colors.includes(color)) {
      return res.status(400).json({
        success: false,
        message: `Selected color '${color}' is not available for this product`
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
      });
    }

    let shippingAddress;
    try {
      shippingAddress = await resolveShippingAddress(req.body, req.user.id);
    } catch (addrErr) {
      return res.status(400).json({
        success: false,
        message: addrErr.message
      });
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const itemsPrice = price * quantity;
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const orderItems = [{
      product: product._id,
      name: product.name,
      quantity,
      image: product.images[0] || '',
      price,
      size,
      color
    }];

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      statusHistory: [{
        status: 'Processing',
        timestamp: Date.now(),
        note: 'Direct buy order placed successfully'
      }]
    });

    // Update product stock
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity }
    });

    await order.populate('orderItems.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Direct order placed successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order from cart (Checkout)
// @access  Private
router.post('/', protect, [
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { paymentMethod } = req.body;

    let shippingAddress;
    try {
      shippingAddress = await resolveShippingAddress(req.body, req.user.id);
    } catch (addrErr) {
      return res.status(400).json({
        success: false,
        message: addrErr.message
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (!item.product || item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product ? item.product.name : 'one of the items'}`
        });
      }
    }

    // Calculate prices
    const itemsPrice = cart.totalAmount;
    const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping for orders above 1000
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // 18% tax
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      image: item.product.images[0] || '',
      price: item.price,
      size: item.size,
      color: item.color
    }));

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      statusHistory: [{
        status: 'Processing',
        timestamp: Date.now(),
        note: 'Order placed successfully'
      }]
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    await order.populate('orderItems.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('orderItems.product', 'name images');

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images');

    const total = await Order.countDocuments();

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    Process payment for an order by user
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = 'Completed';
    if (req.body.paymentMethod) {
      order.paymentMethod = req.body.paymentMethod;
    }

    order.statusHistory.push({
      status: 'Paid',
      timestamp: Date.now(),
      note: req.body.transactionId ? `Payment processed (Txn ID: ${req.body.transactionId})` : 'Payment completed successfully'
    });

    await order.save();
    await order.populate('orderItems.product', 'name images');

    res.status(200).json({
      success: true,
      message: 'Payment completed successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order by user
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (!['Processing', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already '${order.orderStatus}'`
      });
    }

    order.orderStatus = 'Cancelled';
    if (order.isPaid) {
      order.paymentStatus = 'Refunded';
    }

    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: Date.now(),
      note: req.body.reason || 'Order cancelled by customer'
    });

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await order.save();
    await order.populate('orderItems.product', 'name images');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: Date.now(),
      note: note || `Status updated to ${status}`
    });

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (status === 'Cancelled') {
      // Restore stock
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.save();
    await order.populate('orderItems.product', 'name images');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status (Admin only)
// @access  Private/Admin
router.put('/:id/payment', protect, authorize('admin'), [
  body('paymentStatus').notEmpty().withMessage('Payment status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === 'Completed') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    await order.save();
    await order.populate('orderItems.product', 'name images');

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
