const express = require("express");
require("dotenv").config();
const cors = require("cors");
const socket = require("socket.io");
const Message = require("./schema");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.get("/", async (req, res) => {
  const allMessage = await Message.find();
  res.send(allMessage);
});

const { PORT, MONGO_URL } = process.env;
mongoose.connect(MONGO_URL);

const server = app.listen(PORT, () => console.log("server is running"));

const io = socket(server, {
  cors: { origin: "http://localhost:3000", credential: true },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (user) => {
    onlineUsers.set(user.id, socket.id);
    console.log(onlineUsers.size);
    socket.broadcast.emit("onlineUsers", onlineUsers.size);
  });

  socket.on("sendMessage", (data) => {
    const message = new Message(data);
    console.log(message);
    message.save();
    socket.broadcast.emit("onlineMessage", data);
  });

  socket.on("disconnect", (id) => {
    onlineUsers.delete(id);
    socket.broadcast.emit("onlineUsers", onlineUsers.size);
  });
});
