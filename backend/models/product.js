const { mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String,
    unitPrice: Number,
    quantity: Number,
    categoryId: {type: mongoose.Schema.ObjectId, ref: "productCategory"},
    providerId: {type: mongoose.Schema.ObjectId, ref:"user"},
    status: {type: Boolean, default: true},
    date: {type:Date, default: Date.now},
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;