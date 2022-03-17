const Product = require("../models/productmodel");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
  
  const express = require("express");
  const router = express.Router();


// create Product
router.post("/Product", verifyTokenAndAdmin,async(req,res)=>{
   try{
   const  newProduct  = new Product(req.body);
   const saveProduct = await newProduct.save();
   return res.status(201).json({
       message:"newProduct created",
       data:saveProduct
   })
   }catch(err){
       return res.status(500).json({err:err.message});
   }
});

//UPDATE
router.patch("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET ALL Product
router.get("/getAllProduct", async (req, res) => {
    const qnew= req.query.new;
    const qCategory = req.query.category 
    try {
      let products;
      if(qnew){
        products =  await Product.find().sort({ createdAt: -1 }).limit(4);
      }else if(qCategory){
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      }else{

        products = await Product.find();
      }
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET Product Id
router.get("/getProduct/:id", async (req, res) => {
    try {
     const _id = req.params.id;
     const getProduct = await Product.findById(_id);
    console.log(getProduct);
     return res.status(200).json({
       message: "success",
       data:getProduct
     });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});
   
module.exports = router;