async function translateText() {

  const text = document.getElementById("text").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      from,
      to
    })
  });

  const data = await res.json();.

  document.getElementById("result").innerText =
    data.result || "Error";
}