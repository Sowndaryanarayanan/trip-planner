import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// 🔑 PASTE YOUR HUGGING FACE TOKEN HERE
const HF_API_KEY = "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";

// ✅ HUGGING FACE OPENAI-COMPATIBLE ROUTER
const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";

app.use(bodyParser.json());
app.use(express.static("."));

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log("PROMPT:", prompt);

    const response = await fetch(HF_CHAT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("HF RESPONSE:", data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: "No response from model", raw: data });
    }

    res.json({ text: data.choices[0].message.content });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
