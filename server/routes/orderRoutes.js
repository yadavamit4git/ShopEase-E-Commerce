
const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Customer routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin routes
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/admin/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
