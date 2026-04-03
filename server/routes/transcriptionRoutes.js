// routes/transcriptionRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { AssemblyAI } = require("assemblyai");
const Audio = require("../models/Audio");

// 🔑 AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// 🗂️ Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("audio");

// 🚀 Upload route
router.post("/upload", (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("🔥 MULTER ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      console.log("🔥 Inside upload route");

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;

      // ✅ Read file buffer
      const audioData = fs.readFileSync(filePath);

      // ✅ Send to AssemblyAI
      const transcript = await client.transcripts.transcribe({
        audio: audioData,
        speech_models: ["universal-2"], // optional
        language_code: "en",
      });

      console.log("Transcription text:", transcript.text);
      console.log("Words:", transcript.words);

      // ✅ Save to DB
      const saved = await Audio.create({
        filename: req.file.filename,
        transcription: transcript.text,
      });

      // ✅ Send response
      res.json({
        filename: req.file.filename,
        transcription: transcript.text,
        words: transcript.words,
      });

      // 🔥 Optional: Delete local file to save space
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error("🔥 ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  });
});

module.exports = router;