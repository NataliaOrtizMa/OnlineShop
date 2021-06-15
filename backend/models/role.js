const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: {type: Boolean, default: true},
    date: {type: Date, default: Date.now},
});

const Role = mongoose.model("role", roleSchema);
module.exports = Role;