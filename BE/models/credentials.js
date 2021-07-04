const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Credentials = new Schema(
    {
        name: {
            type: String,
            index: true,
            required:true
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

module.exports = mongoose.model("credentials", Credentials);