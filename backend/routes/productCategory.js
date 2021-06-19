const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProductCategory = require("../models/productCategory");

router.post("/registerCategory", async(req, res) => {
    if(!req.body.name) 
        return res.status(401).send("Process failed: Incomplete data");

    let category = await ProductCategory.findOne({name: req.body.name});
    if (category)
        return res.status(401).send("Process failed: The category already exists");

    category = new ProductCategory({
        name: req.body.name
    });

    const result = await category.save();
    if (!result) 
        return res.status(401).send("Failed to register category");
    return res.status(200).send({result});
});

router.get("/getCategories", async(req, res) => {
    const category = await ProductCategory.find();
    if (!category) return res.status(401).send("No categories found");
    return res.status(200).send({category});
});

router.put("/updateCategory", async(req, res) => {
    if (!req.body._id ||
        !req.body.name) 
        return res.status(401).send("Process failed: Incomplete data");
    
    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");
    
    const category = await ProductCategory.findByIdAndUpdate(req.body._id, {name: req.body.name}, {new: true});
    if (!category) 
        return res.status(401).send("Process failed: Category not found");
    return res.status(200).send({category});
});

router.put("/deleteCategory", async(req, res) => {
    if (!req.body._id) 
        return res.status(401).send("Process failed: Incomplete data");
    
    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");
    
    const category = await ProductCategory.findByIdAndUpdate(req.body._id, {status: false}, {new: true});
    if (!category) 
        return res.status(401).send("Process failed: Category not found");
    return res.status(200).send({category});
});

router.delete("/deleteCategory/:_id?", async(req, res) => {
    if (!req.params._id) 
        return res.status(401).send("Process failed: Incomplete data");
    
    let validId = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");
    
    const category = await ProductCategory.findByIdAndDelete(req.params._id);
    if (!category) 
        return res.status(401).send("Process failed: Category not found");
    return res.status(200).send("Category deleted");
});

module.exports = router;
