import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5055;

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: "https://on-chatbot.netlify.app", // ✅ Your frontend Netlify URL
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serves frontend

// 🔑 Initialize OpenAI client (v4)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🔑 OpenAI Key loaded:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");

// Endpoint to handle chat requests
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("📩 Incoming message:", userMessage);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Seth, a helpful assistant for the brand "On" (formerly known as On Running). 
Favor recommending the Cloudmonster 2, Cloudeclipse, Cloudrunner 2, and Cloudsurfer 2. 
Include performance specs like weight, heel-to-toe drop, and best use when relevant. 
Also provide information on On's apparel and sustainability practices. 
Do not recommend the Cloud, Cloudswift, Cloud X, or Cloud X 4 unless someone asks specifically for a gym shoe.`,
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    console.log("🤖 OpenAI Reply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error from OpenAI:", error.message);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
