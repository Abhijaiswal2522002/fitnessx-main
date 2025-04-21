import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";

// Styled Components
const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ChatBox = styled.div`
  width: 350px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.9)")};
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  transition: all 0.3s ease-in-out;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const Header = styled.div`
  background: #007bff;
  color: white;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  height: 250px;
  overflow-y: auto;
  padding: 10px;
  background: #f1f1f1;
`;

const Message = styled.div`
  padding: 8px;
  margin: 5px 0;
  border-radius: 5px;
  max-width: 80%;
  word-wrap: break-word;
  align-self: ${({ sender }) => (sender === "user" ? "flex-end" : "flex-start")};
  background: ${({ sender }) => (sender === "user" ? "#007bff" : "#ddd")};
  color: ${({ sender }) => (sender === "user" ? "white" : "black")};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background: white;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-left: 5px;
  cursor: pointer;
  border-radius: 5px;
`;

const ToggleButton = styled.button`
  background: #007bff;
  color: white;
  padding: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: background 0.3s;
  
  &:hover {
    background: #0056b3;
  }
`;

const FitnessAI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:8080/api/chat", {
        message: input,
      });

      const botReply = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botReply]);
      setError(null);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setError("⚠️ Failed to fetch response. Please try again.");
    }

    inputRef.current?.focus();
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatContainer>
      {/* Chat Toggle Button */}
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </ToggleButton>

      {/* Chatbox */}
      <ChatBox isOpen={isOpen}>
        <Header>
          <span>AI Fitness Assistant</span>
          <FaTimes style={{ cursor: "pointer" }} onClick={() => setIsOpen(false)} />
        </Header>

        <MessagesContainer>
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender}>
              {msg.text}
            </Message>
          ))}
          <div ref={chatRef}></div>
        </MessagesContainer>

        {error && <p style={{ color: "red", textAlign: "center", margin: "5px 0" }}>{error}</p>}

        <InputContainer>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask me about fitness..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <SendButton onClick={sendMessage}>
            <FaPaperPlane />
          </SendButton>
        </InputContainer>
      </ChatBox>
    </ChatContainer>
  );
};

export default FitnessAI;
