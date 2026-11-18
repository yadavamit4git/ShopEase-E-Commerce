
const Product = require("../models/Product");

// ADD SINGLE PRODUCT
exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD MULTIPLE PRODUCTS
exports.addMultipleProducts = async (req, res) => {
    try {
        const products = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Please provide an array of products"
            });
        }

        const savedProducts = await Product.insertMany(products);

        res.status(201).json({
            message: "Multiple products added successfully",
            totalProducts: savedProducts.length,
            products: savedProducts
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
