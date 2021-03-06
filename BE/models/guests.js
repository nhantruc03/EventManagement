const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Guests = new Schema(
    {
        guestTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "guesttypes",
            index: true,
        },
        name: {
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