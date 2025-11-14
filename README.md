
# AI Quiz Generator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fai-quiz-generator-repo)

An intelligent web application that transforms any text content or PDF document into an engaging, interactive multiple-choice quiz using the power of the Google Gemini API.

**[➡️ View Live Demo](https://YOUR_VERCEL_DEPLOYMENT_URL_HERE)**

---

 
*(Replace this with a screenshot of your deployed application)*

## ✨ Features

-   **Dual Input Modes:** Generate quizzes by either pasting raw text or uploading a complete PDF document.
-   **AI-Powered Generation:** Leverages the `gemini-2.5-flash` model to create relevant, high-quality questions and answers based on the provided context.
-   **Interactive Quiz Interface:** A clean and modern UI for taking the quiz, with clear selection states.
-   **Instant Scoring & Feedback:** Receive an immediate score and percentage upon completion.
-   **Learning Focused:** Get detailed, AI-generated explanations for any questions you answered incorrectly.
-   **Secure & Scalable:** Built with a secure backend architecture to protect your API key and deployed on a serverless platform for automatic scaling.
-   **Fully Responsive:** A great user experience on desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
-   **Backend:** [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions) (Node.js)
-   **AI Model:** [Google Gemini API](https://ai.google.dev/)
-   **PDF Processing:** [pdf.js](https://mozilla.github.io/pdf.js/) (client-side)

## 🏗️ Project Architecture

This project uses a modern client-server architecture to ensure security and scalability.

-   **Frontend (Client):** The React application that the user interacts with in their browser. It is responsible for the UI, state management, and capturing user input. It **never** handles the API key directly.
-   **Backend (Serverless Function):** A Node.js function deployed on Vercel. It acts as a secure proxy between the frontend and the Google Gemini API.
    1.  The frontend sends the user's text content to this backend endpoint.
    2.  The serverless function receives the text and securely uses the `API_KEY` (stored as a secret environment variable) to make a request to the Gemini API.
    3.  It receives the generated quiz from Gemini and forwards it back to the frontend.

This separation is critical: **your secret API key is never exposed to the public**, preventing unauthorized use and protecting you from unexpected costs.

## 🚀 Getting Started & Deployment

You can easily deploy your own version of this application to Vercel.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or later)
-   A [GitHub](https://github.com/) account
-   A **Google Gemini API Key**:
    1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    2.  Click "**Create API key in new project**".
    3.  Copy the generated API key.

### Deployment Steps

1.  **Fork/Clone the Repository**
    Fork this repository to your own GitHub account, then clone it to your local machine.

    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    cd YOUR_REPO_NAME
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Deploy to Vercel**
    1.  Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
    2.  On your dashboard, click "**Add New...**" > "**Project**".
    3.  Import the GitHub repository you just cloned.
    4.  Vercel will automatically detect the **Vite** framework preset. You don't need to change any build settings.
    5.  Before deploying, expand the "**Environment Variables**" section.
        -   Add a new variable:
        -   **Name:** `API_KEY`
        -   **Value:** Paste your Google Gemini API key here.
    6.  Click "**Deploy**".

Vercel will build and deploy your application. Once complete, you'll have a public URL for your very own AI Quiz Generator!

### (Optional) Running Locally

To run the application on your local machine for development:

1.  **Create an Environment File**
    In the root of the project, create a new file named `.env`.

2.  **Add Your API Key**
    Add your Gemini API key to the `.env` file:
    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    *Note: The `VITE_` prefix is required by Vite to expose the variable to the frontend for local development purposes. The backend function will use `process.env.API_KEY` when deployed.*

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173` (or whatever URL the terminal shows). The Vercel CLI (included in `npm install`) will automatically run your backend function for local testing.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
