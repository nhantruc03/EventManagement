const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subActions = new Schema(
    {
        actionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "actions",
            index: true,
            required: true
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        endDate: {
            type: Date,
            index: true,
            required: true
        },
        endTime: {
            type: Date,
            index: true,
            required: true
        },
        description: {
            type: String,
            required: true,
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

module.exports = mongoose.model("subactions", subActions);