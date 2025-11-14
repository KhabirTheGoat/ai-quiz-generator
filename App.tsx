
import React, { useState, useCallback } from 'react';
import { QuizInput } from './components/QuizInput';
import { QuizView } from './components/QuizView';
import { QuizResults } from './components/QuizResults';
import { Loader } from './components/Loader';
import { generateQuiz } from './services/geminiService';
import { Question } from './types';

type QuizState = 'idle' | 'generating' | 'taking' | 'results';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = useCallback(async (context: string) => {
    setQuizState('generating');
    setError(null);
    try {
      const questions = await generateQuiz(context);
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
        setUserAnswers(new Array(questions.length).fill(-1));
        setQuizState('taking');
      } else {
        throw new Error("The AI couldn't generate a quiz from the provided text. Please try with a different text or file.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during quiz generation.');
      setQuizState('idle');
    }
  }, []);

  const handleAnswersSubmit = useCallback(() => {
    setQuizState('results');
  }, []);
  
  const handleAnswerChange = useCallback((questionIndex: number, answerIndex: number) => {
    setUserAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[questionIndex] = answerIndex;
        return newAnswers;
    });
  }, []);

  const handleReset = useCallback(() => {
    setQuizState('idle');
    setQuizQuestions([]);
    setUserAnswers([]);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (quizState) {
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader />
            <p className="text-lg text-slate-300">Generating your quiz... This may take a moment.</p>
          </div>
        );
      case 'taking':
        return (
          <QuizView
            questions={quizQuestions}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleAnswersSubmit}
          />
        );
      case 'results':
        return (
          <QuizResults
            questions={quizQuestions}
            userAnswers={userAnswers}
            onReset={handleReset}
          />
        );
      case 'idle':
      default:
        return (
          <QuizInput onGenerate={handleGenerateQuiz} error={error} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            AI Quiz Generator
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Turn any text or PDF into an interactive quiz instantly.
          </p>
        </header>
        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-slate-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
