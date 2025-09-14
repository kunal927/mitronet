const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.models.Signup || mongoose.model("Signup", SignupSchema);
