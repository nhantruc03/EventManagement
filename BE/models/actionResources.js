const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const actionResources = new Schema(
    {
        actionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "actions",
            index: true,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true,
            required: true
        },
        url: {
            type: String,
            required: true,
            index: true
        },
        extension: {
            type: String,
            required: true,
            index: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("actionresources", actionResources);