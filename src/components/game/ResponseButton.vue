<script setup lang="ts">
import { Check, X } from 'lucide-vue-next';
import { computed } from 'vue';
import type { ResponseFeedback } from '../../lib/game-logic';

const props = defineProps<{
  label: string;
  n: number;
  /** False until there is a trial N steps back to compare against. */
  enabled: boolean;
  responded: boolean;
  feedback: ResponseFeedback;
}>();

defineEmits<{ respond: [] }>();

const stateClass = computed(() => {
  if (props.feedback === 'correct') return 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
  if (props.feedback === 'incorrect') return 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
  if (props.responded) return 'bg-zinc-800/50 border-zinc-700/50 opacity-40 cursor-not-allowed';
  if (!props.enabled) return 'border-zinc-800/60 opacity-30 cursor-not-allowed';
  return 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 active:scale-95';
});
</script>

<template>
  <button 
    @click="$emit('respond')"
    :disabled="!enabled || responded"
    :class="[
      'h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all px-4 cursor-pointer relative overflow-hidden',
      stateClass
    ]"
  >
    <div class="flex items-center gap-2">
      <slot name="icon" />
      <component v-if="feedback" :is="feedback === 'correct' ? Check : X" class="w-4 h-4 animate-scale" />
    </div>
    <span class="font-bold text-sm tracking-wide">{{ label }}</span>
    <span class="text-[10px] font-mono text-zinc-400">
      {{ responded ? 'Registrado' : `${n} passos atrás` }}
    </span>
  </button>
</template>

<style scoped>
@keyframes scale-feedback {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-scale {
  animation: scale-feedback 0.2s ease-out forwards;
}
</style>
