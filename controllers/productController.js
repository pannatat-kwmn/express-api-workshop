const Product = require('../models/product.model')
const { Order } = require('../models/order.model')
const crypto = require('crypto');
const mongoose = require('mongoose');
//@desc Get all products
//@access private
const getProducts = (async (req, res) => {
    const products = await Product.find({});
    res.status(200).json(products);
});

//@desc Create New product
//@access private
const createProduct = (async (req, res) => {
    console.log("The request body is :", req.body);
    const { name, desc, price, stock } = req.body;
    if (!name || !desc || !price) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const product = await Product.create({
        _id: crypto.randomUUID(),
        productName: name,
        productDescription: desc,
        productPrice: price,
        productStock: stock
    });
    res.status(201).json(product);
});

//@desc Get contact
//@access private
const getProduct = (async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.status(200).json(product);
});

//@desc Update product
//@access private
const updateProduct = async (req, res) => {
    const { name, desc, price, stock } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            productName: name,
            productDescription: desc,
            productPrice: price,
            productStock: stock
        },
            { new: true }
        );
        if (!updatedProduct) {
            res.status(404);
            throw new Error("Product update failed");
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//@desc get all Order of input product
//@access private
const getProductOrder = (async (req, res) => {
    try {
        const productId = req.params.id;
        // Check if the provided product ID is valid
        if (!mongoose.Types.UUID.isValid(productId)) {
            res.status(400).json({ error: 'Invalid product ID' });
            return;
        }

        // Find all orders that include the specified product ID
        const orders = await Order.find({ 'products.product': productId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//@desc Delete product
//@access private
const deleteProduct = (async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    await Product.deleteOne({ _id: req.params.id });
    res.status(204).json(product);
});

module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    getProductOrder,
    deleteProduct
};