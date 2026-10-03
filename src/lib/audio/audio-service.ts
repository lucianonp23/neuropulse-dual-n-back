/**
 * Web Audio API Engine for NeuroPulse Dual N-Back.
 * Provides high-fidelity synthesized auditory stimuli (harmonic, pure tones, or speech)
 * and distinct auditory feedback cues for correct/incorrect responses.
 */

import type { Modality } from '../game-logic';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../storage';
import { SPEECH_LANGUAGES, type SpeechLanguageCode } from './speech-languages';

export type AudioStimulusMode = 'harmonic' | 'speech' | 'pure';

export interface AudioSettings {
  muted: boolean;
  masterVolume: number; // 0.0 to 1.0
  stimulusMode: AudioStimulusMode;
  feedbackEnabled: boolean;
  stimulusVolume: number; // 0.0 to 1.0
  feedbackVolume: number; // 0.0 to 1.0
  speechLanguage: SpeechLanguageCode;
  speechRate: number; // 0.8 to 1.8
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  muted: false,
  masterVolume: 0.8,
  stimulusMode: 'harmonic',
  feedbackEnabled: true,
  stimulusVolume: 0.85,
  feedbackVolume: 0.75,
  speechLanguage: 'pt-BR',
  speechRate: 1.25,
};

export const LETTER_FREQUENCIES: Record<string, number> = {
  'A': 261.63, // C4
  'B': 293.66, // D4
  'C': 329.63, // E4
  'D': 349.23, // F4
  'E': 392.00, // G4
  'F': 440.00, // A4
  'G': 493.88, // B4
  'H': 523.25, // C5
};

interface ToneOptions {
  type: OscillatorType;
  freq: number;
  /** Absolute AudioContext time at which the tone starts. */
  start: number;
  /**
   * Gain envelope as [offset in seconds from `start`, gain] points. The first point is
   * set immediately, the rest are reached with exponential ramps. The last offset is
   * the tone's duration.
   */
  envelope: [number, number][];
  /** Optional exponential pitch glide, reaching this frequency at the end of the tone. */
  glideTo?: number;
  /** Optional lowpass cutoff (Hz) applied before the gain stage. */
  lowpass?: number;
}

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  public settings: AudioSettings = {
    ...DEFAULT_AUDIO_SETTINGS,
    ...loadJSON<Partial<AudioSettings>>(STORAGE_KEYS.audioSettings, {}),
  };

  public saveSettings() {
    saveJSON(STORAGE_KEYS.audioSettings, this.settings);
  }

  /**
   * Initializes or returns the active AudioContext.
   * Auto-resumes if the browser suspended it due to autoplay policies.
   */
  public init(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();

        this.masterGain = this.ctx.createGain();
        this.updateMasterVolume();
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      return this.ctx;
    } catch (err) {
      console.warn('Web Audio API not supported or blocked:', err);
      return null;
    }
  }

  // --- Settings -----------------------------------------------------------

  public updateMasterVolume() {
    if (!this.masterGain || !this.ctx) return;
    const vol = this.settings.muted ? 0 : Math.max(0, Math.min(1, this.settings.masterVolume));
    this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
  }

  public setMuted(muted: boolean) {
    this.settings.muted = muted;
    this.updateMasterVolume();
    this.saveSettings();
  }

  public setMasterVolume(vol: number) {
    this.settings.masterVolume = vol;
    this.updateMasterVolume();
    this.saveSettings();
  }

  public setFeedbackVolume(vol: number) {
    this.settings.feedbackVolume = vol;
    this.saveSettings();
  }

  public setStimulusMode(mode: AudioStimulusMode) {
    this.settings.stimulusMode = mode;
    this.saveSettings();
  }

  public setFeedbackEnabled(enabled: boolean) {
    this.settings.feedbackEnabled = enabled;
    this.saveSettings();
  }

  public setSpeechLanguage(lang: SpeechLanguageCode) {
    this.settings.speechLanguage = lang;
    this.saveSettings();
  }

  public setSpeechRate(rate: number) {
    this.settings.speechRate = Math.max(0.8, Math.min(1.8, rate));
    this.saveSettings();
  }

  // --- Stimuli ------------------------------------------------------------

  /**
   * Plays the auditory stimulus for a given letter according to the selected stimulusMode.
   */
  public playLetter(letter: string) {
    if (this.settings.muted) return;

    if (this.settings.stimulusMode === 'speech') {
      this.playLetterSpeech(letter);
    } else if (this.settings.stimulusMode === 'pure') {
      this.playPureTone(letter);
    } else {
      this.playHarmonicTone(letter);
    }
  }

  /**
   * Synthesizes a rich harmonic chime with overtone warmth and soft envelope.
   */
  private playHarmonicTone(letter: string) {
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const baseFreq = LETTER_FREQUENCIES[letter] || 440;
    const now = ctx.currentTime;
    const duration = 0.38;
    const effectiveVol = this.settings.stimulusVolume * 0.45;

    // Sub-gain for this tone with envelope
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(effectiveVol, now + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(effectiveVol * 0.5, now + 0.12);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Filter to give a soft, organic marimba/vibraphone feel
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(baseFreq * 4, now);
    filter.Q.setValueAtTime(2, now);

    noteGain.connect(filter);
    filter.connect(this.masterGain);

    // Fundamental (sine), overtone an octave up (triangle) and a 3x sparkle (sine)
    const partials: { type: OscillatorType; multiple: number; gain: number }[] = [
      { type: 'sine', multiple: 1, gain: 1 },
      { type: 'triangle', multiple: 2, gain: 0.35 },
      { type: 'sine', multiple: 3, gain: 0.15 },
    ];

    for (const partial of partials) {
      const osc = ctx.createOscillator();
      osc.type = partial.type;
      osc.frequency.setValueAtTime(baseFreq * partial.multiple, now);

      if (partial.gain === 1) {
        osc.connect(noteGain);
      } else {
        const partialGain = ctx.createGain();
        partialGain.gain.setValueAtTime(partial.gain, now);
        osc.connect(partialGain);
        partialGain.connect(noteGain);
      }

      osc.start(now);
      osc.stop(now + duration);
    }
  }

  /**
   * Plays a clean laboratory pure sine tone.
   */
  private playPureTone(letter: string) {
    const ctx = this.init();
    if (!ctx) return;

    const vol = this.settings.stimulusVolume * 0.35;
    this.playTone({
      type: 'sine',
      freq: LETTER_FREQUENCIES[letter] || 440,
      start: ctx.currentTime,
      envelope: [[0, 0.0001], [0.02, vol], [0.15, vol * 0.7], [0.3, 0.0001]],
    });
  }

  /**
   * Speaks the letter using Web Speech API with explicit phonetic spelling and language targeting.
   * Eliminates unwanted TTS artifacts where isolated uppercase letters trigger "capital A" or "A maiúscula".
   */
  private playLetterSpeech(letter: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.playHarmonicTone(letter);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel previous utterances to avoid lagging

      const langConfig = SPEECH_LANGUAGES[this.settings.speechLanguage] || SPEECH_LANGUAGES['pt-BR'];
      // Use clean phonetic word to guarantee the speech engine pronounces ONLY the letter sound,
      // never announcing capitalization (no "capital" / "caps" / "maiúscula").
      const textToSpeak = langConfig.phonetics[letter] || letter.toLowerCase();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langConfig.code;
      utterance.rate = this.settings.speechRate || 1.25;
      utterance.pitch = 1.0;
      utterance.volume = this.settings.stimulusVolume * this.settings.masterVolume;

      // Select matching voice if available in the browser
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = langConfig.code.split('-')[0].toLowerCase();
        const matchedVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === langConfig.code.toLowerCase())
          || voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      this.playHarmonicTone(letter);
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --- Feedback cues ------------------------------------------------------

  /**
   * Distinct positive feedback cue when the user correctly identifies a match.
   * Plays a bright, ascending two-tone chime (e.g. D5 -> A5).
   */
  public playCorrect(type: Modality = 'position') {
    const now = this.feedbackStartTime();
    if (now === null) return;

    const vol = this.settings.feedbackVolume * 0.35;

    // Slight pitch distinction between position and letter feedback
    const startFreq = type === 'position' ? 587.33 : 659.25; // D5 or E5
    const endFreq = type === 'position' ? 880.00 : 987.77;   // A5 or B5

    this.playTone({
      type: 'sine',
      freq: startFreq,
      start: now,
      envelope: [[0, 0.001], [0.01, vol], [0.08, 0.001]],
    });
    // Higher, bright ending
    this.playTone({
      type: 'triangle',
      freq: endFreq,
      start: now + 0.06,
      envelope: [[0, 0.001], [0.01, vol * 1.1], [0.16, 0.001]],
    });
  }

  /**
   * Distinct negative feedback cue when the user triggers a false positive or mistake.
   * Plays a soft downward tone (pitch bend from 220Hz down to 130Hz) with gentle lowpass.
   */
  public playIncorrect() {
    const now = this.feedbackStartTime();
    if (now === null) return;

    const vol = this.settings.feedbackVolume * 0.32;
    this.playTone({
      type: 'triangle',
      freq: 220,
      glideTo: 130,
      lowpass: 600,
      start: now,
      envelope: [[0, 0.001], [0.02, vol], [0.18, 0.0001]],
    });
  }

  /**
   * Subtle tick/thud cue when a match was missed.
   */
  public playMissed() {
    const now = this.feedbackStartTime();
    if (now === null) return;

    const vol = this.settings.feedbackVolume * 0.2;
    this.playTone({
      type: 'sine',
      freq: 180,
      glideTo: 90,
      start: now,
      envelope: [[0, 0.001], [0.01, vol], [0.08, 0.0001]],
    });
  }

  /**
   * Triumphant ascending arpeggio for level advancement (C5 -> E5 -> G5 -> C6).
   */
  public playLevelUp() {
    this.playArpeggio('triangle', [523.25, 659.25, 783.99, 1046.50], 0.09, 0.22, 0.35);
  }

  /**
   * Gentle descending chime when level is reduced or session ends below threshold.
   */
  public playLevelDown() {
    this.playArpeggio('sine', [440.00, 392.00, 329.63], 0.12, 0.25, 0.25); // A4, G4, E4
  }

  /**
   * Preview helper to test letter stimuli and feedback sound.
   */
  public testStimulus(letter: string = 'A') {
    this.init();
    this.playLetter(letter);
  }

  public testFeedback(correct: boolean) {
    this.init();
    if (correct) {
      this.playCorrect('position');
    } else {
      this.playIncorrect();
    }
  }

  // --- Synthesis helpers --------------------------------------------------

  /** Current context time if feedback cues are allowed to play, otherwise null. */
  private feedbackStartTime(): number | null {
    if (this.settings.muted || !this.settings.feedbackEnabled) return null;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return null;
    return ctx.currentTime;
  }

  private playArpeggio(type: OscillatorType, notes: number[], step: number, noteDuration: number, volumeScale: number) {
    const now = this.feedbackStartTime();
    if (now === null) return;

    const vol = this.settings.feedbackVolume * volumeScale;
    notes.forEach((freq, idx) => {
      this.playTone({
        type,
        freq,
        start: now + idx * step,
        envelope: [[0, 0.001], [0.015, vol], [noteDuration, 0.0001]],
      });
    });
  }

  /** Schedules a single oscillator through a gain envelope into the master bus. */
  private playTone({ type, freq, start, envelope, glideTo, lowpass }: ToneOptions) {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;

    const duration = envelope[envelope.length - 1][0];

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (glideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, start + duration);
    }

    const gain = ctx.createGain();
    const [[, initial], ...ramps] = envelope;
    gain.gain.setValueAtTime(initial, start);
    for (const [offset, value] of ramps) {
      gain.gain.exponentialRampToValueAtTime(value, start + offset);
    }

    if (lowpass !== undefined) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(lowpass, start);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }
    gain.connect(this.masterGain);

    osc.start(start);
    osc.stop(start + duration);
  }
}

export const audioService = new AudioService();
