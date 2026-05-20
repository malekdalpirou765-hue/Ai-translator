export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const boundary = req.headers["content-type"].split("boundary=")[1];
    const bodyStr = buffer.toString("binary");

    const parts = bodyStr.split("--" + boundary);
    let imageBuffer = null;
    let mimeType = "image/jpeg";

    for (const part of parts) {
      if (part.includes("Content-Disposition") && part.includes("name=\"image\"")) {
        const match = part.match(/Content-Type: ([^\r\n]+)/);
        if (match) mimeType = match[1].trim();
        const dataStart = part.indexOf("\r\n\r\n") + 4;
        const dataEnd = part.lastIndexOf("\r\n");
        const binaryData = part.substring(dataStart, dataEnd);
        imageBuffer = Buffer.from(binaryData, "binary");
        break;
      }
    }

    if (!imageBuffer) {
      return res.status(400).json({ error: "No image found" });
    }

    const base64Image = imageBuffer.toString("base64");

    const formData = new URLSearchParams();
    formData.append("base64Image", `data:${mimeType};base64,${base64Image}`);
    formData.append("language", "ara");
    formData.append("isOverlayRequired", "false");
    formData.append("detectOrientation", "true");
    formData.append("scale", "true");
    formData.append("OCREngine", "2");

    const ocrRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        "apikey": process.env.OCR_SPACE_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString()
    });

    const ocrData = await ocrRes.json();

    const extractedText = ocrData?.ParsedResults?.[0]?.ParsedText;

    if (!extractedText || extractedText.trim() === "") {
      return res.status(200).json({ text: null });
    }

    return res.status(200).json({ text: extractedText.trim() });

  } catch (error) {
    console.error("OCR error:", error);
    return res.status(500).json({ error: "OCR failed" });
  }
}
