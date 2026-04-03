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

const handleUpload = async () => {
  if (!file) return alert("Select audio file");

  const formData = new FormData();
  formData.append("audio", file);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/upload",
      formData
    );

    setWords(res.data.words);

    // 👇 WRITE YOUR CODE HERE
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // reset
      audioRef.current.muted = false;
      audioRef.current.play(); // autoplay
    }

  } catch (err) {
    console.error(err);
  }
};

  // 🎬 Sync subtitles
  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime * 1000; // convert to ms

    let text = "";

    for (let word of words) {
      if (word.start <= currentTime) {
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