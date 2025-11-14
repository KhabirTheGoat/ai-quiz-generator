
import React, { useState, useCallback } from 'react';
import { extractTextFromPdf } from '../utils/pdfExtractor';
import { Loader } from './Loader';

interface QuizInputProps {
    onGenerate: (context: string) => void;
    error: string | null;
}

type InputType = 'text' | 'pdf';

const MAX_TEXT_LENGTH = 10000;

export const QuizInput: React.FC<QuizInputProps> = ({ onGenerate, error }) => {
    const [inputType, setInputType] = useState<InputType>('text');
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);
    
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_TEXT_LENGTH) {
            setText(e.target.value);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setProcessingError(null);
        }
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setProcessingError(null);

        try {
            if (inputType === 'text') {
                if (text.trim().length < 50) {
                   throw new Error("Please provide at least 50 characters of text to generate a meaningful quiz.");
                }
                onGenerate(text);
            } else if (inputType === 'pdf' && file) {
                const extractedText = await extractTextFromPdf(file);
                if (extractedText.trim().length < 50) {
                    throw new Error("The PDF does not contain enough text to generate a meaningful quiz.");
                }
                onGenerate(extractedText);
            } else {
                 throw new Error("Please provide input text or a PDF file.");
            }
        } catch (err) {
            setProcessingError(err instanceof Error ? err.message : "An unknown error occurred.");
            setIsProcessing(false);
        }
        // The parent component will set its own loading state, so we don't need to set isProcessing to false on success.
    }, [inputType, text, file, onGenerate]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex bg-slate-700/50 p-1 rounded-full w-full sm:w-2/3 mx-auto">
                <button 
                    onClick={() => setInputType('text')}
                    className={`w-1/2 rounded-full p-2 text-sm sm:text-base font-semibold transition-colors duration-300 ${inputType === 'text' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                >
                    From Text
                </button>
                <button 
                    onClick={() => setInputType('pdf')}
                    className={`w-1/2 rounded-full p-2 text-sm sm:text-base font-semibold transition-colors duration-300 ${inputType === 'pdf' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                >
                    From PDF
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {inputType === 'text' ? (
                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Paste your text here (e.g., an article, notes, or a chapter)..."
                            className="w-full h-64 p-4 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 resize-none"
                            required
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                            {text.length} / {MAX_TEXT_LENGTH}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800/50 transition-colors duration-300">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-slate-500">PDF file only</p>
                                {fileName && <p className="mt-2 text-sm text-green-400">{fileName}</p>}
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                        </label>
                    </div> 
                )}

                {(error || processingError) && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-center text-sm">
                        {error || processingError}
                    </div>
                )}
                
                <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isProcessing ? <><Loader size="small" /> <span className="ml-2">Processing...</span></> : 'Generate Quiz'}
                </button>
            </form>
        </div>
    );
};
