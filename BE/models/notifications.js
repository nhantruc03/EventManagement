const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notifications = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true,
            required: true,
        },
        actionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "actions",
            index: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "events",
            index: true,
        },
        name: {
            type: String,
            index: true,
            required: true,
        },
        description: {
            type: String,
            index: true,
            required: true,
        },
        watch: {
            type: Boolean,
            required: true,
            default: false,
            index: true
        },
        status: {
            type: Boolean,
            required: true,
            default: false,
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

module.exports = mongoose.model("notifications", notifications);