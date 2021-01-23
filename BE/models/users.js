const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Users = new Schema(
  {
    //   medicinecategoriesId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "medicinecategories",
    //     index: true,
    //     required: true
    // },
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
     role: {
      type: String,
      required: true,
      enum: ["admin", "doctor", "pharmacist", "staff"],
      default: "staff"
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