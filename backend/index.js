const express = require("express");
const app = express();

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const fileUpload = require("express-fileupload");
app.use(fileUpload({useTempFiles:true,tempFileDir:"/tmp/"}));

app.get('/' , (req,res)=>console.log("Oye Welcome h ji!"));

const database_connection = require("./config/database");
database_connection();

const cloudinary_connection = require("./config/cloudinary.js");
cloudinary_connection();

const mountRoute = require("./routes/route.js");
app.use("/api/v1" ,mountRoute);

require("dotenv").config();
const port = process.env.PORT || 5000;
app.listen(port , console.log(`Server successfully started at port ${port}`));

