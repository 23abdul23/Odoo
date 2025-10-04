import express from "express";
import multer from "multer";
import path, { parse } from "path";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Initialize Gemini client
const llm = new GoogleGenerativeAI("AIzaSyDbn2XVIfoxwfzTPiwn31nxRbjfdQAgVOw");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Convert image to base64 for Gemini
function imageToBase64(filePath) {
  const data = fs.readFileSync(filePath);
  return data.toString("base64");
}

// Upload and process receipt with Gemini
router.post("/upload", authenticate, upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const base64Image = imageToBase64(filePath);
    console.log("✅ File received:", req.file);
    console.log("🖼️ Base64 length:", base64Image.length);
    console.log("🧾 MIME type:", req.file.mimetype);


    // Use Gemini for OCR + understanding
    const model = llm.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are an expense receipt parser.
      Extract and return a JSON object with the following keys:
      - amount (numeric)
      - date (YYYY-MM-DD)
      - category (one of: Food, Travel, Transportation, Accommodation, Office Supplies, Other)
      - description (short summary)
      If a field is missing, set it to null.
    `;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: base64Image,
        },
      },
    ]);

    const textResponse = result.response.text();
    console.log("🤖 Gemini response:", textResponse);
    // Attempt to parse JSON
    let parsedData;
    try {
      // Remove Markdown code fences and extra formatting
      const cleanText = textResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .replace(/[\r\n]+/g, "\n") // normalize newlines
        .trim();

      parsedData = JSON.parse(cleanText);
    } catch (e) {
      console.warn("⚠️ Failed to parse Gemini JSON, returning raw text.");
      parsedData = { rawResponse: textResponse };
    }
    console.log(parsedData)
    res.json({
      message: "Receipt processed successfully",
      receiptUrl: `/uploads/${req.file.filename}`,
      extractedData: parsedData,
    });
  } catch (error) {
    console.error("Gemini OCR error:", error);
    res.status(500).json({ message: "Error processing receipt" });
  }
});





export default router;
