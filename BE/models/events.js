const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Events = new Schema(
    {
        eventTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "eventtypes",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        startDate: {
            type: Date,
            index: true,
            required: true
        },
        startTime: {
            type: Date,
            index: true,
            required: true
        },
        description: {
            type: String,
            index: true,
            required: true
        },
        address: {
            type: String,
            required: true,
            index: true,
        },
        posterUrl: {
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
        tagId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'tags',
                index: true,
            }
        ],
        availUser: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                index: true,
            }
        ],
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("events", Events);