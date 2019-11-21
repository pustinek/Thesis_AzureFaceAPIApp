const mongoose = require("mongoose");
const Image = require("./Image").schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "guest"
  },
  date: {
    type: Date,
    default: Date.now
  },
  person: {
    type: String
  },
  images: [Image],
  azure: {
    personGroupId: { type: String, default: "" },
    personGroupPersonId: { type: String, default: "" },
    syncDate: { type: Date, default: null }
  }
});

module.exports = User = mongoose.model("user", UserSchema);
