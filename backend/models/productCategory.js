const mongoose = require("mongoose");

const prodCategorySchema = new mongoose.Schema({
    name: String,
    status: {type: Boolean, default: true},
    date: {type: Date, default: Date.now},
})

const ProductCategory = mongoose.model("productCategory", prodCategorySchema);
module.exports = ProductCategory;