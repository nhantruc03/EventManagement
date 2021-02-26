const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScriptDetails = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        scriptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "scripts",
            index: true,
            required: true
        },
        description: {
            type: String,
            required: true,
            index: true
        },
        time: {
            type: Date,
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

module.exports = mongoose.model("scriptDetails", ScriptDetails);