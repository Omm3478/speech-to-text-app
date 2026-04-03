const fs = require("fs");
const OpenAI = require("openai");
const Audio = require("../models/Audio");   // ✅ correct path

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.uploadAudio = async (req, res) => {
  try {
    const filePath = req.file.path;

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-transcribe",
    });

    // 🔥 SAVE TO DB
    const saved = await Audio.create({
      filename: req.file.filename,
      transcription: response.text,
    });

    res.json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};