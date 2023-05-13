const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
require('./config/database');
require("dotenv").config();
// const fileUpload = require('express-fileupload');
// app.use(fileUpload());
// const multer = require('multer');
// const upload = multer({ dest: 'public/images/' });

app.use(express.static('public')); 
// http://localhost:5000/images/1679867982189.jpg

const port = process.env.PORT
const Router = require("./routes/app");

app.use("/", Router);


app.listen(port, ()=>{
    console.log("working...")
})