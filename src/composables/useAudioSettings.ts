import { reactive, readonly } from 'vue';
import { toast } from 'vue-sonner';
import { audioService, type AudioStimulusMode } from '../lib/audio/audio-service';
import { getSpeechPhonetic, SPEECH_LANGUAGES, type SpeechLanguageCode } from '../lib/audio/speech-languages';
import { createSharedComposable } from './create-shared-composable';

const STIMULUS_MODE_LABELS: Record<AudioStimulusMode, string> = {
  harmonic: 'Timbres Harmônicos selecionados',
  speech: 'Voz Sintetizada selecionada',
  pure: 'Tons Puros (Senoidais) selecionados',
};

/**
 * Reactive view of the audio service settings. All changes go through the actions
 * below, which update the service (and its persisted settings) and this mirror together.
 */
export const useAudioSettings = createSharedComposable(() => {
  const state = reactive({ ...audioService.settings });

  const toggleMute = () => {
    state.muted = !state.muted;
    audioService.setMuted(state.muted);
    toast.info(state.muted ? 'Áudio desativado' : 'Áudio ativado', { duration: 800 });
  };

  const setMasterVolume = (volume: number) => {
    state.masterVolume = volume;
    audioService.setMasterVolume(volume);
  };

  const setFeedbackVolume = (volume: number) => {
    state.feedbackVolume = volume;
    audioService.setFeedbackVolume(volume);
  };

  const toggleFeedbackSounds = () => {
    state.feedbackEnabled = !state.feedbackEnabled;
    audioService.setFeedbackEnabled(state.feedbackEnabled);
    toast.info(state.feedbackEnabled ? 'Feedback sonoro ativado' : 'Feedback sonoro desativado', { duration: 800 });
  };

  const applyStimulusMode = (mode: AudioStimulusMode) => {
    state.stimulusMode = mode;
    audioService.setStimulusMode(mode);
  };

  const setStimulusMode = (mode: AudioStimulusMode) => {
    applyStimulusMode(mode);
    audioService.testStimulus('A');
    toast.success(STIMULUS_MODE_LABELS[mode], { duration: 1000 });
  };

  /** Picking a language also switches to speech mode, since that's the only mode that uses it. */
  const setSpeechLanguage = (lang: SpeechLanguageCode) => {
    state.speechLanguage = lang;
    audioService.setSpeechLanguage(lang);
    if (state.stimulusMode !== 'speech') applyStimulusMode('speech');
    audioService.testStimulus('A');
    const { flag, label } = SPEECH_LANGUAGES[lang];
    toast.success(`Idioma da fala: ${flag} ${label}`, { duration: 1200 });
  };

  const setSpeechRate = (rate: number) => {
    state.speechRate = rate;
    audioService.setSpeechRate(rate);
  };

  const phoneticFor = (letter: string) => getSpeechPhonetic(letter, state.speechLanguage);

  const previewLetter = (letter: string) => audioService.testStimulus(letter);
  const previewFeedback = (correct: boolean) => audioService.testFeedback(correct);

  return {
    audio: readonly(state),
    toggleMute,
    setMasterVolume,
    setFeedbackVolume,
    toggleFeedbackSounds,
    setStimulusMode,
    setSpeechLanguage,
    setSpeechRate,
    phoneticFor,
    previewLetter,
    previewFeedback,
  };
});
