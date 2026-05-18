module.exports = async (req, res) => {
  try {
    const { text, from, to } = req.body || {};

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
            content: "Say ONLY: OK WORKING"
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      raw: data,
      result: data?.choices?.[0]?.message?.content || "NO RESPONSE"
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};