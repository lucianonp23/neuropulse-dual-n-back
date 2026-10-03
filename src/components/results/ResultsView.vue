<script setup lang="ts">
import { ChevronRight, Play, RotateCcw, Sparkles, Square, Volume2 } from 'lucide-vue-next';
import { computed } from 'vue';
import { useGameSession } from '../../composables/useGameSession';
import { useGameSettings } from '../../composables/useGameSettings';
import { getAccuracyTier } from '../../lib/game-logic';
import AccuracyGauge from './AccuracyGauge.vue';
import { TIER_BAR_CLASS, TIER_MESSAGE } from './accuracy-tier-styles';
import LevelProgressBanner from './LevelProgressBanner.vue';
import ModalityStatsCard from './ModalityStatsCard.vue';

const { settings } = useGameSettings();
const {
  stats,
  accuracy,
  previousN,
  sessionLeveledUp,
  startGame,
  manualLevelUp,
  repeatPreviousLevel,
  backToMenu,
} = useGameSession();

const tier = computed(() => getAccuracyTier(accuracy.value));
/** N the session was actually played at (settings.n may already be the next level). */
const playedN = computed(() => (sessionLeveledUp.value ? previousN.value : settings.value.n));
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
      <div :class="['h-2 w-full', TIER_BAR_CLASS[tier]]" />
      <div class="p-8 space-y-8">
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono uppercase tracking-widest">
            <Sparkles class="w-3.5 h-3.5" />
            Sessão N-Back N={{ playedN }} Concluída
          </div>
          <h2 class="text-3xl font-black text-white">Relatório de Desempenho</h2>
          <p class="text-zinc-500 text-sm">{{ TIER_MESSAGE[tier] }}</p>
        </div>

        <LevelProgressBanner
          :accuracy="accuracy"
          :leveled-up="sessionLeveledUp"
          :n="settings.n"
          :previous-n="previousN"
          @level-up="manualLevelUp"
        />

        <div class="flex justify-center">
          <AccuracyGauge :accuracy="accuracy" :tier="tier" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <ModalityStatsCard
            title="Espacial (Posição)"
            :correct="stats.correctPosition"
            :total-matches="stats.totalMatchesPosition"
            :false-positives="stats.falsePositivesPosition"
            :missed="stats.missedPosition"
          >
            <template #icon><Square class="w-4 h-4 text-emerald-400" /></template>
          </ModalityStatsCard>

          <ModalityStatsCard
            title="Auditivo (Letra/Som)"
            :correct="stats.correctLetter"
            :total-matches="stats.totalMatchesLetter"
            :false-positives="stats.falsePositivesLetter"
            :missed="stats.missedLetter"
          >
            <template #icon><Volume2 class="w-4 h-4 text-emerald-400" /></template>
          </ModalityStatsCard>
        </div>

        <!-- Navigation CTAs -->
        <div class="flex flex-col gap-3">
          <button 
            @click="startGame"
            class="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] shadow-lg shadow-emerald-500/20"
          >
            <template v-if="sessionLeveledUp">
              <Play class="w-5 h-5 fill-current" />
              INICIAR NOVO NÍVEL (N={{ settings.n }})
            </template>
            <template v-else>
              <RotateCcw class="w-5 h-5" />
              TENTAR NOVAMENTE NÍVEL N={{ settings.n }}
            </template>
          </button>

          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="backToMenu"
              class="flex-1 h-12 border border-zinc-800 hover:bg-zinc-800/80 text-zinc-300 font-medium text-xs font-mono rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <ChevronRight class="w-4 h-4 rotate-180" />
              VOLTAR AO MENU PRINCIPAL
            </button>

            <button 
              v-if="sessionLeveledUp"
              @click="repeatPreviousLevel"
              class="flex-1 h-12 border border-zinc-800/80 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 font-medium text-xs font-mono rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              REPETIR NÍVEL N={{ previousN }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
