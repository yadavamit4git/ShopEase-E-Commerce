
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: String,
            price: Number,
            quantity: Number
        }
    ],

    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["COD"],
        default: "COD"
    },

    status: {
        type: String,
        enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Placed"
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
