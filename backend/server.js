require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.status(200).send("Organic Mitra Backend Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Organic Mitra backend is healthy",
  });
});

app.post("/test", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      text: response.text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// =========================
// Pest Identification API
// =========================
app.post("/identify", async (req, res) => {
  try {
    const { prompt, imageData } = req.body;

    if (!prompt || !imageData) {
      return res.status(400).json({
        success: false,
        error: "Missing prompt or imageData",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: prompt,
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData,
          },
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    let result;

    try {
      result = JSON.parse(response.text);
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: "Gemini returned invalid JSON",
        raw: response.text,
      });
    }

    return res.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error("Identify Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Organic Mitra backend running on port ${PORT}`);
});