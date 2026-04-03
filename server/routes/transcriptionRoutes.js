const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { AssemblyAI } = require("assemblyai");
const Audio = require("../models/Audio");

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("audio");

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

      // ✅ AssemblyAI transcription
      const transcript = await client.transcripts.transcribe({
  audio: filePath,
  speech_models: ["universal-2"],
   language_code: "en", // or "universal-3-pro"
});

// 👇 ADD THIS LINE HERE
const words = transcript.words;

console.log("Transcription:", transcript.text);
console.log("Words:", words);

      const saved = await Audio.create({
        filename: req.file.filename,
        transcription: transcript.text,
      });

      // 👇 SEND DATA TO FRONTEND
res.json({
  filename: req.file.filename,
  transcription: transcript.text,
  words: transcript.words,
});

    } catch (err) {
      console.error("🔥 ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  });
});

module.exports = router;