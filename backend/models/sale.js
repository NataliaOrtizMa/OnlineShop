const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.ObjectId, ref: "user"},
    employeeId: {type: mongoose.Schema.ObjectId, ref: "user"},
    productId: {type: mongoose.Schema.ObjectId, ref: "product"},
    status: {type: Boolean, default: true},
    date: {type:Date, default: Date.now},
});

const Sale = mongoose.model("sale", saleSchema);
module.exports = Sale;