require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Audio = require("./models/Audio");
const connectDB = require("./config/db");

const app = express();

// 🔥 Connect DB
connectDB();

// 🔥 Middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("👉 Request hit:", req.method, req.url);
  next();
});

// ✅ 👉 WRITE THIS LINE HERE
app.use("/api", require("./routes/transcriptionRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("API running");
});
app.get("/all", async (req, res) => {
  try {
    const data = await Audio.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Start server
app.listen(5000, () => console.log("Server running on port 5000"));