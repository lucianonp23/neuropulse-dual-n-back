import { computed, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import { audioService } from '../lib/audio/audio-service';
import {
  calculateAccuracy,
  createStats,
  generateSequence,
  isMatch,
  LEVEL_UP_THRESHOLD,
  MAX_N,
  type GamePhase,
  type Modality,
  type ResponseFeedback,
  type TrialData,
} from '../lib/game-logic';
import { createSharedComposable } from './create-shared-composable';
import { useGameSettings } from './useGameSettings';

/** How long the "audio playing" pulse stays on after each stimulus. */
const AUDIO_PULSE_MS = 400;

/**
 * Runs a training session: the trial loop, response scoring and the end-of-session
 * level progression.
 */
export const useGameSession = createSharedComposable(() => {
  const { settings } = useGameSettings();

  const phase = ref<GamePhase>('idle');
  const sequence = ref<TrialData[]>([]);
  const currentIndex = ref(-1);
  const stats = ref(createStats());

  /** Whether the player already answered each modality in the current trial. */
  const responded = reactive<Record<Modality, boolean>>({ position: false, letter: false });
  /** Visual feedback for the current trial's answers (only set when feedback is on). */
  const feedback = reactive<Record<Modality, ResponseFeedback>>({ position: null, letter: null });
  const isAudioPlaying = ref(false);

  /** N level the last session was played at, before any level-up. */
  const previousN = ref(settings.value.n);
  const sessionLeveledUp = ref(false);

  let trialTimer: ReturnType<typeof setTimeout> | null = null;
  let audioPulseTimer: ReturnType<typeof setTimeout> | null = null;

  const currentTrial = computed<TrialData | null>(() => sequence.value[currentIndex.value] ?? null);
  /** Responses only count once there is a trial N steps back to compare against. */
  const canRespond = computed(() => phase.value === 'playing' && currentIndex.value >= settings.value.n);
  const progress = computed(() => (currentIndex.value + 1) / settings.value.trials);
  const accuracy = computed(() => calculateAccuracy(stats.value, settings.value.dual));

  const clearTimers = () => {
    if (trialTimer) clearTimeout(trialTimer);
    if (audioPulseTimer) clearTimeout(audioPulseTimer);
    trialTimer = null;
    audioPulseTimer = null;
  };

  const resetTrialResponses = () => {
    responded.position = responded.letter = false;
    feedback.position = feedback.letter = null;
  };

  // --- Trial loop ---------------------------------------------------------

  const showTrial = (index: number) => {
    resetTrialResponses();
    currentIndex.value = index;

    audioService.playLetter(sequence.value[index].letter);
    isAudioPlaying.value = true;
    audioPulseTimer = setTimeout(() => {
      isAudioPlaying.value = false;
    }, AUDIO_PULSE_MS);

    trialTimer = setTimeout(() => endTrial(index), settings.value.interval);
  };

  const endTrial = (index: number) => {
    const n = settings.value.n;
    const missedPosition = isMatch(sequence.value, index, n, 'position') && !responded.position;
    const missedLetter = isMatch(sequence.value, index, n, 'letter') && !responded.letter;

    if (missedPosition) stats.value.missedPosition++;
    if (missedLetter) stats.value.missedLetter++;
    if ((missedPosition || missedLetter) && settings.value.feedback) {
      audioService.playMissed();
    }

    if (index >= settings.value.trials - 1) {
      finishSession();
    } else {
      showTrial(index + 1);
    }
  };

  const startGame = () => {
    // Unlock audio context on user click gesture
    audioService.init();
    clearTimers();

    sessionLeveledUp.value = false;
    sequence.value = generateSequence(settings.value.n, settings.value.trials);
    stats.value = createStats(sequence.value, settings.value.n);
    phase.value = 'playing';
    showTrial(0);
  };

  // --- Responses ----------------------------------------------------------

  const respond = (modality: Modality) => {
    if (!canRespond.value || responded[modality]) return;
    responded[modality] = true;

    const correct = isMatch(sequence.value, currentIndex.value, settings.value.n, modality);
    if (modality === 'position') {
      if (correct) stats.value.correctPosition++;
      else stats.value.falsePositivesPosition++;
    } else {
      if (correct) stats.value.correctLetter++;
      else stats.value.falsePositivesLetter++;
    }

    if (!settings.value.feedback) return;
    feedback[modality] = correct ? 'correct' : 'incorrect';
    if (correct) {
      audioService.playCorrect(modality);
      toast.success(modality === 'position' ? 'Posição Correta!' : 'Letra Correta!', { duration: 600 });
    } else {
      audioService.playIncorrect();
      toast.error(modality === 'position' ? 'Erro de Posição' : 'Erro de Letra', { duration: 600 });
    }
  };

  // --- Session end & progression ------------------------------------------

  const finishSession = () => {
    clearTimers();
    phase.value = 'results';
    previousN.value = settings.value.n;
    sessionLeveledUp.value = false;

    const finalAccuracy = accuracy.value;
    const percent = Math.round(finalAccuracy);

    if (finalAccuracy > LEVEL_UP_THRESHOLD) {
      if (settings.value.autoLevelUp && settings.value.n < MAX_N) {
        sessionLeveledUp.value = true;
        settings.value.n++;
        setTimeout(() => {
          audioService.playLevelUp();
          toast.success(`🎉 Incrível! ${percent}% de acerto (>90%)! Nível aumentado para N=${settings.value.n}!`, { duration: 4000 });
        }, 300);
      } else {
        setTimeout(() => {
          audioService.playLevelUp();
          toast.success(`🎉 Excelente desempenho: ${percent}% de acerto!`, { duration: 3500 });
        }, 300);
      }
    } else if (finalAccuracy >= 70) {
      setTimeout(() => audioService.playLevelUp(), 200);
    } else if (finalAccuracy < 50) {
      setTimeout(() => audioService.playLevelDown(), 200);
    }
  };

  /** Offered on the results screen when accuracy beat the threshold but auto level-up is off. */
  const manualLevelUp = () => {
    if (settings.value.n >= MAX_N) {
      toast.info(`Você já atingiu o nível máximo (N=${MAX_N})!`);
      return;
    }
    previousN.value = settings.value.n;
    settings.value.n++;
    sessionLeveledUp.value = true;
    audioService.playLevelUp();
    toast.success(`Nível avançado para N=${settings.value.n}!`);
  };

  const repeatPreviousLevel = () => {
    settings.value.n = previousN.value;
    startGame();
  };

  const backToMenu = () => {
    phase.value = 'idle';
  };

  const quitSession = () => {
    clearTimers();
    audioService.stopSpeech();
    isAudioPlaying.value = false;
    phase.value = 'idle';
    currentIndex.value = -1;
    resetTrialResponses();
    toast.info('Sessão encerrada. Retornando ao menu.', { duration: 1500 });
  };

  return {
    phase,
    sequence,
    currentIndex,
    currentTrial,
    stats,
    responded,
    feedback,
    isAudioPlaying,
    previousN,
    sessionLeveledUp,
    canRespond,
    progress,
    accuracy,
    startGame,
    respond,
    manualLevelUp,
    repeatPreviousLevel,
    backToMenu,
    quitSession,
  };
});
