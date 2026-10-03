<script setup lang="ts">
import { Trophy } from 'lucide-vue-next';
import { useGameSettings } from '../../composables/useGameSettings';

const { settings } = useGameSettings();
</script>

<template>
  <div class="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-4">
    <h3 class="text-lg font-semibold text-emerald-400 flex items-center gap-2">
      <Trophy class="w-5 h-5" />
      Protocolo Dual N-Back
    </h3>
    <p class="text-xs text-zinc-400 leading-relaxed">
      Compare cada novo estímulo com o apresentado exatamente <strong class="text-emerald-400">{{ settings.n }} rodadas atrás</strong>.
    </p>
    <ol class="space-y-3 text-sm text-zinc-400">
      <li class="flex items-start gap-3">
        <span class="step-number">1</span>
        <span><strong>Grid Visual:</strong> Pressione <kbd class="kbd">A</kbd> se a posição for idêntica à de {{ settings.n }} passos atrás.</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="step-number">2</span>
        <span><strong>Som Auditivo:</strong> Pressione <kbd class="kbd">L</kbd> se a letra/timbre for idêntico ao de {{ settings.n }} passos atrás.</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="step-number">3</span>
        <span><strong>Feedback Auditivo:</strong> Sons ascendentes confirmam acertos; tons descendentes indicam erros ou omissões.</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="step-number">4</span>
        <span><strong>Subir de Nível:</strong> Alcance <strong class="text-emerald-400">&gt;90% de precisão</strong> para desbloquear e subir automaticamente para o próximo nível (<span class="font-mono text-emerald-300">N → N+1</span>).</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
@reference "../../index.css";

.step-number {
  @apply text-emerald-400 font-mono font-bold bg-emerald-500/10 w-6 h-6 rounded flex items-center justify-center text-xs shrink-0 mt-0.5;
}

.kbd {
  @apply px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-200 font-mono text-xs font-bold;
}
</style>
