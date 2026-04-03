const mongoose = require("mongoose");

const AudioSchema = new mongoose.Schema({
  filename: String,
  transcription: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Audio", AudioSchema);