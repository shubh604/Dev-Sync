require("dotenv").config();

const express = require("express");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const fileUpload = require("express-fileupload");
app.use(fileUpload({useTempFiles:true,tempFileDir:"/tmp/"}));

const cors = require("cors");
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.get('/' , (req,res)=>console.log("Oye Welcome h ji!"));

const database_connection = require("./config/database");
database_connection();

const cloudinary_connection = require("./config/cloudinary.js");
cloudinary_connection();

const mountRoute = require("./routes/route.js");
app.use("/api/v1" ,mountRoute);



const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: process.env.FRONTEND_URL,
        credentials:true
    }
});

const ChatController = require("./socket");
ChatController(io);

const port = process.env.PORT || 5000;

server.listen(port , ()=>{
    console.log(`Server successfully started at port ${port}`);
});