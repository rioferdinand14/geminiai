import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { log } from 'console';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-3.1-flash-lite";

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log(`server ready on http://localhost:${PORT}`));


app.post('/generate-text', async(req, res) => {
    const {prompt} = req.body;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt
        });

        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
        
    }
});

app.post('/generate-image', upload.single("image"), async(req, res) => {

    const { prompt } = req.body;
    const base64image = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: [
            {text: prompt, type: "text"},
            {inlineData: {data: base64image, mimeType: req.file.mimetype}}
          ],
        });

        res.status(200).json({ result: response.text })
    } catch (e) {
        console.log(e);

        res.status(500).json({ message: e.message });
        
    }
});

app.post("/generate-doc", upload.single("doc"), async (req, res) => {
  const { prompt } = req.body;
  const doc = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: doc, mimeType: req.file.mimetype } },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-audio', upload.single("audio"), async(req, res) => {

    const { prompt } = req.body;
    const audio = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: [
            {text: prompt, type: "text"},
            {inlineData: {data: audio, mimeType: req.file.mimetype}}
          ],
        });

        res.status(200).json({ result: response.text })
    } catch (e) {
        console.log(e);

        res.status(500).json({ message: e.message });
        
    }
});