/**
 * Safe localStorage access. Storage can be unavailable (private mode, blocked
 * site data, SSR), so every read falls back and every write is best-effort.
 */

export const STORAGE_KEYS = {
  nLevel: 'nback_n_level',
  feedback: 'nback_feedback',
  autoLevelUp: 'nback_auto_levelup',
  audioSettings: 'neuropulse_audio_settings',
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}
