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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <TrainingSettingsCard />

      <div class="flex flex-col justify-between space-y-6">
        <ProtocolCard />

        <button 
          @click="startGame"
          class="w-full h-16 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play class="w-6 h-6 fill-current" />
          INICIAR TREINAMENTO
        </button>
      </div>
    </div>

    <AudioSettingsPanel />
  </div>
</template>
