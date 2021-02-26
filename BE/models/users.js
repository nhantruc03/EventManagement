const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Users = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      index: true,
      required: true
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
    phone: {
      type: String,
      required: true,
      index: true,
      minlength: 10
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    gender: {
      type: String,
      index: true,
      required: true,
      enum: ["nam", "nữ"],
      default: "nam"
    },
    photoURL: {
      type: String,
      index: true,
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