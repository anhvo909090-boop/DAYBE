
import React, { useState, useEffect, useCallback } from 'react';
import { generateGameRound } from '../services/geminiService';
import type { GameRound, GameStatus, GameCategory } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircleIcon, XCircleIcon } from '../components/Icons';

const CategoryButton: React.FC<{ onClick: () => void; label: string; colorClasses: string }> = ({ onClick, label, colorClasses }) => (
    <button onClick={onClick} className={`w-full text-white font-bold py-6 rounded-2xl shadow-lg text-2xl transform hover:scale-105 transition-transform duration-300 ${colorClasses}`}>
        {label}
    </button>
);

const GuessThePicture: React.FC = () => {
  const [category, setCategory] = useState<GameCategory | null>(null);
  const [gameRound, setGameRound] = useState<GameRound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const fetchNewRound = useCallback(async (cat: GameCategory) => {
    setIsLoading(true);
    setError(null);
    setStatus('playing');
    setSelectedAnswer(null);
    setGameRound(null);
    try {
      const round = await generateGameRound(cat);
      setGameRound(round);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategorySelect = (cat: GameCategory) => {
    setCategory(cat);
    fetchNewRound(cat);
  };
  
  const handleAnswer = (option: string) => {
    if (status !== 'playing') return;
    setSelectedAnswer(option);
    if (option === gameRound?.correctAnswer) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };
  
  const handleNext = () => {
      if(category) {
          fetchNewRound(category);
      }
  };

  const getButtonClass = (option: string): string => {
    const baseClass = "w-full text-xl md:text-2xl font-bold p-4 rounded-2xl shadow-md transition-all duration-300 transform disabled:opacity-70 disabled:cursor-not-allowed";
    if (status === 'playing') {
      return `${baseClass} bg-white hover:bg-amber-100 hover:-translate-y-1 text-stone-700`;
    }
    if (option === gameRound?.correctAnswer) {
      return `${baseClass} bg-green-500 text-white scale-105 ring-4 ring-green-300`;
    }
    if (option === selectedAnswer && option !== gameRound?.correctAnswer) {
      return `${baseClass} bg-red-500 text-white`;
    }
    return `${baseClass} bg-stone-200 text-stone-500`;
  };

  if (!category) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-rose-600 mb-2">Đoán Hình Vui Nhộn</h2>
        <p className="text-lg text-stone-500 mb-8">Bé hãy chọn một chủ đề nhé!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <CategoryButton onClick={() => handleCategorySelect('animals')} label="Con Vật" colorClasses="bg-gradient-to-br from-yellow-400 to-orange-500" />
            <CategoryButton onClick={() => handleCategorySelect('plants')} label="Cây Cối" colorClasses="bg-gradient-to-br from-lime-400 to-green-500" />
            <CategoryButton onClick={() => handleCategorySelect('objects')} label="Đồ Vật" colorClasses="bg-gradient-to-br from-cyan-400 to-blue-500" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Đang chuẩn bị câu đố mới cho bé..." />;
  }
  
  if (error) {
    return (
        <div className="text-center p-8 bg-red-100 rounded-lg">
            <h3 className="text-2xl font-bold text-red-700 mb-4">Ối, có lỗi rồi!</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={() => setCategory(null)} className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors">
                Chọn lại chủ đề
            </button>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
        {gameRound && (
            <>
            <div className="w-full aspect-square bg-white rounded-3xl shadow-xl mb-8 p-4 flex items-center justify-center overflow-hidden">
                <img src={gameRound.image} alt="Guess this" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {gameRound.options.map(option => (
                    <button key={option} onClick={() => handleAnswer(option)} disabled={status !== 'playing'} className={getButtonClass(option)}>
                        {option}
                    </button>
                ))}
            </div>
            {status !== 'playing' && (
                <div className="mt-8 text-center p-6 rounded-2xl w-full flex flex-col items-center">
                    {status === 'correct' ? (
                        <div className="flex items-center gap-4 text-green-600">
                             <CheckCircleIcon className="h-12 w-12" />
                             <p className="text-3xl font-bold">Đúng rồi! Bé giỏi quá!</p>
                        </div>
                    ) : (
                         <div className="flex items-center gap-4 text-red-600">
                            <XCircleIcon className="h-12 w-12" />
                            <p className="text-3xl font-bold">Thử lại lần sau nhé!</p>
                        </div>
                    )}
                    <button onClick={handleNext} className="mt-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold py-4 px-10 text-2xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        Câu Tiếp Theo
                    </button>
                </div>
            )}
            </>
        )}
    </div>
  );
};

export default GuessThePicture;
