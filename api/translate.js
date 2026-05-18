export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ result: "Method Not Allowed" });
  }

  try {
    const { text, from, to } = req.body || {};

    if (!text) {
      return res.status(400).json({ result: "No text provided" });
    }

    const response = await fetch("https://openrouter.ai", {
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
            content: `Translate from ${from || 'auto'} to ${to || 'English'}:\n\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        result: errorData?.error?.message || "OpenRouter API Error" 
      });
    }

    const data = await response.json();

    return res.status(200).json({
      result: data?.choices?.[0]?.message?.content || "NO RESPONSE"
    });

  } catch (error) {
    return res.status(500).json({
      result: error.message || "Server error"
    });
  }
}
