const mongoose = require("mongoose");
require("dotenv").config();

async function database_connection(){

    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("database connected successfully");
    }
    catch(error){
        console.log("connection failed, reason: ", error );
    }

}

module.exports = database_connection;