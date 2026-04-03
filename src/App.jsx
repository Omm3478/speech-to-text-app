import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [words, setWords] = useState([]);
  const [currentText, setCurrentText] = useState("");

  const audioRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setAudioURL(URL.createObjectURL(selected));
    }
  };

  // ✅ FIXED FUNCTION
  const handleUpload = async () => {
    console.log("BUTTON CLICKED");

    if (!file) return alert("Select audio file");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      console.log("Sending request...");

      const res = await axios.post(
        "https://speech-to-text-app-kj2t.onrender.com/api/upload",
        formData
      );

      console.log("RESPONSE:", res.data);

      setWords(res.data.words);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current.play();
      }

    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  // 🎬 Sync subtitles
  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime * 1000;

    let text = "";

    for (let word of words) {
      if (word.start * 1000 <= currentTime) { // ✅ FIXED
        text += word.text + " ";
      } else {
        break;
      }
    }

    setCurrentText(text);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎤 Subtitle Speech App</h2>

      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <br /><br />

      <button onClick={handleUpload}>Upload</button>

      <br /><br />

      {audioURL && (
        <audio
          controls
          src={audioURL}
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
        />
      )}

      <h3>🎬 Subtitles:</h3>
      <div
        style={{
          background: "black",
          color: "white",
          padding: "15px",
          fontSize: "20px",
          width: "400px",
        }}
      >
        {currentText}
      </div>
    </div>
  );
}

export default App;