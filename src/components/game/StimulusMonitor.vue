<script setup lang="ts">
import { Volume2, VolumeX } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAudioSettings } from '../../composables/useAudioSettings';
import { useGameSession } from '../../composables/useGameSession';
import { useGameSettings } from '../../composables/useGameSettings';

const { settings } = useGameSettings();
const { currentTrial, isAudioPlaying } = useGameSession();
const { audio, toggleMute, phoneticFor } = useAudioSettings();

const feedbackLabel = computed(() => {
  if (!settings.value.feedback) return 'Feedback Desligado (Modo Cego)';
  return audio.feedbackEnabled ? 'Feedback Sonoro Ativo' : 'Feedback Mudo';
});
</script>

<template>
  <div class="flex items-center justify-between w-full max-w-md px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-xs font-mono">
    <div class="flex items-center gap-2">
      <Volume2 
        :class="[
          'w-4 h-4 transition-colors',
          isAudioPlaying ? 'text-emerald-400 animate-bounce' : 'text-zinc-500'
        ]" 
      />
      <span class="text-zinc-400">Estímulo Auditivo:</span>
      <span class="text-emerald-400 font-bold text-sm">{{ currentTrial?.letter ?? '-' }}</span>
      <span v-if="currentTrial && audio.stimulusMode === 'speech'" class="text-zinc-500 font-normal text-[11px]">
        ("{{ phoneticFor(currentTrial.letter) }}")
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-[10px] text-zinc-500 uppercase">{{ feedbackLabel }}</span>
      <button 
        @click="toggleMute"
        class="text-zinc-500 hover:text-zinc-300 transition-colors"
        :title="audio.muted ? 'Desmutar' : 'Mutar'"
      >
        <component :is="audio.muted ? VolumeX : Volume2" class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
