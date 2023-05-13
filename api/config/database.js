const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.URL_MONGOOSE

mongoose.connect(db)
    .then(
        ()=>console.log("connecting")
    )
    .catch(
        err=>console.log(err)
    )