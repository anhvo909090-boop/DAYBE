
import React, { useState } from 'react';
import Alphabet from './modules/Alphabet';
import GuessThePicture from './modules/GuessThePicture';
import { HomeIcon, BookOpenIcon, PhotographIcon, ArrowLeftIcon } from './components/Icons';

type View = 'home' | 'alphabet' | 'guessThePicture';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-amber-600 mb-4 tracking-tight">Bé Vui Học</h1>
        <p className="text-xl text-stone-600 mb-12">Cùng bé khám phá thế giới diệu kỳ!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            <button
                onClick={() => setView('alphabet')}
                className="group bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center"
            >
                <BookOpenIcon className="h-20 w-20 mb-4" />
                <span className="text-3xl font-bold">Học Bảng Chữ Cái</span>
            </button>
            <button
                onClick={() => setView('guessThePicture')}
                className="group bg-gradient-to-br from-rose-400 to-red-500 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center"
            >
                <PhotographIcon className="h-20 w-20 mb-4" />
                <span className="text-3xl font-bold">Đoán Hình Vui Nhộn</span>
            </button>
        </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'alphabet':
        return <Alphabet />;
      case 'guessThePicture':
        return <GuessThePicture />;
      case 'home':
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">
      <header className="p-4 flex items-center justify-between bg-white/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-amber-700 flex items-center gap-2">
            <HomeIcon className="h-8 w-8 text-amber-500" />
            <span>Bé Vui Học</span>
        </h2>
        {view !== 'home' && (
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-full hover:bg-amber-600 transition-colors shadow-md"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Trang Chủ
          </button>
        )}
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
