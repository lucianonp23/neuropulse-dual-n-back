import { onMounted, onUnmounted } from 'vue';
import { useAudioSettings } from './useAudioSettings';
import { useGameSession } from './useGameSession';

/** In-session shortcuts: A = position, L = letter, M = mute, Esc = quit. */
export function useKeyboardShortcuts() {
  const { phase, respond, quitSession } = useGameSession();
  const { toggleMute } = useAudioSettings();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (phase.value !== 'playing') return;

    switch (e.key.toLowerCase()) {
      case 'escape':
        e.preventDefault();
        quitSession();
        break;
      case 'a':
        respond('position');
        break;
      case 'l':
        respond('letter');
        break;
      case 'm':
        toggleMute();
        break;
    }
  };

  onMounted(() => window.addEventListener('keydown', handleKeyDown));
  onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
}
