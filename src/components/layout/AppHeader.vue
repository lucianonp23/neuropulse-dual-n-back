<script setup lang="ts">
import { Activity, ArrowLeft, Brain, Volume2, VolumeX } from 'lucide-vue-next';
import { useAudioSettings } from '../../composables/useAudioSettings';
import { useGameSession } from '../../composables/useGameSession';
import { useGameSettings } from '../../composables/useGameSettings';

const { settings } = useGameSettings();
const { phase, currentIndex, quitSession } = useGameSession();
const { audio, toggleMute } = useAudioSettings();
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-zinc-800 pb-6">
    <div class="flex items-center gap-3">
      <div class="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
        <Brain class="w-7 h-7 text-emerald-400" />
      </div>
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          NeuroPulse
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase tracking-wider font-semibold">
            Dual N-Back
          </span>
        </h1>
        <p class="text-xs font-mono text-zinc-500 tracking-wide">Web Audio Cognitive Engine</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Audio Quick Toggle -->
      <button 
        @click="toggleMute"
        :title="audio.muted ? 'Desmutar Áudio' : 'Mutar Áudio'"
        :class="[
          'p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono',
          audio.muted 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/30'
        ]"
      >
        <component :is="audio.muted ? VolumeX : Volume2" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ audio.muted ? 'MUDO' : `${Math.round(audio.masterVolume * 100)}%` }}</span>
      </button>

      <div class="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-mono text-xs font-bold tracking-wider">
        N-LEVEL: {{ settings.n }}
      </div>

      <template v-if="phase === 'playing'">
        <div class="flex items-center gap-2 text-zinc-400 font-mono text-xs bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800">
          <Activity class="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span>{{ currentIndex + 1 }} / {{ settings.trials }}</span>
        </div>

        <button 
          @click="quitSession"
          class="hidden sm:flex px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-300 hover:text-rose-400 font-mono text-xs font-semibold items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm group"
          title="Sair da sessão e voltar ao menu (ou pressione Esc)"
        >
          <ArrowLeft class="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
          <span>Sair ao Menu</span>
        </button>
      </template>
    </div>
  </header>
</template>
