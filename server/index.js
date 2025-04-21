import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import UserRoutes from "./routes/User.js";
import { Server } from "socket.io";
import http from "http"; // Import HTTP module



dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = 8080;
const JWT = process.env.JWT;
// Validate environment variables
if (!GOOGLE_API_KEY) {
  console.error("❌ Missing GOOGLE_API_KEY in .env file!");
  process.exit(1);origin
}
if (!MONGODB_URL) {
  console.error("❌ Missing MONGODB_URL in .env file!");
  process.exit(1);
}

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000",
    methods: ["GET", "POST"], }, // Allow all clients
});

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// MongoDB Connection
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

// User Routes
app.use("/api/user", UserRoutes);

// **WebSocket Connection**
let users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (userId) => {
    users[socket.id] = userId;
    io.emit("userList", Object.values(users));
  });

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", { userId: users[socket.id], message: data.message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("userList", Object.values(users));
  });
});
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const responseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    res.json({ reply: responseText });
  } catch (error) {
    console.error("Google Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to process AI request",
      details: error.message || "Unknown error",
    });
  }
});

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 AI Assistant with Google Gemini is running!",
  });
});

// **Global Error Handler**
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

// **Start Server**
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
