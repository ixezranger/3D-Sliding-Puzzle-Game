
import React, { useState, useEffect } from 'react';
import type { ScoreEntry } from '../types';

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const Leaderboard: React.FC = () => {
    const [scores, setScores] = useState<ScoreEntry[]>([]);

    useEffect(() => {
        const storedScores = localStorage.getItem('leaderboard-scores');
        if (storedScores) {
            const parsedScores: ScoreEntry[] = JSON.parse(storedScores);
            // Sort by score (lower is better), then by time as a tie-breaker
            parsedScores.sort((a, b) => a.score - b.score || a.time - b.time);
            setScores(parsedScores.slice(0, 10)); // Get top 10
        }
    }, []);

    if (scores.length === 0) {
        return (
            <div className="text-center text-slate-400 py-10">
                <p>No scores yet.</p>
                <p>Play a game to get on the leaderboard!</p>
            </div>
        );
    }

    const rankColors = [
        'text-yellow-400', // 1st
        'text-slate-300', // 2nd
        'text-orange-400'  // 3rd
    ];

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 px-4 text-xs font-bold text-slate-400 uppercase">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-center">Difficulty</div>
                <div className="col-span-2 text-center">Moves</div>
                <div className="col-span-2 text-center">Time</div>
                <div className="col-span-1 text-right">Score</div>
            </div>
            {scores.map((entry, index) => (
                <div key={entry.date + entry.user.name} className="grid grid-cols-12 gap-2 items-center bg-slate-700/40 p-2 rounded-lg text-sm">
                    <div className={`col-span-1 text-center font-bold text-lg ${rankColors[index] || 'text-slate-400'}`}>{index + 1}</div>
                    <div className="col-span-4 flex items-center">
                        <img src={entry.user.picture} alt={entry.user.name} className="w-8 h-8 rounded-full mr-3" />
                        <span className="font-semibold truncate">{entry.user.name}</span>
                    </div>
                    <div className="col-span-2 text-center text-slate-300">{entry.difficulty}x{entry.difficulty}</div>
                    <div className="col-span-2 text-center text-slate-300">{entry.moves}</div>
                    <div className="col-span-2 text-center text-slate-300">{formatTime(entry.time)}</div>
                    <div className="col-span-1 text-right font-bold text-purple-400">{Math.round(entry.score)}</div>
                </div>
            ))}
        </div>
    );
};

export default Leaderboard;
