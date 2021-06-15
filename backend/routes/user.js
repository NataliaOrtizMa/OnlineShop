const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");
const Role = require("../models/role");


router.post("/registerUser", async(req, res) => {
    if(!req.body.name ||
       !req.body.email ||
       !req.body.password)
    return res.status(401).send("Process failed: Incomplete data");

    let user = await User.findOne({email: req.body.email})
    if (user) 
        return res.status(401).send("Process failed: The user already exists");

    const role = await Role.findOne({name: "client"});
    if (!role)
        return res.status(401).send("Process failed: Role not found")

    const hash = await bcrypt.hash(req.body.password, 10);
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        roleId: role._id
    });
    try {
        const result = await user.save();
        if (!result) return res.status(401).send("Failed to register user");
        const jwtToken = user.generateJWT();
        return res.status(200).send({jwtToken});
    } catch (error) {
        return res.status(401).send("Failed to register user")
    }
});

router.post("/registerPartner", async(req, res) => {
    if(!req.body.name ||
       !req.body.email ||
       !req.body.password ||
       !req.body.roleId)
    return res.status(401).send("Process failed: Incomplete data");

    let user = await User.findOne({email: req.body.email})
    if (user) 
        return res.status(401).send("Process failed: The user already exists");

    const validId = mongoose.Types.ObjectId.isValid(req.body.roleId)
    if (!validId)
        return res.status(401).send("Process failed: Invalid Id")

    const hash = await bcrypt.hash(req.body.password, 10);
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        roleId: req.body.roleId
    });
    try {
        const result = await user.save();
        if (!result) return res.status(401).send("Failed to register user");
        const jwtToken = user.generateJWT();
        return res.status(200).send({jwtToken});
    } catch (error) {
        return res.status(401).send("Failed to register user")
    }
});

router.get("/getUsers/:name?", async(req, res) => {
    const user = await User.find({name: new RegExp(req.params["name"], "i")})
    .populate("roleId")
    .exec();
    if(!user) return res.status(401).send("Process failed: No users found");
    return res.status(200).send({user})
});

router.put("/updateUser", async(req, res) => {
    if(!req.body.name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.roleId)
    return res.status(401).send("Process failed: Incomplete data");

})



module.exports = router;