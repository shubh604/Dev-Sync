const mongoose = require("mongoose");
const User = require("../model/User");

const helpPostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [5, "Title must contain at least 5 characters"],
        maxlength: [80, "Title cannot exceed 80 characters"]
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [15, "Title must contain at least 15 characters"],
        maxlength: [500, "Title cannot exceed 500 characters"]
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["open", "resolved"],
        default: "open"
    },

    resolvedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("HelpPost", helpPostSchema);