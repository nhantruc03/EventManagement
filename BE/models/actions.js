const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Actions = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      index: true,
      required: true
    },
    dependActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "actions",
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
    endDate: {
      type: Date,
      index: true,
      required: true
    },
    note: {
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
    availUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        index: true,
        require: true
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

module.exports = mongoose.model("actions", Actions);