import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const sendFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    

    const formData = new FormData();
    formData.append("audio", file);

   const res = await axios.post(
  "http://127.0.0.1:5000/api/upload",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

    setText(res.data.text);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={sendFile}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
      >
        Upload
      </button>

      <p className="mt-4">{text}</p>
    </div>
  );
}