const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const actionTypes = new Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "events",
            index: true,
            required: true
        },
        name: {
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

module.exports = mongoose.model("actiontypes", actionTypes);