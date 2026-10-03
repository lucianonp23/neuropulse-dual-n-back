import { effectScope } from 'vue';

/**
 * Turns a composable into an app-wide singleton. State is created once, on first use,
 * inside a detached effect scope so its watchers survive the component that first
 * called it being unmounted (e.g. switching game phases).
 */
export function createSharedComposable<T>(composable: () => T): () => T {
  let state: T | undefined;
  return () => {
    if (state === undefined) {
      state = effectScope(true).run(composable)!;
    }
    return state;
  };
}
