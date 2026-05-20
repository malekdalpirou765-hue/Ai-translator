export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ result: "Method Not Allowed" });
  }

  const { text, from, to } = req.body || {};

  if (!text) {
    return res.status(400).json({ result: "No text provided" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY_V2}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Translate the following text from ${from} to ${to}. Reply with only the translation, nothing else:\n\n${text}`
          }
        ]
      })
    });

    const data = await response.json();
    const translated = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ result: translated || "No translation received." });

  } catch (error) {
    console.error("Translation error:", error);
    return res.status(500).json({ result: "Server error. Please try again." });
  }
}
