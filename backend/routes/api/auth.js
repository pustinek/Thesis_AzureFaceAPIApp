const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const auth = require("../../middleware/auth");

const { check, validationResult } = require("express-validator/check");

/*
    @route GET api/auth
    @desc Get authenticated user
    @access Public
*/
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



/* 
    @route      POST api/auth/register
    @desc       Register user
    @access     Public
*/

router.post("/register",
[
    check("name", "name is required").not().isEmpty(),
    check("username", "please chose a username with 4 or more characters").isLength({min: 4}),
    check("password", "please enter a password with 6 or more characters").isLength({min: 6}),
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const { name, username, password } = req.body;
    let role = "guest"
    try {

        let user = await User.findOne();
        // Make the first registered user an admin !
        if(!user) role = "admin";
        
          user = await User.findOne({ username });
          if(user)
              return res
                  .status(400)
                .json({ errors: [{ msg: "user already exists " }] });
        
        user = new User({
            username: username,
            name: name,
            password: password,
            role: role,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err,token) => {
            if(err) throw err;
            res.json({ token });
        });

    } catch (err) {
        res.status(500).send("Server error");
    }

});





/*
    @route Post api/login
    @desc Login user
    @access Public
*/
router.post(
  "/login",
  [check("password", "Password is required").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;

    try {
      let user = await User.findOne({ username });
      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;