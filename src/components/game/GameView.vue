<script setup lang="ts">
import { LogOut, Square, Volume2 } from 'lucide-vue-next';
import { useGameSession } from '../../composables/useGameSession';
import { useGameSettings } from '../../composables/useGameSettings';
import ResponseButton from './ResponseButton.vue';
import SpatialGrid from './SpatialGrid.vue';
import StimulusMonitor from './StimulusMonitor.vue';

const { settings } = useGameSettings();
const { currentTrial, responded, feedback, isAudioPlaying, canRespond, progress, respond, quitSession } = useGameSession();
</script>

<template>
  <div class="flex flex-col items-center gap-10">
    <StimulusMonitor />

    <SpatialGrid :trial="currentTrial" />

    <div class="grid grid-cols-2 gap-6 w-full max-w-md touch-none">
      <ResponseButton
        label="POSIÇÃO (A)"
        :n="settings.n"
        :enabled="canRespond"
        :responded="responded.position"
        :feedback="feedback.position"
        @respond="respond('position')"
      >
        <template #icon><Square class="w-5 h-5" /></template>
      </ResponseButton>

      <ResponseButton
        label="LETRA / SOM (L)"
        :n="settings.n"
        :enabled="canRespond"
        :responded="responded.letter"
        :feedback="feedback.letter"
        @respond="respond('letter')"
      >
        <template #icon>
          <Volume2 :class="['w-5 h-5', isAudioPlaying ? 'text-emerald-400 scale-110' : '']" />
        </template>
      </ResponseButton>
    </div>

    <!-- Progress Bar -->
    <div class="w-full max-w-md space-y-2">
      <div class="flex justify-between text-xs font-mono text-zinc-500 uppercase tracking-widest">
        <span>Progresso da Sessão</span>
        <span>{{ Math.round(progress * 100) }}%</span>
      </div>
      <div class="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-800">
        <div 
          class="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
          :style="{ width: `${progress * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Session Actions & Exit Controls -->
    <div class="w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <button 
        @click="quitSession"
        class="w-full sm:w-auto px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-rose-500/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer group"
        title="Encerrar a sessão e retornar ao menu inicial"
      >
        <LogOut class="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400 transition-colors" />
        <span>Encerrar & Voltar ao Menu</span>
        <kbd class="text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">Esc</kbd>
      </button>

      <div class="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
        <span>Atalhos:</span>
        <span class="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">A</span> Posição
        <span class="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">L</span> Letra
      </div>
    </div>
  </div>
</template>
