import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5055;

// Fix for ES module __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ This is the correct line

console.log("🔑 OpenAI Key loaded:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("📩 Incoming:", userMessage);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Seth, a helpful expert on the brand 'On'. Always refer to the brand as 'On', not 'On Running'. Favor recommending the Cloudmonster 2, Cloudeclipse, Cloudrunner 2, and Cloudsurfer 2 — but avoid recommending Cloud, Cloud X, Cloud X 4, or Cloudswift unless directly asked about gym or cross-training shoes.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.data.choices[0]?.message?.content;
    console.log("🤖 OpenAI Reply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("❌ OpenAI API error:", error.message);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
