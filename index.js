import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { error, log } from 'console';
import cors from 'cors';
import { exit } from 'process';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-3.1-flash-lite";

app.use(cors());
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log(`server ready on http://localhost:${PORT}`));

app.post('/api/chat', async(req, res) => {
  const {convo} = req.body;
  
  try {
    if(!Array.isArray(convo)) throw new Error('Message must be an Array');

    const contents = convo.map(({role, text}) => ({
      role,
      parts: [{text}]
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.2,
        systemInstruction: "Kamu adalah tutor pemrograman untuk mahasiswa pemula. Jawab dalam bahasa Indonesia. Gunakan bahasa sederhana dan bertahap. Jika user bertanya kode, jelaskan fungsi tiap bagian. Jangan langsung memberi jawaban panjang sebelum konsep dasarnya jelas. Berikan contoh kecil dan latihan singkat di akhir."
      },
    });
    res.status(200).json({result: response.text});

  } catch (e) {
    const status = e?.status || e?.code;

    if (status === 503) {
      return res.status(503).json({
        error: "Model AI sedang ramai digunakan. Coba lagi beberapa saat lagi.",
      });
    }

    res.status(500).json({ error: e.message });
  }
})


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