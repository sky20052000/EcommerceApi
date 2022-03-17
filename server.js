const config = require("./config.json");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// middleware configaration
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// db connection 
mongoose.connect(config.MONGO_URL).then((data)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("no connection");
});

// routes 
// admin routes
app.use("/api/authRoutes",require("./routes/authRoutes"));
//user routes
app.use("/api/userRoutes", require("./routes/userRoutes"));

// product routes
app.use("/api/productRoutes/",require("./routes/productRoutes"));

// cart routes
app.use("/api/cartRoutes/",require("./routes/cartRoutes"));

// Order Routes
app.use("/api/orderRoutes",require("./routes/orderRoutes"));

const port = config.PORT ||6001;
app.listen(port,()=>{
    console.log(`server is runinng on the:${port}`);
})