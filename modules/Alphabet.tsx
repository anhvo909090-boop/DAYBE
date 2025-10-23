
import React from 'react';
import { VIETNAMESE_ALPHABET } from '../constants';

const Alphabet: React.FC = () => {

  const speakLetter = (letter: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ phát âm.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-sky-600 mb-2">Bảng Chữ Cái Tiếng Việt</h2>
      <p className="text-lg text-stone-500 mb-8">Bấm vào một chữ cái để nghe phát âm</p>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 w-full">
        {VIETNAMESE_ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => speakLetter(letter)}
            className="aspect-square flex items-center justify-center bg-white rounded-2xl shadow-lg border-4 border-transparent hover:border-sky-400 hover:scale-110 transform transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-300"
          >
            <span className="text-4xl md:text-5xl font-bold text-stone-700">{letter}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Alphabet;
