const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Events = new Schema(
    {
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
        endDate: {
            type: Date,
            index: true,
            required: true
        },
        address: {
            type: String,
            required: true,
            index: true,
        },
        status:{
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

module.exports = mongoose.model("events", Events);