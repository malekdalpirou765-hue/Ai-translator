async function translateText() {

  const text = document.getElementById("text").value;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content:
            `Translate professionally to English: ${text}`
          }
        ]
      })
    }
  );

  const data = await response.json();

  document.getElementById("result").innerText =
    data.choices[0].message.content;
}