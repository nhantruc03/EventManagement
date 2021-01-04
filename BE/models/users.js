const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Users = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    birthday: {
      type: Date,
      index: true,
      required: true
    },
    address: {
      type: String,
      index: true,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true
    },
    email: {
      type: String,
      index: true,
      required: true
    },
    gender: {
      type: String,
      index: true,
      required: true,
      enum: ["male", "female"],
      default: "male"
    },
    username: {
      type: String,
      required: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
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

module.exports = mongoose.model("users", Users);