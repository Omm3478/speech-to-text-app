require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Audio = require("./models/Audio");
const connectDB = require("./config/db");

const app = express();

// 🔥 CORS setup
app.use(cors({
    origin: 'https://omm3478.github.io', // your frontend URL
    methods: ['GET','POST'],
    credentials: true
}));

// 🔥 Connect DB
connectDB();

// 🔥 Middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log("👉 Request hit:", req.method, req.url);
  next();
});

// ✅ Routes
app.use("/api", require("./routes/transcriptionRoutes"));

// Test routes
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});