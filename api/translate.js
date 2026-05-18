export default async function handler(req, res) {

  const { text, from, to } = req.body;

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
          content: `
You are a professional translator.

Translate from ${from} to ${to}.
Keep meaning natural, fluent, and correct.

Text:
${text}
          `
        }
      ]
    })
  });

  const data = await response.json();

  res.status(200).json({
    result: data.choices?.[0]?.message?.content
  });
}