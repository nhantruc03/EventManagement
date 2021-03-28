const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatMessages = new Schema(
    {
        groupID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "groups",
            index: true,
            required: true
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true,
            required: true
        },
        text: {
            type: String,
            index: true
        },
        resourceUrl: {
            type: String,
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

module.exports = mongoose.model("chatmessages", ChatMessages);