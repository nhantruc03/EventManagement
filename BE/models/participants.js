const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Participants = new Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "events",
            index: true,
            required: true,
        },
        name: {
            type: String,
            index: true,
        },
        mssv: {
            type: String,
            index: true,
        },
        phone: {
            type: String,
            index: true,
            minlength: 10
        },
        email: {
            type: String,
            index: true,
        },
        status: {
            type: Boolean,
            index: true,
            required: true,
            default: true,
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

module.exports = mongoose.model("participants", Participants);