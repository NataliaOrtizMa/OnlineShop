const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const moment = require("moment");

const userSchema = new mongoose.Schema({
    name: String,
    email: String, 
    password: String,
    roleId: {type: mongoose.Schema.ObjectId, ref: "role"},
    status: {type: Boolean, default: true},
    date: {type:Date, default: Date.now},
});

userSchema.methods.generateJWT = function() {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            roleId: this.roleId,
            iat: moment().unix()
        },
        process.env.JWT_KEY
    );
};

const User = mongoose.model("user", userSchema);
module.exports = User;