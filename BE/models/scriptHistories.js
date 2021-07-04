const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scriptHistories = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        scriptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "scripts",
            index: true,
        },
        updateScriptDetailName: {
            type: String,
            index: true,
        },
        oldNameScript: {
            type: String,
            index: true
        },
        newNameScript: {
            type: String,
            index: true
        },
        oldForIdScript: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        newForIdScript: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        scriptDetailId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "scriptDetails",
            index: true,
        },
        oldNameScriptDetail: {
            type: String,
            index: true
        },
        newNameScriptDetail: {
            type: String,
            index: true
        },
        oldDescriptionScriptDetail: {
            type: String,
            index: true
        },
        newDescriptionScriptDetail: {
            type: String,
            index: true
        },
        oldTimeScriptDetail: {
            type: Date,
            index: true
        },
        newTimeScriptDetail: {
            type: Date,
            index: true
        },
        isChangeNameScript: {
            type: Boolean,
            default: false,
            index: true
        },
        isChangeForIdScript: {
            type: Boolean,
            default: false,
            index: true
        },
        isChangeNameScriptDetail: {
            type: Boolean,
            default: false,
            index: true
        },
        isChangeDescriptionScriptDetail: {
            type: Boolean,
            default: false,
            index: true
        },
        isChangeTimeScriptDetail: {
            type: Boolean,
            default: false,
            index: true
        },
        isCreateDetail: {
            type: Boolean,
            default: false,
            index: true
        },
        nameCreateDetail: {
            type: String,
            index: true
        },
        isDeleteDetail: {
            type: Boolean,
            default: false,
            index: true
        },
        nameDeleteDetail: {
            type: String,
            index: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("scriptHistories", scriptHistories);