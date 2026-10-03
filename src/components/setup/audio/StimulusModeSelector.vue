<script setup lang="ts">
import { Activity, Music, Sparkles } from 'lucide-vue-next';
import { useAudioSettings } from '../../../composables/useAudioSettings';
import type { AudioStimulusMode } from '../../../lib/audio/audio-service';

const { audio, setStimulusMode } = useAudioSettings();

const modes: { mode: AudioStimulusMode; title: string; description: string; icon: typeof Music }[] = [
  {
    mode: 'harmonic',
    title: 'Timbres Harmônicos',
    description: 'Sintetizador Web Audio com filtro ressonante e sobretons quentes de sino/vibrafone.',
    icon: Music,
  },
  {
    mode: 'speech',
    title: 'Voz Sintetizada',
    description: 'Pronúncia vocal clara das letras (A, B, C...) para discriminação fonética clássica.',
    icon: Sparkles,
  },
  {
    mode: 'pure',
    title: 'Tons Puros (Senoidal)',
    description: 'Frequências senoidais puras isoladas (escala laboratorial científica).',
    icon: Activity,
  },
];
</script>

<template>
  <div class="space-y-3">
    <label class="text-xs font-mono uppercase tracking-wider text-zinc-400">Modo de Síntese do Estímulo</label>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button 
        v-for="option in modes"
        :key="option.mode"
        @click="setStimulusMode(option.mode)"
        :class="[
          'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2',
          audio.stimulusMode === option.mode
            ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
            : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-sm">{{ option.title }}</span>
          <component :is="option.icon" class="w-4 h-4 text-emerald-400" />
        </div>
        <p class="text-[11px] text-zinc-500 leading-snug">{{ option.description }}</p>
      </button>
    </div>
  </div>
</template>
