import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { isValidN, type GameSettings } from '../lib/game-logic';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
import { createSharedComposable } from './create-shared-composable';

const DEFAULT_SETTINGS: GameSettings = {
  n: 2,
  trials: 20,
  interval: 3000,
  dual: true,
  feedback: true,
  autoLevelUp: true,
};

function loadSettings(): GameSettings {
  const savedN = loadJSON<unknown>(STORAGE_KEYS.nLevel, null);
  return {
    ...DEFAULT_SETTINGS,
    n: isValidN(savedN) ? savedN : DEFAULT_SETTINGS.n,
    feedback: loadJSON(STORAGE_KEYS.feedback, DEFAULT_SETTINGS.feedback),
    autoLevelUp: loadJSON(STORAGE_KEYS.autoLevelUp, DEFAULT_SETTINGS.autoLevelUp),
  };
}

/** Training parameters. N level, feedback and auto level-up persist across visits. */
export const useGameSettings = createSharedComposable(() => {
  const settings = ref<GameSettings>(loadSettings());

  watch(() => settings.value.n, (n) => saveJSON(STORAGE_KEYS.nLevel, n));
  watch(() => settings.value.feedback, (on) => saveJSON(STORAGE_KEYS.feedback, on));
  watch(() => settings.value.autoLevelUp, (on) => saveJSON(STORAGE_KEYS.autoLevelUp, on));

  const toggleDual = () => {
    settings.value.dual = !settings.value.dual;
  };

  const toggleFeedback = () => {
    settings.value.feedback = !settings.value.feedback;
    toast.info(
      settings.value.feedback
        ? 'Feedback de acertos e erros ativado'
        : 'Feedback desativado (Modo Teste Cego)',
      { duration: 1000 }
    );
  };

  const toggleAutoLevelUp = () => {
    settings.value.autoLevelUp = !settings.value.autoLevelUp;
    toast.info(
      settings.value.autoLevelUp
        ? 'Auto-Avanço de Nível ativado (>90% de acerto)'
        : 'Auto-Avanço desativado (Modo de Nível Fixo)',
      { duration: 1200 }
    );
  };

  return { settings, toggleDual, toggleFeedback, toggleAutoLevelUp };
});
