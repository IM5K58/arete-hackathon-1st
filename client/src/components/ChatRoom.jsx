import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("익명");

  useEffect(() => {
    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("chat-message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat-message", { username, message: input });
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💬 실시간 채팅방</h2>
      <div style={{ border: "1px solid black", height: "300px", overflowY: "scroll", marginBottom: "10px", padding: "10px" }}>
        {messages.map((msg, idx) => (
          <div key={idx}><b>{msg.username}:</b> {msg.message}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="메시지 입력"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatRoom;
