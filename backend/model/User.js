const mongoose = require("mongoose");

const User = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio:{
        type: String,
        default:""
    },
    skills:{
        type:[String],
        default:[]
    },
    profilePic:{
        type:String,
        default:""
    }

})

module.exports = mongoose.model("User" , User);