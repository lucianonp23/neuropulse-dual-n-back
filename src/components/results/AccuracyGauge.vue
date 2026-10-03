<script setup lang="ts">
import type { AccuracyTier } from '../../lib/game-logic';
import { TIER_TEXT_CLASS } from './accuracy-tier-styles';

defineProps<{ accuracy: number; tier: AccuracyTier }>();

const RADIUS = 88;
const CIRCUMFERENCE = 553; // ≈ 2πr
</script>

<template>
  <div class="relative w-48 h-48 flex items-center justify-center">
    <svg class="w-full h-full -rotate-90">
      <circle cx="96" cy="96" :r="RADIUS" fill="none" stroke="currentColor" stroke-width="8" class="text-zinc-800" />
      <circle
        cx="96"
        cy="96"
        :r="RADIUS"
        fill="none"
        stroke="currentColor"
        stroke-width="8"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="CIRCUMFERENCE - (CIRCUMFERENCE * accuracy) / 100"
        :class="['transition-all duration-1000 ease-out', TIER_TEXT_CLASS[tier]]"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-5xl font-black text-white">{{ Math.round(accuracy) }}%</span>
      <span class="text-xs font-mono text-zinc-500 uppercase tracking-widest">Precisão Global</span>
    </div>
  </div>
</template>
