'use client';
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, PartyPopper } from 'lucide-react';

export default function DailyQuiz() {
  const [quizData, setQuizData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/v1/content/daily')
      .then(res => res.json())
      .then(data => setQuizData(data.learn.quiz))
      .catch(err => console.error(err));
  }, []);

  if (!quizData) return <div className="p-4 text-center">Loading daily quiz...</div>;

  const handleAnswer = (id: string) => {
    if (selectedAnswer) return; // Prevent multiple answers
    setSelectedAnswer(id);
    setIsCorrect(id === quizData.correctAnswer);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 my-6">
      {quizData.image && (
        <div className="w-full h-48 bg-gray-200 relative">
          <img src={quizData.image} alt="Quiz visual context" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <h3 className="text-white font-black text-xl drop-shadow-md">Daily Quiz</h3>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {!quizData.image && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Daily Quiz</h3>
          </div>
        )}
        
        <p className="text-gray-800 font-bold text-lg mb-6 leading-snug">{quizData.question}</p>
        
        <div className="space-y-3 mb-2">
          {quizData.options.map((opt: any) => {
            let btnClass = "w-full text-left px-5 py-3.5 rounded-2xl border-2 transition-all flex items-center justify-between font-medium ";
            
            if (selectedAnswer) {
              if (opt.id === quizData.correctAnswer) {
                btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm";
              } else if (opt.id === selectedAnswer && !isCorrect) {
                btnClass += "bg-red-50 border-red-500 text-red-900";
              } else {
                btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-70";
              }
            } else {
              btnClass += "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-900 text-gray-700 shadow-sm";
            }

            return (
              <button 
                key={opt.id} 
                onClick={() => handleAnswer(opt.id)}
                className={btnClass}
                disabled={!!selectedAnswer}
              >
                <span className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedAnswer && opt.id === quizData.correctAnswer ? 'bg-emerald-200 text-emerald-800' :
                    selectedAnswer && opt.id === selectedAnswer && !isCorrect ? 'bg-red-200 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {opt.id}
                  </span>
                  {opt.text}
                </span>
                {selectedAnswer && opt.id === quizData.correctAnswer && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                {selectedAnswer && opt.id === selectedAnswer && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className={`mt-6 p-4 rounded-2xl text-center font-bold text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? <><PartyPopper size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Awesome! That&apos;s correct!</> : "Not quite right. Try again tomorrow!"}
          </div>
        )}
      </div>
    </div>
  );
}
