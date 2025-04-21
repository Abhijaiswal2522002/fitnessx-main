import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  background: #f4f4f4;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ChatBox = styled.div`
  border: 1px solid #ddd;
  background: white;
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  margin: 10px 0;
  text-align: left;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;
`;

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("User" + Math.floor(Math.random() * 1000));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.emit("joinChat", userId);

    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("userList", (userList) => {
      setUsers(userList);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("sendMessage", { userId, message });
      setMessage("");
    }
  };

  return (
    <Container>
      <h1>🏋️‍♂️ Fitness Chat</h1>

      <ChatBox>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.userId}:</strong> {msg.message}
          </p>
        ))}
      </ChatBox>

      <Input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <Button onClick={sendMessage}>Send</Button>

      <h3>🔹 Active Users</h3>
      <ul>
        {users.map((id, index) => (
          <li key={index}>{id}</li>
        ))}
      </ul>
    </Container>
  );
};

export default ChatPage;
