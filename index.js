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
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "YOUR_API_KEY_HERE"}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Translate from ${from} to ${to}:\n\n${text}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Status:", response.status, errorText);
        setResult(`Server Error: Status ${response.status}. Please check your API key.`);
        return;
      }

      const data = await response.json();
      const translatedText = data?.choices?.[0]?.message?.content;

      if (translatedText) {
        setResult(translatedText);
      } else {
        setResult("No translated text received from AI.");
      }

    } catch (error) {
      console.error("Translation Error:", error);
      setResult("Network error or unexpected issue occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div style={{
      backgroundColor: "#0d1b2a",
      color: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>AI Translator</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          style={{
            width: "100%",
            height: "80px",
            borderRadius: "8px",
            padding: "8px",
            border: "none",
            backgroundColor: "#b5b5b5",
            color: "#000000",
            fontSize: "16px",
            marginBottom: "15px",
            boxSizing: "border-box"
          }}
        />

        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#b5b5b5",
            border: "none",
            fontSize: "16px",
            marginBottom: "10px"
          }}
        >
          <option value="Arabic">Arabic</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>

        <button
          onClick={handleSwapLanguages}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#1e3a5f",
            color: "#ffffff",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          ⇅ Swap Languages
        </button>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#b5b5b5",
            border: "none",
            fontSize: "16px",
            marginBottom: "15px"
          }}
        >
          <option value="Arabic">Arabic</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>

        <button
          onClick={handleTranslate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: loading ? "#555" : "#2563eb",
            color: "#ffffff",
            border: "none",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px"
          }}
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {result && (
          <div style={{
            backgroundColor: "#1e3a5f",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "16px",
            lineHeight: "1.5"
          }}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
