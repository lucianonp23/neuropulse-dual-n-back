<script setup lang="ts">
import { Volume2 } from 'lucide-vue-next';
import { useAudioSettings } from '../../../composables/useAudioSettings';
import ToggleSwitch from '../../ui/ToggleSwitch.vue';
import LetterPalette from './LetterPalette.vue';
import SpeechSettings from './SpeechSettings.vue';
import StimulusModeSelector from './StimulusModeSelector.vue';
import VolumeControls from './VolumeControls.vue';

const { audio, toggleFeedbackSounds } = useAudioSettings();
</script>

<template>
  <div class="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
      <div class="space-y-0.5">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <Volume2 class="w-5 h-5 text-emerald-400" />
          Web Audio API & Estímulos Auditivos
        </h3>
        <p class="text-xs text-zinc-500">
          Configuração dos timbres sintetizados e dos sinais de feedback auditivo para acertos e erros
        </p>
      </div>

      <div class="flex items-center gap-3 bg-zinc-950/60 px-3 py-2 rounded-xl border border-zinc-800">
        <span class="text-xs text-zinc-300 font-medium">Feedback Sonoro</span>
        <ToggleSwitch :on="audio.feedbackEnabled" size="sm" @toggle="toggleFeedbackSounds" />
      </div>
    </div>

    <StimulusModeSelector />
    <SpeechSettings />
    <VolumeControls />
    <LetterPalette />
  </div>
</template>
