const mongoose = require("mongoose");

const helpPostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
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