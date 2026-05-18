export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ result: "Method not allowed" });
  }

  try {
    const { text, from, to } = req.body || {};

    if (!text) {
      return res.status(400).json({ result: "No text provided" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Translate from ${from} to ${to}:

${text}`
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      result: data?.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    return res.status(500).json({
      result: "Server error"
    });
  }
}