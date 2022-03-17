const Cart = require("../models/cartModel");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

  const express = require("express");
  const router = express.Router();

  //create cart
  router.post("/cart", verifyToken,async(req,res)=>{
    try{
    const  newCart = new Cart(req.body);
    const saveCart = await newCart.save();
    return res.status(201).json({
        message:"newCart created",
        data:saveCart
    })
    }catch(err){
        return res.status(500).json({err:err.message});
    }
 });

 
//UPDATE
router.patch("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //Delete Cart
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
     const _id = req.params.id;
     const deleteCart = await Cart.findById(_id);
     return res.status(200).json({
       message: "  cart deleted success",
       data:deleteCart
     })
    } catch (err) {
      res.status(500).json(err);
    }
  });

   //GET userCart by Id
router.get("/getCart/userId",verifyTokenAndAuthorization, async (req, res) => {
    try {
    const userId = req.params.userId
     const getuserCart = await Cart.findOne({userId});
    console.log(getuserCart);
     return res.status(200).json({
       message: "success",
       data:getuserCart
     });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Get All
  router.get("/",verifyTokenAndAdmin,async(req,res)=>{
      try{
      const getAllCart = await Cart.find();
      return res.status(200).json({
          message:"Success",
          data:getAllCart
      });
    }catch(err){
        return res.status(500).json({err:err.message});
    }
  });

  module.exports = router;