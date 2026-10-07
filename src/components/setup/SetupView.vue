<script setup lang="ts">
import { Play } from 'lucide-vue-next';
import { useGameSession } from '../../composables/useGameSession';
import AudioSettingsPanel from './audio/AudioSettingsPanel.vue';
import ProtocolCard from './ProtocolCard.vue';
import TrainingSettingsCard from './TrainingSettingsCard.vue';

const { startGame } = useGameSession();
</script>

<template>
  <div class="space-y-8">
    <!--
      Mobile: start button first so it's reachable without scrolling, then settings and protocol.
      Desktop: settings on the left; protocol on the right with the start button right below it.
    -->
    <div class="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] gap-8">
      <button
        @click="startGame"
        class="md:col-start-2 md:row-start-2 md:self-start w-full h-16 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
      >
        <Play class="w-6 h-6 fill-current" />
        INICIAR TREINAMENTO
      </button>

      <TrainingSettingsCard class="md:col-start-1 md:row-start-1 md:row-span-2" />

      <ProtocolCard class="md:col-start-2 md:row-start-1" />
    </div>

    <AudioSettingsPanel />
  </div>
</template>
