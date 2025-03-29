import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Course from '../models/courseModel.js';
import { calcPrices } from '../utilis/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utilis/paypal.js';

// @desc    create new order
// @route   POST api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Get the ordered items from the database
    const itemsFromDB = await Course.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Map over the order items and use the price from the database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        throw new Error(`Course with ID ${itemFromClient._id} not found`);
      }

      return {
        ...itemFromClient,
        course: itemFromClient._id,
        price: parseFloat(matchingItemFromDB.price).toFixed(2), // Ensure price has two decimal places
        _id: undefined,
      };
    });

    // Calculate prices
    const { itemsPrice, taxPrice, totalPrice } = calcPrices(dbOrderItems);

    // Validate calculated prices
    if (isNaN(Number(itemsPrice)) || isNaN(Number(taxPrice)) || isNaN(Number(totalPrice))) {
      res.status(400);
      throw new Error('Invalid price calculation');
    }

    // Create the order
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      itemsPrice: parseFloat(itemsPrice).toFixed(2), // Ensure two decimal places
      taxPrice: parseFloat(taxPrice).toFixed(2),     // Ensure two decimal places
      totalPrice: parseFloat(totalPrice).toFixed(2), // Ensure two decimal places
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});



// @desc    get looged in user order
// @route   GET api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async(req,res)=>{
    const order = await Order.find({ user: req.user._id });
    res.status(200).json(order);
});


// @desc    get order by id
// @route   GET api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id).populate('user','name email');

    if(order) {
        res.status(201).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }

});

// @desc    Update order to paid
// @route   PUT api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // Verify the payment with PayPal
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) {
    console.error('Payment verification failed:', req.body.id);
    throw new Error('Payment not verified');
  }

  // Check if the transaction ID has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) {
    console.error('Duplicate transaction detected:', req.body.id);
    throw new Error('Transaction has been used before');
  }

  // Find the order by ID
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Validate the amount paid
  const paidCorrectAmount = Number(order.totalPrice).toFixed(2) === Number(value).toFixed(2);
  if (!paidCorrectAmount) {
    console.error('Incorrect amount paid:', { expected: order.totalPrice, received: value });
    throw new Error('Incorrect amount paid');
  }

  // Update the order to paid
  try {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500);
    throw new Error('Failed to update order');
  }
});

// @desc    Get all orders 
// @route   GET api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async(req,res)=>{
    const orders = await Order.find({}).populate('user', 'name');
    res.status(200).json(orders);
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    getOrders,
}