import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Story Beautifier will be unavailable.");
      throw new Error("GEMINI_API_KEY environment variable is required to run the AI Story Beautifier.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// API Routes
// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy", time: new Date() });
});

// 2. AI Story Beautifier (Refine Bio and Story based on Field / Target Role)
app.post("/api/ai/refine-story", async (req, res) => {
  const { name, rawStory, field, tone = "professional yet creative", keywords = "" } = req.body;

  if (!rawStory || !field) {
    res.status(400).json({ error: "Missing required parameters: rawStory and field are required." });
    return;
  }

  try {
    const client = getGeminiClient();
    
    const systemInstruction = `You are an elite, world-class executive resume writer, developer advocate, and tech storyteller.
Your task is to rewrite a developer's raw bio/story to make it sound incredibly polished, premium, engaging, and professional.
The rewritten story MUST highlight experience, passion, and skillsets relevant to their target field: "${field}".

Rules:
1. Retain the core factual details from their raw story if possible (such as their current work, specific tools, or passion).
2. Adapt the narrative to clearly lean into the requested target field "${field}". For example, if they toggle from an "AI Junior Developer" to a "Creative Frontend Engineer", emphasize visual animations, interactive canvas projects, polished designs, and UX.
3. Keep the length balanced - between 150 to 220 words.
4. Output should be written in the FIRST PERSON (e.g., "I started...", "My focus is...").
5. Return ONLY the final, polished story text. Do not include any intros ("Here is your story:"), headers, markdown code fences, or bullet lists of changes. Just the plain paragraphs of text.`;

    const contents = `Developer Name: ${name || "Ashish Kumar Thyadi"}
Target Field/Role: ${field}
Tone requested: ${tone}
Optional Keywords to emphasize: ${keywords}

Raw Draft of Story:
"""
${rawStory}
"""`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75,
      },
    });

    const refinedText = response.text ? response.text.trim() : "";
    
    res.json({
      success: true,
      refinedStory: refinedText,
    });
  } catch (error: any) {
    console.error("Gemini storytelling error:", error);
    res.status(500).json({ 
      error: "Failed to refine story using AI.", 
      details: error.message || error 
    });
  }
});

// 3. AI Assist for Project Descriptions
app.post("/api/ai/suggest-project", async (req, res) => {
  const { projectTitle, category, tags = [] } = req.body;

  if (!projectTitle) {
    res.status(400).json({ error: "Missing projectTitle." });
    return;
  }

  try {
    const client = getGeminiClient();

    const systemInstruction = `You are a professional software architect and technical writer. 
Write a high-fidelity, polished, 2-paragraph project description and suggest standard technical metrics for a developer portfolio.
Format the output strictly as a JSON object, containing these fields:
- "description": a highly engaging 1-sentence quick elevator pitch.
- "metrics": an array of 3 objects, each having "label" and "value" (e.g. [{"label": "Inference time", "value": "240ms"}, {"label": "Conversion Rate", "value": "+18.4%"}]). High quality engineering metrics are preferred.
- "keyFeatures": an array of 3 bullet highlights of architectural/engineering achievements.
- "story": a short 1-paragraph backstory (about 70 words) explaining why this was built, the visual/technical problem solved, and the engineering impact.

Ensure your entire output is valid JSON, containing no other text or explanation. Do not use Markdown backticks around JSON.`;

    const contents = `Project Name: ${projectTitle}
Category: ${category}
Tech stack tags: ${tags.join(", ")}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    const parsedData = JSON.parse(jsonText);

    res.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error("Gemini project suggest error:", error);
    res.status(500).json({ 
      error: "Failed to create project content with Gemini.", 
      details: error.message || error 
    });
  }
});

// Serve frontend assets
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Started Vite Dev Server middleware");
  } else {
    // Production Mode serving compiled client code in /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from /dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application running on port ${PORT} [Mode: ${process.env.NODE_ENV || "development"}]`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start custom server:", err);
});
