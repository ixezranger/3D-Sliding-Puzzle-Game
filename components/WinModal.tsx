
import React from 'react';

interface WinModalProps {
  imageSrc: string;
  onPlayAgain: () => void;
  moves: number;
  time: number; // in seconds
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const WinModal: React.FC<WinModalProps> = ({ imageSrc, onPlayAgain, moves, time }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 text-center flex flex-col items-center animate-slide-up">
        <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">You Win!</h2>
        <div className="flex space-x-8 my-4 text-slate-300">
          <div>
            <div className="text-sm text-slate-400">Moves</div>
            <div className="text-3xl font-bold text-white">{moves}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Time</div>
            <div className="text-3xl font-bold text-white">{formatTime(time)}</div>
          </div>
        </div>
        <div className="relative my-6 p-2 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg shadow-2xl">
          <img 
            src={imageSrc} 
            alt="Completed puzzle" 
            className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-md"
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-50 animate-pulse-slow -z-10"></div>
        </div>
        <button
          onClick={onPlayAgain}
          className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-slow {
          50% { opacity: 0.8; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out 0.2s forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default WinModal;
