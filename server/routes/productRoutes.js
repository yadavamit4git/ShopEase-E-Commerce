
const express = require("express");
const router = express.Router();

const {
    addProduct,
    addMultipleProducts,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin-only routes
router.post("/", protect, admin, addProduct);
router.post("/bulk", protect, admin, addMultipleProducts);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
