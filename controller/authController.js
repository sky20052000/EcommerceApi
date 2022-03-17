const User  = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const authController = {
// Register 
userRegister:async(req,res)=>{
    try{
       console.log(req.body);
       const {username, email , password} = req.body;
       
       const user = await User.findOne({email});
       if(user){
           return res.status(400).json({message:"User already exists"});
       }
       if(user == 0){
        return res.status(400).json({message:"User is not Active"}); 
       }
       const passwordhash = await bcrypt.hash(password,10);
       const newUser = new User({
           username:username,
           email:email,
           password:passwordhash
       });
       await newUser.save();
       return res.status(201).json({
           message:"User Registered Successfully",
           data:newUser
       });
    }catch(err){
        return res.status(500).json({err:err.message});
    }
},

// Login 

userLogin:async(req,res)=>{
    try{
      console.log(req.body);
      const {email, password }  =req.body;
      const validate = validator.isEmail(email);
       if(!validate){
           return res.status(400).json({error:{message:"Invalid Email format"}});
       }
      
      const user = await User.findOne({email});
      if(!user){
          return res.status(400).json({error:{message:"User is not registered"}});
      }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({error:{password:"User password does not matched"}})
    }
    const accessToken  = jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin,
    }, config.SECRET_KEY,{expiresIn:"5d"});
    return res.status(200).json({message:"User login Successfully", data:user,token:accessToken});
    }catch(err){
        return res.status(500).json({err:err.message});
    }
},

}
module.exports = authController;