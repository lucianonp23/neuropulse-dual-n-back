<script setup lang="ts">
defineProps<{
  title: string;
  correct: number;
  totalMatches: number;
  falsePositives: number;
  missed: number;
}>();
</script>

<template>
  <div class="p-5 bg-zinc-950/60 rounded-2xl border border-zinc-800 space-y-2">
    <div class="flex items-center justify-between">
      <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest">{{ title }}</p>
      <slot name="icon" />
    </div>
    <div class="flex items-baseline gap-2">
      <span class="text-2xl font-bold text-white">{{ correct }}</span>
      <span class="text-xs text-zinc-500">/ {{ totalMatches }} acertos</span>
    </div>
    <div class="text-[11px] text-zinc-500 space-y-0.5 border-t border-zinc-800/80 pt-2">
      <p>Falsos positivos: <span class="text-rose-400 font-mono">{{ falsePositives }}</span></p>
      <p>Omissões (não respondeu): <span class="text-amber-400 font-mono">{{ missed }}</span></p>
    </div>
  </div>
</template>
