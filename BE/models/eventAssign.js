const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventAssign = new Schema(
  {
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events",
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

module.exports = mongoose.model("eventassigns", EventAssign);