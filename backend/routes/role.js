const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Role = require("../models/role");

router.post("/registerRole", async(req, res) => {
    if (!req.body.name || !req.body.description) 
        return res.status(401).send("Process failed: Incomplete data");
    
    const roleExists = await Role.findOne({name: req.body.name});
    if (roleExists)
        return res.status(401).send("Process failed: Role Already Exists");
    
    const role = new Role ({
        name: req.body.name,
        description: req.body.description,
    });

    const result = await role.save();
    if (!result)
        return res.status(401).send("Failed to register role");
    return res.status(200).send({result})
});

router.get("/getRoles", async(req, res) => {
    const role = await Role.find();
    if (!role) return res.status(401).send("No roles found");
    return res.status(200).send({role});
})

router.put("/updateRole", async(req, res) => {
    if (!req.body._id || !req.body.name || !req.body.description)
        return res.status(401).send("Process failed: Incomplete data");

    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");

    const role = await Role.findByIdAndUpdate(req.body._id, {
        name: req.body.name,
        description: req.body.description
    }, {new: true});

    if (!role) return res.status(401).send("Process failed: Role not found");
    return res.status(200).send({role});
})

router.put("/deleteRole", async(req, res) => {
    if (!req.body._id)
        return res.status(401).send("Process failed: Incomplete data");

    let validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId)
        return res.status(401).send("Process failed: Invalid id");

    const role = await Role.findByIdAndUpdate(req.body._id, {status: false}, {new: true});
    if (!role) return res.status(401).send("Process failed: Error editing role");

    return res.status(200).send({role});
})

router.delete("/deleteRole/:_id?", async(req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!validId) return res.status(401).send("Process failed: Invalid Id");

    const role = await Role.findByIdAndDelete(req.params._id);
    if (!role) return res.status(401).send("Process failed: Role not found");

    return res.status(200).send("Role deleted");
})

module.exports = router;