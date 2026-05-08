const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Product = require("../models/Product");
const checkAdmin = require('../middleware/checkAdmin');
const {body, validationResult} = require('express-validator');

//Route 0: Get all the products in Public removing the middleware
router.get('/allproducts', async (req, res) =>{
    try{
        const products = await Product.find({})
            .populate('user','name');
        res.json(products);
    }
    catch (error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route 1: Get all the products using: GET "/api/products/fetchallproducts". login required
router.get('/fetchallproducts', fetchuser, async (req, res) =>{
    try{
        const products = await Product.find({user: req.user.id});
        if (products.length === 0) {
            return res.status(200).json({ message: "No products found for this user." });
        }

        res.json(products);
    }
    catch (error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route 2: add new the products using: POST "/api/products/addproduct". login required
router.post('/addproduct', fetchuser, [
    body('name', 'enter name of product').isLength({ min: 3 }),
    body('description', 'Description mustbe atleast 5 characters').isLength({ min: 5 }),
    body('price', 'Price must be a number').isNumeric(),
    body('image', 'Image URL must be valid').isURL(),
], async (req, res) =>{
    try{
        const {name, description, price, image} = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }
        const product = new Product({
            name, description, price, image, user: req.user.id
        });
        const savedProduct = await product.save()
        res.json(savedProduct);
    }
    catch (error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
}
})

//Route 3: update an existing products using: PUT "/api/products/addproduct". login required
router.put('/updateproduct/:id', fetchuser, async (req, res) => {
    const { name, description, price, image } = req.body;
    try {
        // create a newProduct object
        const newProduct = {};
        if (name) { newProduct.name = name }
        if (description) { newProduct.description = description }
        if (price) { newProduct.price = price };
        if (image) { newProduct.image = image };
        // find the product to be updated and update it
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found")
        }
        if (product.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        product = await Product.findByIdAndUpdate(req.params.id, { $set: newProduct }, { new: true });
        res.json({ product })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 3: update an existing products using: PUT "/api/products/admin/updateproduct/:id". login required
router.put('/admin/updateproduct/:id', checkAdmin, async (req, res) => {
    const { name, description, price, image } = req.body;
    try {
        // create a newProduct object
        const newProduct = {};
        if (name) { newProduct.name = name }
        if (description) { newProduct.description = description }
        if (price) { newProduct.price = price };
        if (image) { newProduct.image = image };
        // find the product to be updated and update it
        let product = await Product.findByIdAndUpdate(req.params.id, { $set: newProduct }, // Apply the updates from newProduct
            { new: true }); // Return the updated document instead of the original);
        if (!product) {
            return res.status(404).send("Not Found")
        }
        // product = await Product.findByIdAndUpdate(req.params.id, { $set: newProduct }, { new: true });
        res.json({"success":"Product has been Updated by Admin",product: product})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 4: DELETE an existing products using: DELETE "/api/products/deleteproduct". login required
router.delete('/deleteproduct/:id', fetchuser, async (req, res) => {
    // const { name, description, price } = req.body;
    try {
       
        // find the product to be deleted and delete it
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found")
        }
        // Allow deletion only if user owns this product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        product = await Product.findByIdAndDelete(req.params.id);
        res.json({ "success ": "Product has been deleted", product: product })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// Admin Route to delete any product by ID
router.delete('/admin/deleteproduct/:id', checkAdmin, async (req, res) =>{
    try{
        let product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(404).send("Not Found Product");
        }
        res.json({"success":"Product has been deleted by Admin",product: product});
    }
    catch(error){
        console.error(error.message,"Error in/admin/deleteproduct");
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router                                                                                                                  