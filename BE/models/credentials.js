const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Credentials = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true,
        },
        roleId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "roles",
            index: true,
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