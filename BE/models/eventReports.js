const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventReports = new Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "events",
            required: true,
            index: true,
        },
        eventAssigns: {
            type: Number,
            required: true,
            index: true
        },
        guests: {
            type: Number,
            index: true,
            required: true
        },
        participants: {
            type: Number,
            index: true,
            required: true
        },
        actions: {
            type: Number,
            index: true,
            required: true
        },
        completeAction: {
            type: Number,
            required: true,
            index: true,
        },
        uncompleteAction: {
            type: Number,
            required: true,
            index: true,
        },
        resources: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'actionresources',
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

module.exports = mongoose.model("eventreports", eventReports);