const mongoose = require("mongoose");
const Postschema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Signup" },
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Signup" }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Signup" },
      userName: String,
      text: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Post", Postschema);
