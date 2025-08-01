require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// 채팅 모델
const Chat = mongoose.model("Chat", new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
}));

// 소켓 통신
io.on("connection", (socket) => {
  console.log("🟢 연결됨:", socket.id);

  // 이전 채팅 불러오기
  Chat.find().sort({ timestamp: 1 }).limit(100).then(history => {
    socket.emit("chat-history", history);
  });

  // 메시지 수신
  socket.on("chat-message", async ({ username, message }) => {
    const newChat = new Chat({ username, message });
    await newChat.save();
    io.emit("chat-message", newChat);
  });

  socket.on("disconnect", () => {
    console.log("🔴 연결 해제:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("🚀 서버 실행 중: http://localhost:3000");
});
