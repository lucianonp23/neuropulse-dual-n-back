<script setup lang="ts">
import { Check, X } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAudioSettings } from '../../../composables/useAudioSettings';
import RangeInput from '../../ui/RangeInput.vue';

const { audio, setMasterVolume, setFeedbackVolume, previewFeedback } = useAudioSettings();

const sliders = [
  {
    label: 'Volume dos Estímulos Auditivos',
    model: computed({ get: () => audio.masterVolume, set: setMasterVolume }),
  },
  {
    label: 'Volume dos Feedbacks (Acerto/Erro)',
    model: computed({ get: () => audio.feedbackVolume, set: setFeedbackVolume }),
  },
];
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
    <div class="space-y-4 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800">
      <div v-for="slider in sliders" :key="slider.label" class="space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="font-medium text-zinc-300">{{ slider.label }}</span>
          <span class="font-mono text-emerald-400">{{ Math.round(slider.model.value * 100) }}%</span>
        </div>
        <RangeInput v-model="slider.model.value" :min="0" :max="1" :step="0.05" size="sm" />
      </div>
    </div>

    <!-- Sound Verification & Feedback Preview -->
    <div class="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800 flex flex-col justify-between gap-3">
      <div>
        <span class="text-xs font-mono uppercase tracking-wider text-zinc-400">Prévia dos Sinais de Resposta</span>
        <p class="text-[11px] text-zinc-500 mt-0.5">Teste os efeitos auditivos sintetizados para retorno imediato:</p>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button 
          @click="previewFeedback(true)"
          class="px-3 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Check class="w-4 h-4" />
          Sinal de Acerto
        </button>
        <button 
          @click="previewFeedback(false)"
          class="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <X class="w-4 h-4" />
          Sinal de Erro
        </button>
      </div>
    </div>
  </div>
</template>
