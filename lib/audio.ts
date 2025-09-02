export const playSound = (soundType: 'move' | 'powerup' | 'accident' | 'complete' | 'gameover') => {
  if (typeof window === 'undefined') return;
  
  // Simple audio context-based sound generation
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    let frequency = 440;
    let duration = 0.1;
    
    switch (soundType) {
      case 'move':
        frequency = 220;
        duration = 0.05;
        break;
      case 'powerup':
        frequency = 880;
        duration = 0.3;
        break;
      case 'accident':
        frequency = 150;
        duration = 0.5;
        break;
      case 'complete':
        frequency = 660;
        duration = 0.8;
        break;
      case 'gameover':
        frequency = 110;
        duration = 1.0;
        break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.log('Audio not supported:', error);
  }
};

export const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};
