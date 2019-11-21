const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function auth(req,res,next) {
     // Get token from the header
     const token = req.header("x-auth-token");
     // Check if no-token
     if(!token)
         return res.status(401).json({msg: "No token, authorization denied"});
     try{
         const decoded = jwt.verify(token, config.get('jwtSecret'));
         req.user = await UserModel.findById(decoded.user.id).select("-password");
         next();
     }catch(err){
         res.status(401).json({msg: 'Token is not valid'});
     }
}



