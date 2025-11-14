import { Question } from '../types';

// The new URL for our secure backend endpoint.
// This assumes the serverless function is deployed at `/api/generate-quiz`.
const API_ENDPOINT = '/api/generate-quiz';

export const generateQuiz = async (context: string): Promise<Question[]> => {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ context }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
            // Use the error message from the backend, or a default one
            throw new Error(errorData.error || `Server responded with status: ${response.status}`);
        }

        const quizData = await response.json();

        // Basic validation
        if (!Array.isArray(quizData)) {
            throw new Error("Received data in an unexpected format from the server.");
        }

        return quizData as Question[];

    } catch (error) {
        console.error("Error calling backend to generate quiz:", error);
        // Re-throw a more user-friendly error message.
        // The error from the fetch might be a network error (e.g., "Failed to fetch")
        // or the custom error we threw above.
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to generate quiz. ${errorMessage}`);
    }
};
