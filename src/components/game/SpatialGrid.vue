<script setup lang="ts">
import { GRID_CELLS, type TrialData } from '../../lib/game-logic';

defineProps<{ trial: TrialData | null }>();
</script>

<template>
  <div class="w-full max-w-md aspect-square grid grid-cols-3 gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-3xl shadow-2xl">
    <div 
      v-for="cell in GRID_CELLS" 
      :key="cell - 1" 
      class="relative bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden"
    >
      <transition name="pop">
        <div 
          v-if="trial?.position === cell - 1"
          class="absolute inset-2 bg-emerald-500 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.45)] flex items-center justify-center"
        >
          <span class="text-4xl font-black text-zinc-950 select-none">{{ trial.letter }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active {
  animation: pop-in 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
