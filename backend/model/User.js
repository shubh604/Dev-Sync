const mongoose = require("mongoose");

const User = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
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
    },
    status: {
        type: String,
        default: "offline"
    },
    lastSeen:{
        type:Date,
        default:Date.now()
    },
    pendingRequestCount: {
    type:Number,
    default:0
    },

    unreadMessageCount: {
        type:Number,
        default:0
    }

})

module.exports = mongoose.model("User" , User);