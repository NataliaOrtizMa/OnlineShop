const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

router.post("/registerProduct", async(req, res) => {
    if (!req.body.name || 
        !req.body.description ||
        !req.body.unitPrice ||
        !req.body.quantity ||
        !req.body.categoryId ||
        !req.body.providerId) 
        return res.status(401).send("Process failed: Incomplete data");
    
    const productExists = await Product.findOne({name: req.body.name});
    if (productExists)
        return res.status(401).send("Process failed: Product Already Exists");
    
    const product = new Product ({
        name: req.body.name,
        description: req.body.description,
        unitPrice: req.body.unitPrice,
        quantity: req.body.quantity,
        categoryId: req.body.categoryId,
        providerId: req.body.providerId
    });

    const result = await product.save();
    if (!result)
        return res.status(401).send("Failed to register product");
    return res.status(200).send({result})
});

router.get("/getProducts", async(req, res) => {
    const product = await Product.find().populate("categoryId", "name").populate("providerId", "name").exec();
    if (!product) return res.status(401).send("No products found");
    return res.status(200).send({product});
})

router.put("/updateProduct", async(req, res) => {
    if (!req.body._id,
        !req.body.name || 
        !req.body.description ||
        !req.body.unitPrice ||
        !req.body.quantity ||
        !req.body.categoryId ||
        !req.body.providerId)
        return res.status(401).send("Process failed: Incomplete data");

    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");

    const product = await Product.findByIdAndUpdate(req.body._id, {
        name: req.body.name,
        description: req.body.description,
        unitPrice: req.body.unitPrice,
        quantity: req.body.quantity,
        categoryId: req.body.categoryId,
        providerId: req.body.providerId
    }, {new: true});

    if (!product) return res.status(401).send("Process failed: Product not found");
    return res.status(200).send({product});
})

router.put("/deleteProduct", async(req, res) => {
    if (!req.body._id)
        return res.status(401).send("Process failed: Incomplete data");

    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");

    const product = await Product.findByIdAndUpdate(req.body._id, {status: false}, {new: true});
    if (!product) return res.status(401).send("Process failed: Error editing product");

    return res.status(200).send({product});
})

router.delete("/deleteProduct/:_id?", async(req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!validId) return res.status(401).send("Process failed: Invalid Id");

    const product = await Product.findByIdAndDelete(req.params._id);
    if (!product) return res.status(401).send("Process failed: Product not found");

    return res.status(200).send("Product deleted");
})

module.exports = router;