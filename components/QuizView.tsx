
import React from 'react';
import { Question } from '../types';

interface QuizViewProps {
  questions: Question[];
  userAnswers: number[];
  onAnswerChange: (questionIndex: number, answerIndex: number) => void;
  onSubmit: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, userAnswers, onAnswerChange, onSubmit }) => {
  const allQuestionsAnswered = userAnswers.every(answer => answer !== -1);

  return (
    <div className="flex flex-col gap-8">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">
            <span className="text-purple-400 mr-2">{qIndex + 1}.</span> {q.questionText}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options.map((option, oIndex) => {
              const isSelected = userAnswers[qIndex] === oIndex;
              return (
                <button
                  key={oIndex}
                  onClick={() => onAnswerChange(qIndex, oIndex)}
                  className={`w-full text-left p-3 rounded-md border-2 transition-all duration-200 text-slate-300
                    ${isSelected 
                        ? 'bg-purple-600 border-purple-500 ring-2 ring-purple-400' 
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-purple-500'
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={!allQuestionsAnswered}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
};
