import React, { useState, useCallback, useEffect } from 'react';
import ImageSelector from './components/ImageSelector';
import DifficultySelector from './components/DifficultySelector';
import GameBoard from './components/GameBoard';
import WinModal from './components/WinModal';
import Leaderboard from './components/Leaderboard';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { useTimer } from './hooks/useTimer';
import type { ScoreEntry, User } from './types';
import { initAudio } from './utils/sound';

type GameState = 'selecting' | 'playing' | 'won';
type View = 'setup' | 'leaderboard';

const DEFAULT_IMAGES = [
  'https://khalifahterritory.com/wp-content/uploads/2025/10/xive_cute_cat_01.jpg?q=80&w=400&h=400&auto=format&fit=crop',
  'https://khalifahterritory.com/wp-content/uploads/2025/10/xive_cute_cat_02.jpg?q=80&w=400&h=400&auto=format&fit=crop',
  'https://khalifahterritory.com/wp-content/uploads/2025/10/xive_cute_cat_03.jpg?q=80&w=400&h=400&auto=format&fit=crop',
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [view, setView] = useState<View>('setup');
  const [image, setImage] = useState<string>(DEFAULT_IMAGES[0]);
  const [gridSize, setGridSize] = useState<number | null>(null);
  const { user, signIn, signOut } = useAuth();
  const { time, startTimer, stopTimer, resetTimer } = useTimer();
  const [lastGameStats, setLastGameStats] = useState<{moves: number, time: number} | null>(null);

  const handleImageSelect = useCallback((selectedImage: string) => {
    initAudio();
    setImage(selectedImage);
  }, []);

  const handleDifficultySelect = useCallback((size: number) => {
    initAudio();
    setGridSize(size);
  }, []);
  
  const handleStartGame = useCallback(() => {
    initAudio();
    if (image && gridSize && user) {
      resetTimer();
      startTimer();
      setGameState('playing');
    }
  }, [image, gridSize, user, startTimer, resetTimer]);

  const handleSaveScore = useCallback((moves: number, finalTime: number, currentUser: User, difficulty: number) => {
    const score = (finalTime * 5) + moves; // Time is weighted more heavily
    const newScore: ScoreEntry = {
      user: currentUser,
      moves,
      time: finalTime,
      score,
      difficulty,
      date: new Date().toISOString(),
    };
    
    const existingScores: ScoreEntry[] = JSON.parse(localStorage.getItem('leaderboard-scores') || '[]');
    const updatedScores = [...existingScores, newScore];
    localStorage.setItem('leaderboard-scores', JSON.stringify(updatedScores));

  }, []);

  const handleWin = useCallback((moves: number) => {
    const finalTime = stopTimer();
    setLastGameStats({ moves, time: finalTime });

    if (user && gridSize) {
      handleSaveScore(moves, finalTime, user, gridSize);
    }

    setTimeout(() => {
      setGameState('won');
    }, 500);
  }, [stopTimer, user, gridSize, handleSaveScore]);

  const handlePlayAgain = useCallback(() => {
    setGameState('selecting');
    setImage(DEFAULT_IMAGES[0]);
    setGridSize(null);
    resetTimer();
    setLastGameStats(null);
    setView('setup');
  }, [resetTimer]);

  const renderContent = () => {
    switch (gameState) {
      case 'playing':
        return image && gridSize ? (
          <GameBoard imageSrc={image} gridSize={gridSize} onWin={handleWin} />
        ) : null;
      case 'won':
        return image && lastGameStats && (
          <>
            <GameBoard imageSrc={image} gridSize={gridSize!} onWin={() => {}} />
            <WinModal imageSrc={image} onPlayAgain={handlePlayAgain} moves={lastGameStats.moves} time={lastGameStats.time} />
          </>
        )
      case 'selecting':
      default:
        return (
          <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700">
            <Auth user={user} onSignIn={signIn} onSignOut={signOut} />
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">3D Sliding Puzzle</h1>
            <p className="text-center text-slate-300 mb-6">Sign in to save your score and compete on the leaderboard!</p>
            
            <div className="flex justify-center border-b border-slate-700 mb-6">
              <button onClick={() => setView('setup')} className={`px-6 py-2 text-lg font-semibold transition-colors ${view === 'setup' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-white'}`}>
                Game Setup
              </button>
              <button onClick={() => setView('leaderboard')} className={`px-6 py-2 text-lg font-semibold transition-colors ${view === 'leaderboard' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-white'}`}>
                Leaderboard
              </button>
            </div>

            {view === 'setup' ? (
              <>
                <ImageSelector defaultImages={DEFAULT_IMAGES} onImageSelect={handleImageSelect} selectedImage={image} />
                {image && <DifficultySelector onDifficultySelect={handleDifficultySelect} selectedGridSize={gridSize} />}
                <div className="text-center mt-8">
                  <button
                    onClick={handleStartGame}
                    disabled={!image || !gridSize || !user}
                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    Start Game
                  </button>
                </div>
              </>
            ) : (
              <Leaderboard />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-purple-900/50 flex flex-col items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};

export default App;