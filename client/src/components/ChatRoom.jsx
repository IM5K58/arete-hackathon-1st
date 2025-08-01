import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const generateAnonymousName = () => {
  const randomNumber = Math.floor(Math.random() * 10000);
  return `익명#${randomNumber}`;
};

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(() => generateAnonymousName());
  const [tempUsername, setTempUsername] = useState(currentUser);

  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (tempUsername.trim() === '') {
      setCurrentUser(generateAnonymousName());
    } else {
      setCurrentUser(tempUsername);
    }
  }, [tempUsername]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat-message", { username: currentUser, message: input });
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#E0F2F7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <button
          style={{
            marginRight: "10px",
            padding: "8px 15px",
            borderRadius: "5px",
            border: "1px solid #4FC3F7",
            backgroundColor: "white",
            color: "#4FC3F7",
            cursor: "pointer",
            fontSize: "0.9em",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s, color 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4FC3F7"; e.currentTarget.style.color = "white"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#4FC3F7"; }}
        >
          회원가입
        </button>
        <button
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#4FC3F7",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9em",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#29B6F6"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4FC3F7"}
        >
          로그인
        </button>
      </div>

      <h2 style={{ color: "#333", marginBottom: "20px" }}>💬 실시간 채팅방</h2>

      <div style={{ marginBottom: "15px", width: "80%", maxWidth: "600px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <input
          type="text"
          value={tempUsername}
          onChange={(e) => setTempUsername(e.target.value)}
          placeholder="내 이름 설정 (비워두면 익명)"
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #B0D0DE",
            flexGrow: 1,
            maxWidth: "200px"
          }}
        />
        <span style={{ color: "#555", fontSize: "1.1em" }}>님으로 채팅합니다.</span>
      </div>

      <div
        style={{
          border: "1px solid #B0D0DE",
          borderRadius: "15px",
          backgroundColor: "white",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "15px",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          width: "80%",
          maxWidth: "600px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.username === currentUser ? "flex-end" : "flex-start",
              backgroundColor: msg.username === currentUser ? "#C8E6C9" : "#E3F2FD",
              borderRadius: "20px",
              padding: "10px 15px",
              marginBottom: "8px",
              maxWidth: "75%",
              wordBreak: "break-word",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <b style={{ color: "#444" }}>{msg.username}:</b> <span style={{ color: "#333" }}>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", width: "80%", maxWidth: "600px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지 입력..."
          style={{
            flexGrow: 1,
            marginRight: "10px",
            padding: "10px 15px",
            borderRadius: "20px",
            border: "1px solid #B0D0DE",
            fontSize: "1em",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#4FC3F7",
            color: "white",
            fontSize: "1em",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#29B6F6"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4FC3F7"}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
