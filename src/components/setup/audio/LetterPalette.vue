<script setup lang="ts">
import { Volume2 } from 'lucide-vue-next';
import { useAudioSettings } from '../../../composables/useAudioSettings';
import { SPEECH_LANGUAGES } from '../../../lib/audio/speech-languages';
import { LETTERS } from '../../../lib/game-logic';

const { audio, phoneticFor, previewLetter } = useAudioSettings();
</script>

<template>
  <div class="space-y-2 pt-2">
    <div class="flex items-center justify-between">
      <span class="text-xs font-mono uppercase tracking-wider text-zinc-400">
        Paleta Auditiva dos Estímulos (Clique para testar cada som)
      </span>
      <span class="text-[10px] text-zinc-500 font-mono">
        Modo: {{ audio.stimulusMode.toUpperCase() }}
        <template v-if="audio.stimulusMode === 'speech'">
          ({{ SPEECH_LANGUAGES[audio.speechLanguage]?.label }})
        </template>
      </span>
    </div>
    <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
      <button 
        v-for="letter in LETTERS" 
        :key="letter"
        @click="previewLetter(letter)"
        class="h-14 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-zinc-200 font-mono font-bold text-sm flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 cursor-pointer group"
        :title="`Ouvir som da letra ${letter}`"
      >
        <div class="flex items-center gap-1">
          <Volume2 class="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          <span>{{ letter }}</span>
        </div>
        <span 
          v-if="audio.stimulusMode === 'speech'" 
          class="text-[9px] font-mono text-zinc-500 group-hover:text-emerald-400 font-normal leading-none"
        >
          "{{ phoneticFor(letter) }}"
        </span>
      </button>
    </div>
  </div>
</template>
