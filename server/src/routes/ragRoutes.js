import express from 'express';

const router = express.Router();

// Mock / Sample RAG Query Handler for demonstration
// Connects to Gemini API and searches technical datasets
router.post('/query', async (req, res) => {
  try {
    const { query, language } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    // Simulated RAG Context Retrieval & AI Response Generation
    const mockContext = [
      "Tata Signa Overheating Protocol (Page 42): Coolant temperature warning light indicates coolant overheating or low fluid. Step 1: Immediately pull vehicle to safe highway shoulder. Step 2: Allow engine to idle for 2 minutes before shutdown. Do NOT open pressure cap while hot.",
      "Motor Vehicles Act 2019 Section 194B: Overweight penalty structure across state borders requires valid e-Way bill extension if transit delay exceeds 24 hours due to breakdown."
    ];

    const isCoolantQuery = query.toLowerCase().includes('coolant') || query.toLowerCase().includes('coolant') || query.toLowerCase().includes('तापमान') || query.toLowerCase().includes('engine');

    const mockAnswer = isCoolantQuery
      ? "🚨 **Tata Signa Engine Overheating Protocol:**\n\n1. **Stop Safely:** Immediately pull over onto the highway shoulder and turn on hazard lights.\n2. **Idle Engine:** Allow the engine to idle for 2 minutes before turning off the ignition.\n3. **Do NOT open the radiator cap:** High pressure steam can cause severe burns.\n4. **Check Radiator Leaks:** Visually inspect underneath for fluid leaks after 10 minutes.\n5. **Support Dispatched:** Nearby verified mechanics on NH-44 have been highlighted on your console."
      : `Based on official Motor Vehicles Act guidelines and repair manuals:\n\nFor issue "${query}", please ensure your vehicle remains on the highway shoulder. Verified documentation requires valid E-Way bills during breakdown transit delays.`;

    res.json({
      query,
      answer: mockAnswer,
      contextUsed: mockContext,
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
