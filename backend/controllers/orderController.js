import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// @desc    create new order
// @route   POST api/orders
// @access  Private
const addOrderItems = asyncHandler(async(req,res)=>{
    const { 
        orderItems,
        itemsPrice,
        taxPrice,
        totalPrice
        } =req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        const order = new Order({
            orderItems: orderItems.map((x)=>({
                ...x,
                name: x.name,
                course: x._id,
                _id: undefined
            })),
            user: req.user._id,
            itemsPrice,
            taxPrice,
            totalPrice
        });
        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
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
const updateOrderToPaid = asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
        res.status(201).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
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
    getOrders
}