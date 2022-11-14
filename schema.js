const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  name: String,
  text: String,
});

const Message = mongoose.model("message", MessageSchema);

module.exports = Message;
