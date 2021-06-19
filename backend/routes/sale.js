const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Sale = require("../models/sale");
const User = require("../models/user")
const Product = require("../models/product")

router.post("/registerSale", async(req, res) => {
    if (!req.body.clientId || 
        !req.body.employeeId ||
        !req.body.productId) 
        return res.status(401).send("Process failed: Incomplete data");

    const clientId = await User.findById(req.body.clientId);
    if (!clientId) return res.status(401).send("Process failed: Client not found");

    const employeeId = await User.findById(req.body.employeeId);
    if (!employeeId) return res.status(401).send("Process failed: Employee not found");

    const productId = await Product.findById(req.body.productId);
    if (!productId) return res.status(401).send("Process failed: Product not found");
    
    const sale = new Sale ({
        clientId: clientId,
        employeeId: employeeId,
        productId: productId
    });

    const result = await sale.save();
    if (!result)
        return res.status(401).send("Failed to register sale");
    return res.status(200).send({result})
});

router.get("/getSales", async(req, res) => {
    const sales = await Sale.find();
    if (!sales) return res.status(401).send("No sales found");
    return res.status(200).send({sales});
})

router.put("/updateSale", async(req, res) => {
    if (!req.body._id,
        !req.body.clientId || 
        !req.body.employeeId ||
        !req.body.productId)
        return res.status(401).send("Process failed: Incomplete data");

    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");

    const sale = await Sale.findByIdAndUpdate(req.body._id, {
        clientId: req.body.clientId,
        employeeId: req.body.employeeId,
        productId: req.body.productId
    }, {new: true});

    if (!sale) return res.status(401).send("Process failed: Sale not found");
    return res.status(200).send({sale});
})

router.put("/deleteSale", async(req, res) => {
    if (!req.body._id)
        return res.status(401).send("Process failed: Incomplete data");

    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");

    const sale = await Sale.findByIdAndUpdate(req.body._id, {status: false}, {new: true});
    if (!sale) return res.status(401).send("Process failed: Error editing sale");

    return res.status(200).send({sale});
})

router.delete("/deleteSale/:_id?", async(req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!validId) return res.status(401).send("Process failed: Invalid Id");

    const sale = await Sale.findByIdAndDelete(req.params._id);
    if (!sale) return res.status(401).send("Process failed: Sale not found");

    return res.status(200).send("Sale deleted");
})

module.exports = router;