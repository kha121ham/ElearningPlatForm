import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: { type:String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true, default: 0.00 },
            course: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Course'
            },
        }
    ],
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.00
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.00
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.00
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
},
{
    timestamps: true
}
);

const Order = mongoose.model("Order", orderSchema);
export default Order;