const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const Settings = require("../../models/Settings");

const can = require("../../middleware/permission");
const auth = require("../../middleware/auth");

/* 
    @route                  GET api/settings
    @desc                   Retrieve settings
    @access                 Private
    @role                   admin
*/
router.get("/", auth, can("admin"), async (req, res) => {
    try {
        let settings = await Settings.findOne({});
        if(!settings) {
            settings = new Settings();
            await settings.save();
        }

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



/* 
    @route                  POST api/settings
    @desc                   Set/Update settings
    @access                 Private
    @role                   admin
*/
router.post("/", auth, can("admin"), async (req, res) => {

    try {
        let settings = await Settings.findOne({});
        if(settings){
            //Update settings
            settings = await Settings.findOneAndUpdate({}, req.body, {new: true});
            return res.json(settings);
        }
        settings = new Settings(req.body);
        await settings.save();
        res.json(settings);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }


});



module.exports = router;
