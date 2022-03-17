const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title:{type:String,  unique:true},
    desc:{type:String,required:true},
    img:{type:String, required:true},
    categories:{type:Array},
    size:{type:String},
    color:{type:String},
    price:{type:String, required:true},
},
{timestamps:true}
);

module.exports = new mongoose.model("Product", productSchema);