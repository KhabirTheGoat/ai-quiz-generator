import { GoogleGenAI, Type } from "@google/genai";

// This file is a serverless function deployed at `/api/generate-quiz`.
// The hosting platform (like Vercel) is configured to run this file when that endpoint is requested.
// You must set the `API_KEY` as a secret environment variable in your hosting platform.

// The handler signature is compatible with platforms that support the standard Request/Response Web APIs (like Vercel Edge Functions).
export default async (req: Request): Promise<Response> => {
    // Add CORS headers to allow requests from your frontend
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // In production, restrict this to your domain
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders, status: 204 });
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    try {
        const { context } = await req.json();

        if (!context || typeof context !== 'string' || context.trim().length < 50) {
            return new Response(JSON.stringify({ error: 'Invalid context provided. Must be a string with at least 50 characters.' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.error("API_KEY environment variable not set on the server.");
            return new Response(JSON.stringify({ error: 'Server configuration error. API key is missing.' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
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

        return new Response(JSON.stringify(quizData), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error in serverless function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return new Response(JSON.stringify({ error: `Failed to generate quiz from AI: ${errorMessage}` }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
};