const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Scripts = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        eventId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "events",
            index: true,
            required: true
        },
        writerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true,
            required: true
        },
        forId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true,
            required: true
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

module.exports = mongoose.model("scripts", Scripts);