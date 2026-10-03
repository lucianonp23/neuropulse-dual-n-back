export type GamePhase = 'idle' | 'playing' | 'results';

export type Modality = 'position' | 'letter';

export type ResponseFeedback = 'correct' | 'incorrect' | null;

export interface GameSettings {
  n: number;
  trials: number;
  interval: number; // ms
  dual: boolean;
  feedback: boolean;
  autoLevelUp: boolean;
}

export interface TrialData {
  position: number; // 0-8 for 3x3 grid
  letter: string;
}

export interface GameStats {
  correctPosition: number;
  correctLetter: number;
  falsePositivesPosition: number;
  falsePositivesLetter: number;
  missedPosition: number;
  missedLetter: number;
  totalMatchesPosition: number;
  totalMatchesLetter: number;
}

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const GRID_CELLS = 9;
export const MIN_N = 1;
export const MAX_N = 8;
/** Session accuracy (%) that must be exceeded to advance to N+1. */
export const LEVEL_UP_THRESHOLD = 90;

const MATCH_PROBABILITY = 0.3;

export function isValidN(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= MIN_N && n <= MAX_N;
}

export function generateSequence(n: number, trials: number): TrialData[] {
  const sequence: TrialData[] = [];

  for (let i = 0; i < trials; i++) {
    let position = Math.floor(Math.random() * GRID_CELLS);
    let letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

    // Add some intentional matches (approx 30%)
    if (i >= n && Math.random() < MATCH_PROBABILITY) {
      if (Math.random() < 0.5) {
        position = sequence[i - n].position;
      } else {
        letter = sequence[i - n].letter;
      }
    }

    sequence.push({ position, letter });
  }

  return sequence;
}

/** Whether the trial at `index` matches the one `n` steps back in the given modality. */
export function isMatch(sequence: TrialData[], index: number, n: number, modality: Modality): boolean {
  if (index < n) return false;
  return sequence[index][modality] === sequence[index - n][modality];
}

export function createStats(sequence: TrialData[] = [], n = 0): GameStats {
  let totalMatchesPosition = 0;
  let totalMatchesLetter = 0;
  for (let i = n; i < sequence.length; i++) {
    if (isMatch(sequence, i, n, 'position')) totalMatchesPosition++;
    if (isMatch(sequence, i, n, 'letter')) totalMatchesLetter++;
  }

  return {
    correctPosition: 0,
    correctLetter: 0,
    falsePositivesPosition: 0,
    falsePositivesLetter: 0,
    missedPosition: 0,
    missedLetter: 0,
    totalMatchesPosition,
    totalMatchesLetter,
  };
}

export function calculateAccuracy(stats: GameStats, dual: boolean): number {
  const posDenom = stats.totalMatchesPosition + stats.falsePositivesPosition;
  const posAccuracy = posDenom > 0
    ? Math.max(0, Math.min(100, (stats.correctPosition / posDenom) * 100))
    : 100;

  const letDenom = stats.totalMatchesLetter + stats.falsePositivesLetter;
  const letAccuracy = letDenom > 0
    ? Math.max(0, Math.min(100, (stats.correctLetter / letDenom) * 100))
    : 100;

  if (!dual) return Math.round(posAccuracy * 10) / 10;
  return Math.round(((posAccuracy + letAccuracy) / 2) * 10) / 10;
}

export type AccuracyTier = 'excellent' | 'good' | 'fair' | 'poor';

export function getAccuracyTier(accuracy: number): AccuracyTier {
  if (accuracy > LEVEL_UP_THRESHOLD) return 'excellent';
  if (accuracy >= 70) return 'good';
  if (accuracy >= 50) return 'fair';
  return 'poor';
}
