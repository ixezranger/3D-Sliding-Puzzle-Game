let audioContext: AudioContext | null = null;
let isAudioContextInitialized = false;

const initializeAudioContext = () => {
    if (typeof window !== 'undefined' && !audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.");
        }
    }
};

initializeAudioContext();

// This function should be called from a user-initiated event (like a click)
export const initAudio = () => {
    if (!audioContext || isAudioContextInitialized) return;
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    isAudioContextInitialized = true;
};

export const playSound = (type: 'move' | 'win' | 'shuffle') => {
    if (!audioContext || audioContext.state !== 'running') {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    switch (type) {
        case 'move':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;

        case 'win':
            {
                const now = audioContext.currentTime;
                gainNode.gain.setValueAtTime(0.1, now);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, now); // C5
                oscillator.frequency.linearRampToValueAtTime(659.25, now + 0.1); // E5
                oscillator.frequency.linearRampToValueAtTime(783.99, now + 0.2); // G5
                oscillator.frequency.linearRampToValueAtTime(1046.50, now + 0.3); // C6
                gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.4);
                oscillator.start(now);
                oscillator.stop(now + 0.4);
            }
            break;
            
        case 'shuffle':
            {
                const now = audioContext.currentTime;
                const playNote = (freq: number, startTime: number, duration: number) => {
                    if (!audioContext) return;
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, startTime);
                    gain.gain.setValueAtTime(0.08, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);
                    osc.start(startTime);
                    osc.stop(startTime + duration);
                }
                playNote(220, now, 0.08);
                playNote(180, now + 0.1, 0.08);
                playNote(150, now + 0.2, 0.08);
            }
            break;
    }
};