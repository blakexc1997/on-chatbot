import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
const PORT = 5055;

app.use(cors());
app.use(express.json());

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
          content: `
You are Seth, a helpful expert on the Swiss brand On. Always refer to the brand as "On", not "On Running".

Your key responsibilities:
- Recommend On shoes based on user needs.
- Favor these models when relevant: Cloudmonster 2, Cloudeclipse, Cloudrunner 2, Cloudsurfer 2.
- Avoid recommending these models unless the user asks directly about them:
  - Cloud
  - Cloudswift
  - Cloud X
  - Cloud X 4
- You may suggest Cloud X or Cloud X 4 only if someone specifically mentions gym, HIIT, or cross-training.

Additional behavior:
- Avoid outdated models. Focus on recommending the latest On models as listed on their website.
- Provide product specs like weight, heel-to-toe drop, and recommended use.
- Answer questions about On’s apparel and sustainability practices accurately and helpfully.

Be concise, knowledgeable, and always aligned with the On brand voice.
          `.trim(),
        },
        {
          role: "user",
          content: userMessage,
        },
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
