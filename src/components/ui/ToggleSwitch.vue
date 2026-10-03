<script setup lang="ts">
withDefaults(defineProps<{
  on: boolean;
  size?: 'md' | 'sm';
  title?: string;
}>(), { size: 'md' });

defineEmits<{ toggle: [] }>();

const sizes = {
  md: { track: 'h-6 w-11', knob: 'h-5 w-5', onOffset: 'translate-x-5' },
  sm: { track: 'h-5 w-9', knob: 'h-4 w-4', onOffset: 'translate-x-4' },
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="on"
    :title="title"
    @click="$emit('toggle')"
    :class="[
      sizes[size].track,
      on ? 'bg-emerald-500' : 'bg-zinc-700',
      'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
    ]"
  >
    <span
      aria-hidden="true"
      :class="[
        sizes[size].knob,
        on ? sizes[size].onOffset : 'translate-x-0',
        'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
      ]"
    />
  </button>
</template>
