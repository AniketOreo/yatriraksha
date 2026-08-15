import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// RAG Query Handler
// Connects to Gemini API for intelligent responses
router.post('/query', async (req, res) => {
  try {
    const { query, language } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    let finalAnswer = "";

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert highway mechanical assistant and emergency response coordinator named 'YatriRaksha AI'. 
A driver on a national highway is asking you for help or asking a question. 
Please provide a brief, actionable, and safe response. 
If they ask ridiculous, unsafe, or non-driving related questions, kindly remind them you are an emergency driving/mechanical assistant and bring the topic back to road safety or vehicle health.
Use markdown for formatting.

Driver query: "${query}"`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        finalAnswer = response.text();
      } catch (geminiErr) {
        console.error("Gemini API Error:", geminiErr);
        finalAnswer = "⚠️ **AI Diagnostic Error:** Failed to communicate with the intelligent backend. Please pull over safely and contact support if this is an emergency.";
      }
    } else {
      // Intelligent Fallback
      finalAnswer = "🚨 **AI System Offline (Missing API Key)**\n\nYour query was received, but the Gemini AI brain is offline. \n\n*Developer Note:* Please add `GEMINI_API_KEY` to the `server/.env` file to enable dynamic responses.";
    }

    res.json({
      query,
      answer: finalAnswer,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Route Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
