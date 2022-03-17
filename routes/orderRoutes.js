const Order = require("../models/orderModel");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

  const express = require("express");
  const router = express.Router();

  //Create Order
  router.post("/order", verifyToken,async(req,res)=>{
    try{
    const  newOrder  = new Order(req.body);
    const saveOrder = await newOrder.save();
    return res.status(201).json({
        message:"newOrder created",
        data:saveOrder
    })
    }catch(err){
        return res.status(500).json({err:err.message});
    }
 });

 //UPDATE Order
router.patch("/:id", verifyTokenAndAdmin, async (req, res) => {
  
    try {
      const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //Delete Order
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
     const _id = req.params.id;
     const deleteOrder = await Cart.findById(_id);
     return res.status(200).json({
       message: " Order deleted success",
       data:deleteOrder
     })
    } catch (err) {
      res.status(500).json(err);
    }
  });

   //GET userOrder 
router.get("/getOrder/userId",verifyTokenAndAuthorization, async (req, res) => {
    try {
    const userId = req.params.userId
     const getuserOrder = await Order.find({userId});
    console.log(getuserOrder);
     return res.status(200).json({
       message: "success",
       data:getuserOrder
     });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

 module.exports = router;