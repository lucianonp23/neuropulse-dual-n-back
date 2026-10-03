<script setup lang="ts">
import { TrendingUp, Trophy } from 'lucide-vue-next';
import { LEVEL_UP_THRESHOLD } from '../../lib/game-logic';

/**
 * One of three states: the session leveled up, the threshold was beaten but
 * auto level-up is off (offer a manual level-up), or the threshold was missed.
 */
defineProps<{
  accuracy: number;
  leveledUp: boolean;
  n: number;
  previousN: number;
}>();

defineEmits<{ levelUp: [] }>();
</script>

<template>
  <div v-if="leveledUp" class="p-5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-2 border-emerald-400/60 rounded-2xl flex items-center gap-4 shadow-[0_0_35px_rgba(16,185,129,0.25)] animate-in fade-in zoom-in-95 duration-500">
    <div class="p-3.5 bg-emerald-500/30 text-emerald-300 rounded-2xl border border-emerald-400/40 shrink-0 shadow-sm">
      <Trophy class="w-8 h-8 text-emerald-400" />
    </div>
    <div class="space-y-1">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
          🎉 Nível Desbloqueado!
        </span>
        <span class="text-xs font-mono text-emerald-400 font-bold">
          Precisão: {{ Math.round(accuracy) }}% (&gt;90%)
        </span>
      </div>
      <h3 class="text-lg font-bold text-white">
        Parabéns! Você subiu para o Nível N={{ n }}
      </h3>
      <p class="text-xs text-zinc-300 leading-relaxed">
        Sua precisão superou a meta de 90%. Seu treinamento foi automaticamente promovido de <span class="font-mono text-emerald-400 font-bold">N={{ previousN }}</span> para <span class="font-mono text-emerald-300 font-bold">N={{ n }}</span>!
      </p>
    </div>
  </div>

  <div v-else-if="accuracy > LEVEL_UP_THRESHOLD" class="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
          Meta de &gt;90% Superada!
        </span>
        <span class="text-xs font-mono text-emerald-300 font-bold">{{ Math.round(accuracy) }}%</span>
      </div>
      <h3 class="text-base font-bold text-white">Subir para o Nível N={{ n + 1 }}?</h3>
      <p class="text-xs text-zinc-400">
        Você superou os 90% de acerto. Clique ao lado para avançar ao próximo nível.
      </p>
    </div>
    <button 
      @click="$emit('levelUp')"
      class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md shadow-emerald-500/20 active:scale-95"
    >
      <TrendingUp class="w-4 h-4" />
      Subir para N={{ n + 1 }}
    </button>
  </div>

  <div v-else class="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3 text-xs">
    <div class="flex items-center gap-3">
      <div class="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 shrink-0">
        <TrendingUp class="w-4 h-4" />
      </div>
      <div class="space-y-0.5">
        <p class="font-semibold text-zinc-300">Meta para Subir de Nível: &gt;90% de Acerto</p>
        <p class="text-zinc-500 text-[11px]">
          Você atingiu {{ Math.round(accuracy) }}%. Faltam {{ Math.max(1, LEVEL_UP_THRESHOLD + 1 - Math.round(accuracy)) }}% de precisão para desbloquear e avançar para o Nível N={{ n + 1 }}.
        </p>
      </div>
    </div>
    <span class="font-mono text-xs px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 font-semibold shrink-0">
      {{ Math.round(accuracy) }}% / {{ LEVEL_UP_THRESHOLD }}%
    </span>
  </div>
</template>
