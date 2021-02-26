const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Guests = new Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "events",
            index: true,
        },
        name: {
            type: String,
            index: true,
            required: true,
            default: false,
        },
        status: {
            type: Boolean,
            index: true,
            required: true,
            default: false,
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

module.exports = mongoose.model("guests", Guests);