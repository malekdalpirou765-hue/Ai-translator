export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ result: "Method Not Allowed" });
  }

  try {
    const { text, from, to } = req.body || {};

    if (!text) {
      return res.status(400).json({ result: "No text provided" });
    }

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
            content: `Translate from ${from} to ${to}:\n\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", response.status, errorText);
      return res.status(500).json({ result: `API Error: ${response.status}` });
    }

    const data = await response.json();
    const translated = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ result: translated || "No translation received" });

  } catch (error) {
    console.error("Handler Error:", error);
    return res.status(500).json({ result: "Internal server error" });
  }
}
