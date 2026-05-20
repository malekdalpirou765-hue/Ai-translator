import { useState, useRef } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState("Arabic");
  const [to, setTo] = useState("English");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const languages = ["Arabic", "English", "French", "Spanish", "German", "Italian", "Turkish", "Chinese"];

  const langCodes = {
    Arabic: "ar-SA",
    English: "en-US",
    French: "fr-FR",
    Spanish: "es-ES",
    German: "de-DE",
    Italian: "it-IT",
    Turkish: "tr-TR",
    Chinese: "zh-CN"
  };

  const handleTranslate = async (inputText) => {
    const t = inputText || text;
    if (!t.trim()) {
      setResult("Please enter text to translate");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, from, to })
      });

      const data = await res.json();
      const translation = data.result || "No translation received.";
      setResult(translation);
      speakText(translation);
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    setResult("");
    setText("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.text) {
        setText(data.text);
        handleTranslate(data.text);
      } else {
        setResult("Could not read text from image. Please try another image.");
      }
    } catch (error) {
      setResult("Error reading image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCodes[to] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langCodes[from] || "ar-SA";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setText(spoken);
      handleTranslate(spoken);
    };

    recognition.onerror = () => {
      setListening(false);
      setResult("Could not recognize voice. Please try again.");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div style={{
      backgroundColor: "#0d1b2a",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px" }}>
          AI Translator
        </h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
          rows={4}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#1e3a5f",
            color: "#fff",
            fontSize: "16px",
            marginBottom: "15px",
            boxSizing: "border-box",
            resize: "vertical"
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{
              flex: 1, padding: "12px", borderRadius: "8px",
              backgroundColor: "#1e3a5f", color: "#fff", border: "none", fontSize: "16px"
            }}
          >
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>

          <button
            onClick={swap}
            style={{
              padding: "12px", borderRadius: "8px", backgroundColor: "#2563eb",
              color: "#fff", border: "none", fontSize: "20px", cursor: "pointer"
            }}
          >
            ⇄
          </button>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{
              flex: 1, padding: "12px", borderRadius: "8px",
              backgroundColor: "#1e3a5f", color: "#fff", border: "none", fontSize: "16px"
            }}
          >
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <button
          onClick={() => handleTranslate()}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: loading ? "#444" : "#2563eb",
            color: "#fff",
            border: "none",
            fontSize: "18px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px"
          }}
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        <button
          onClick={listening ? stopListening : startListening}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: listening ? "#dc2626" : "#16a34a",
            color: "#fff",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          {listening ? "🔴 Stop Recording" : "🎤 Speak to Translate"}
        </button>

        <button
          onClick={() => fileInputRef.current.click()}
          disabled={imageLoading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: imageLoading ? "#444" : "#d97706",
            color: "#fff",
            border: "none",
            fontSize: "18px",
            cursor: imageLoading ? "not-allowed" : "pointer",
            marginBottom: "20px"
          }}
        >
          {imageLoading ? "Reading Image..." : "📷 Translate from Image"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />

        {result && (
          <div style={{
            backgroundColor: "#1e3a5f",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            marginBottom: "10px"
          }}>
            {result}
          </div>
        )}

        {result && (
          <button
            onClick={() => speakText(result)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#7c3aed",
              color: "#fff",
              border: "none",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            🔊 Listen to Translation
          </button>
        )}
      </div>
    </div>
  );
}
