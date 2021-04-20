const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventAssign = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculties",
      index: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      index: true,
    },
    status: {
      type: Boolean,
      index: true,
      required: true,
      default: false,
    },
    credentialsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'credentials',
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

module.exports = mongoose.model("eventassigns", EventAssign);