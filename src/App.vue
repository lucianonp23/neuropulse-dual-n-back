<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import AppFooter from './components/layout/AppFooter.vue';
import AppHeader from './components/layout/AppHeader.vue';
import GameView from './components/game/GameView.vue';
import ResultsView from './components/results/ResultsView.vue';
import SetupView from './components/setup/SetupView.vue';
import { useGameSession } from './composables/useGameSession';
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';

const { phase } = useGameSession();
useKeyboardShortcuts();

// Each screen starts at the top instead of inheriting the previous screen's scroll
// position (e.g. the lobby scrolled down to the audio settings). Runs after the old
// screen has faded out, so the jump isn't visible.
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'instant' });
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
    <Toaster position="bottom-center" :toastOptions="{
      class: 'bg-zinc-900 border-zinc-800 text-zinc-100 font-mono text-xs uppercase tracking-widest',
    }" />

    <div class="max-w-4xl mx-auto px-4 py-8">
      <AppHeader />

      <main class="relative">
        <transition name="fade" mode="out-in" @before-enter="scrollToTop">
          <SetupView v-if="phase === 'idle'" key="idle" />
          <GameView v-else-if="phase === 'playing'" key="playing" />
          <ResultsView v-else key="results" />
        </transition>
      </main>

      <AppFooter />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
