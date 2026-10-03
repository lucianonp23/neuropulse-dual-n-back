<script setup lang="ts">
withDefaults(defineProps<{
  min: number;
  max: number;
  step: number;
  size?: 'md' | 'sm';
}>(), { size: 'md' });

const model = defineModel<number>({ required: true });
</script>

<template>
  <input
    type="range"
    v-model.number="model"
    :min="min"
    :max="max"
    :step="step"
    :class="[
      size === 'md' ? 'h-2' : 'h-1.5',
      'w-full bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500'
    ]"
  />
</template>

<style>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #10b981;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}
</style>
