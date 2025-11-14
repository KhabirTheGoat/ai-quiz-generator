
import React from 'react';
import { Question } from '../types';

interface QuizResultsProps {
    questions: Question[];
    userAnswers: number[];
    onReset: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ questions, userAnswers, onReset }) => {
    const score = userAnswers.reduce((acc, answer, index) => {
        return answer === questions[index].correctAnswerIndex ? acc + 1 : acc;
    }, 0);

    const scorePercentage = Math.round((score / questions.length) * 100);

    const getScoreColor = () => {
        if (scorePercentage >= 80) return 'text-green-400';
        if (scorePercentage >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-center bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                <h2 className="text-2xl font-bold text-slate-200 mb-2">Quiz Complete!</h2>
                <p className="text-lg text-slate-400">Your score:</p>
                <p className={`text-6xl font-extrabold my-2 ${getScoreColor()}`}>
                    {score} <span className="text-4xl text-slate-400">/ {questions.length}</span>
                </p>
                <p className={`text-2xl font-bold ${getScoreColor()}`}>{scorePercentage}%</p>
            </div>

            <div className="flex flex-col gap-6">
                {questions.map((q, qIndex) => {
                    const userAnswer = userAnswers[qIndex];
                    const isCorrect = userAnswer === q.correctAnswerIndex;

                    return (
                        <div key={qIndex} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-600/50 bg-green-900/20' : 'border-red-600/50 bg-red-900/20'}`}>
                            <h3 className="text-md font-semibold text-slate-300 mb-3">{qIndex + 1}. {q.questionText}</h3>
                            <div className="flex flex-col gap-2">
                                {q.options.map((option, oIndex) => {
                                    const isCorrectAnswer = oIndex === q.correctAnswerIndex;
                                    const isSelectedAnswer = oIndex === userAnswer;

                                    let optionClass = 'border-slate-700 bg-slate-800 text-slate-400'; // Default
                                    if(isCorrectAnswer) {
                                        optionClass = 'border-green-500 bg-green-800/50 text-white ring-2 ring-green-500';
                                    } else if(isSelectedAnswer && !isCorrect) {
                                        optionClass = 'border-red-500 bg-red-800/50 text-white';
                                    }

                                    return (
                                        <div key={oIndex} className={`p-2 rounded-md border ${optionClass}`}>
                                            {option}
                                        </div>
                                    );
                                })}
                            </div>
                             {!isCorrect && (
                                <div className="mt-3 p-3 bg-yellow-900/30 rounded-md text-yellow-300 text-sm border border-yellow-700/50">
                                    <strong className="font-bold">Explanation:</strong> {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex justify-center">
                <button
                    onClick={onReset}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 transform hover:scale-105"
                >
                    Create New Quiz
                </button>
            </div>
        </div>
    );
};
