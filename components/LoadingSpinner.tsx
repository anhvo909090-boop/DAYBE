
import React from 'react';

interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-sky-500"></div>
      <p className="text-xl font-semibold text-stone-600 mt-6">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
