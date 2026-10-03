<script setup lang="ts">
import ToggleSwitch from '../ui/ToggleSwitch.vue';

defineProps<{
  label: string;
  description: string;
  on: boolean;
  /** Status pill shown next to the label. */
  badge?: { text: string; tone: 'on' | 'warning' | 'neutral' };
  toggleTitle?: string;
}>();

defineEmits<{ toggle: [] }>();

const badgeTones = {
  on: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  neutral: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};
</script>

<template>
  <div class="flex items-center justify-between p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800">
    <div class="space-y-0.5 pr-3">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-white flex items-center gap-1.5">
          <slot name="icon" />
          {{ label }}
        </label>
        <span
          v-if="badge"
          :class="['text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold', badgeTones[badge.tone]]"
        >
          {{ badge.text }}
        </span>
      </div>
      <p class="text-xs text-zinc-500">{{ description }}</p>
    </div>
    <ToggleSwitch :on="on" :title="toggleTitle" @toggle="$emit('toggle')" />
  </div>
</template>
