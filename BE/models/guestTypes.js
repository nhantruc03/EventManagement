const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guestTypes = new Schema(
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
            unique: true,
            required: true,
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

module.exports = mongoose.model("guesttypes", guestTypes);