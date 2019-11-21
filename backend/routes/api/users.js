const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const fs = require("fs");

const auth = require("../../middleware/auth");
const can = require("../../middleware/permission");
const UserModel = require("../../models/User");



/* 
    @route          GET api/users
    @desc           Get all users
    @access         Private
*/

router.get("/", auth, can("admin"), async(req,res) => {
    try {
        const users = await UserModel.find({}).select("-password");
        if(!users)
            return res.status(400).json({msg: "There are no users"})
        res.json(users);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


/* 
    @route          GET api/users/:id
    @desc           Get user by id
    @access         Private
*/

router.get("/:id", auth, can("admin"), async(req,res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id).select("-password");
        if(!user)
            return res.status(400).json({msg: "No user found"})
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



/* 
    @route          PATCH api/users/:id
    @desc           Update user stuff
    @access         Private
*/
//TODO : Make the user be able to change his name and username.
router.patch('/:id', auth, can("admin"), async(req,res) => {

    const {role} = req.body;
    const { azure} = req.body;
    const {user} = req;
    
   
    try {
        if(user._id == req.params.id)
            if(role !== user.role)
                return res.status(403).json({msg: "You are forbidden to edit your own role"}); // user is forbidden
        const userRes = await UserModel.findByIdAndUpdate(req.params.id,{role: role, azure: azure}, {new: true}).select("-password");
        res.json(userRes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg:"Server error"});
    }
});

/* 
    @route          GET api/users/images/:id
    @desc           Get user images
    @access         Private
    @status         DEPRICATED
*/
router.get('/api/images/:id', auth, can("admin"), async(req,res) => {
    const id = req.params.id;
    fs.readdir(`public/${id}`, async (err, filenames) => {
        if(err) {
            if(err.code === "ENOENT")
                return res.status(404).send({msg:"There are no pictures for that user"})
            return res.status(500).send({msg:"Failed to read files !"})
        }
        imgContents = [];

        await Promise.all(filenames.map(async filename => {
            return new Promise((resolve,reject) => {
                fs.readFile(`public/${id}/${filename}`,'base64',(err, content) => {
                    if(err){
                        console.log(err);
                        return res.status(500).send({msg:"failed to read file " + filename})
                    }
                    imgContents.push( {
                        name: filename,
                        content: content
                    });
                    resolve("read successfully");
                });
            });
        }));
        res.json(imgContents);
    });
});






module.exports = router;