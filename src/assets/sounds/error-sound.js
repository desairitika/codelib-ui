// Error sound effect - plays audio file
import errorAudioFile from './error.mp3';

export const playErrorSound = () => {
  console.log('playErrorSound called');
  try {
    const audio = new Audio(errorAudioFile);
    audio.volume = 0.7; // Set volume (0-1)
    audio.play().then(() => {
      console.log('✓ Error sound played successfully');
    }).catch(err => {
      console.error('Error playing sound:', err);
    });
  } catch (error) {
    console.error('Error in playErrorSound:', error);
  }
};
