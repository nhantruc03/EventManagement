const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Groups = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
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

module.exports = mongoose.model("groups", Groups);