const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ActionAssign = new Schema(
  {
    actionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "actions",
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        index: true,
    },
    role: {
      type: Number,
      index: true,
      required: true,
      enum: [1, 2],
      default: 2
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

module.exports = mongoose.model("actionassigns", ActionAssign);