<script setup lang="ts">
import { Gauge, Globe } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAudioSettings } from '../../../composables/useAudioSettings';
import { SPEECH_LANGUAGES, type SpeechLanguageCode } from '../../../lib/audio/speech-languages';
import RangeInput from '../../ui/RangeInput.vue';

const { audio, setStimulusMode, setSpeechLanguage, setSpeechRate, phoneticFor } = useAudioSettings();

const isSpeechMode = computed(() => audio.stimulusMode === 'speech');
const activeLanguage = computed(() => SPEECH_LANGUAGES[audio.speechLanguage]);
const speechRate = computed({
  get: () => audio.speechRate,
  set: setSpeechRate,
});

const languages = Object.values(SPEECH_LANGUAGES);
const SAMPLE_LETTERS = ['A', 'B', 'C', 'D', 'E'];
</script>

<template>
  <div 
    :class="[
      'p-5 rounded-2xl border transition-all space-y-4',
      isSpeechMode 
        ? 'bg-zinc-950/70 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.08)]' 
        : 'bg-zinc-950/30 border-zinc-800/80 opacity-75'
    ]"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2 flex-wrap">
          <Globe class="w-4 h-4 text-emerald-400" />
          <span class="text-xs font-bold text-white uppercase tracking-wider">Idioma da Voz (Speech Síntese)</span>
          <span class="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-semibold">
            Som Puro da Letra (Sem "Caixa Alta" / "Capital")
          </span>
        </div>
        <p class="text-xs text-zinc-400">
          Pronuncia estritamente o fonema da letra, eliminando ruídos como "A maiúsculo", "capital B" ou "letter C".
        </p>
      </div>

      <button 
        v-if="!isSpeechMode"
        @click="setStimulusMode('speech')"
        class="text-xs px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-medium transition-all cursor-pointer self-start sm:self-auto"
      >
        Ativar Modo Voz
      </button>
    </div>

    <!-- Language Selection Grid -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">Selecione o Idioma da Fala:</span>
        <span class="text-zinc-500 text-[11px] font-mono">
          Ativo: <strong class="text-emerald-400">{{ activeLanguage?.label }}</strong>
        </span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          @click="setSpeechLanguage(lang.code as SpeechLanguageCode)"
          :class="[
            'px-3 py-2.5 rounded-xl border text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer select-none',
            audio.speechLanguage === lang.code
              ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900'
          ]"
        >
          <span class="text-lg leading-none">{{ lang.flag }}</span>
          <span class="font-sans font-semibold text-xs">{{ lang.label }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
      <!-- Speech Rate Slider -->
      <div class="space-y-2 bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800/80">
        <div class="flex justify-between items-center text-xs">
          <span class="text-zinc-300 font-medium flex items-center gap-1.5">
            <Gauge class="w-3.5 h-3.5 text-emerald-400" />
            Velocidade da Voz (Taxa)
          </span>
          <span class="font-mono text-emerald-400 font-bold">{{ audio.speechRate.toFixed(2) }}x</span>
        </div>
        <RangeInput v-model="speechRate" :min="0.9" :max="1.6" :step="0.05" size="sm" />
        <div class="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>0.9x (Pausado)</span>
          <span>1.25x (Recomendado)</span>
          <span>1.6x (Ágil)</span>
        </div>
      </div>

      <!-- Phonetic Reference Sample -->
      <div class="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between gap-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-300 font-medium">Fonemas Configurados ({{ activeLanguage?.label }}):</span>
          <span class="text-[10px] text-emerald-400 font-mono">100% livre de case</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span 
            v-for="letter in SAMPLE_LETTERS" 
            :key="letter"
            class="text-[11px] font-mono px-2 py-0.5 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-300"
          >
            <strong class="text-emerald-400">{{ letter }}</strong>: "{{ phoneticFor(letter) }}"
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
