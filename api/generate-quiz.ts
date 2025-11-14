import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This function is now a standard Node.js Serverless Function.
// It has a longer execution timeout than an Edge Function, which is
// better suited for potentially long-running AI API calls.
export default async function handler(
    req: VercelRequest,
    res: VercelResponse,
) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Be more specific in production
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }
    
    // Set CORS headers for the main request
    res.setHeader('Access-Control-Allow-Origin', '*'); // Be more specific in production

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { context } = req.body;

        if (!context || typeof context !== 'string' || context.trim().length < 50) {
            return res.status(400).json({ error: 'Invalid context provided. Must be a string with at least 50 characters.' });
        }
        
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.error("API_KEY environment variable not set on the server.");
            return res.status(500).json({ error: 'Server configuration error. API key is missing.' });
        }

        const ai = new GoogleGenAI({ apiKey: API_KEY });

        const quizSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    questionText: { type: Type.STRING, description: "The text of the quiz question." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 4 possible answers for the question." },
                    correctAnswerIndex: { type: Type.INTEGER, description: "The 0-based index of the correct answer in the 'options' array." },
                    explanation: { type: Type.STRING, description: "A brief explanation of why the correct answer is correct." }
                },
                required: ["questionText", "options", "correctAnswerIndex", "explanation"],
            },
        };

        const prompt = `Based on the following text, generate a multiple-choice quiz with 5 to 10 questions. For each question, provide exactly 4 options. The questions should test understanding of the key concepts in the text.

        Context:
        ---
        ${context}
        ---

        Provide the output in the JSON format defined by the schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        
        const jsonText = response.text;
        if (typeof jsonText !== 'string' || !jsonText.trim()) {
            throw new Error("The AI returned an empty or invalid response. Please try again.");
        }

        const quizData = JSON.parse(jsonText.trim());

        if (!Array.isArray(quizData)) {
            throw new Error("AI returned data in an unexpected format.");
        }

        return res.status(200).json(quizData);

    } catch (error) {
        console.error("Error in serverless function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: `Failed to generate quiz from AI: ${errorMessage}` });
    }
}
