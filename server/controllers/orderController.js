
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items?.length || !shippingAddress) {
            return res.status(400).json({
                message: "Cart and delivery details are required"
            });
        }

        if (paymentMethod !== "COD") {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        const requiredFields = [
            "fullName", "phone", "address",
            "city", "state", "pincode"
        ];

        for (const field of requiredFields) {
            if (!shippingAddress[field]?.toString().trim()) {
                return res.status(400).json({
                    message: `Please enter ${field}`
                });
            }
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({
                    message: "Invalid quantity"
                });
            }

            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `${product.name} has insufficient stock`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity
            });

            totalAmount += product.price * quantity;
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentMethod: "COD"
        });

        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// CUSTOMER: MY ORDERS
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ADMIN: GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ADMIN: UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated",
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};
