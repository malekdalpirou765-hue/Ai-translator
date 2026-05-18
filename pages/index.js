import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState("Arabic");
  const [to, setTo] = useState("English");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) {
      setResult("Please enter text to translate");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to })
      });

      const data = await res.json();
      setResult(data.result || "No translation received.");
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const languages = ["Arabic", "English", "French", "Spanish", "German", "Italian", "Turkish", "Chinese"];

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
          onClick={handleTranslate}
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
            marginBottom: "20px"
          }}
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {result && (
          <div style={{
            backgroundColor: "#1e3a5f",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap"
          }}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
