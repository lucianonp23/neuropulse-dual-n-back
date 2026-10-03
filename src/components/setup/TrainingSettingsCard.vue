<script setup lang="ts">
import { Settings as SettingsIcon, TrendingUp } from 'lucide-vue-next';
import { useGameSettings } from '../../composables/useGameSettings';
import { MAX_N, MIN_N } from '../../lib/game-logic';
import RangeInput from '../ui/RangeInput.vue';
import SettingToggleRow from './SettingToggleRow.vue';

const { settings, toggleDual, toggleFeedback, toggleAutoLevelUp } = useGameSettings();

const sliders = [
  {
    key: 'n',
    label: 'N-Back Level (Passos)',
    min: MIN_N, max: MAX_N, step: 1,
    format: (v: number) => `N = ${v}`,
    ticks: ['1 (Iniciante)', '2 (Padrão)', '4 (Avançado)', '8 (Mestre)'],
  },
  {
    key: 'interval',
    label: 'Intervalo entre estímulos',
    min: 1000, max: 5000, step: 500,
    format: (v: number) => `${(v / 1000).toFixed(1)}s`,
  },
  {
    key: 'trials',
    label: 'Estímulos por Sessão',
    min: 15, max: 40, step: 5,
    format: (v: number) => `${v} trials`,
  },
] as const;
</script>

<template>
  <div class="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-3xl p-6 space-y-6">
    <div class="flex items-center justify-between border-b border-zinc-800/80 pb-4">
      <div class="space-y-0.5">
        <h2 class="flex items-center gap-2 text-white text-lg font-bold">
          <SettingsIcon class="w-5 h-5 text-emerald-400" />
          Parâmetros do Treino
        </h2>
        <p class="text-zinc-500 text-xs">Configure o nível de esforço cognitivo</p>
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="slider in sliders" :key="slider.key" class="space-y-2">
        <div class="flex justify-between items-center text-sm">
          <label class="font-medium text-zinc-300">{{ slider.label }}</label>
          <span class="text-emerald-400 font-mono font-bold text-base px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
            {{ slider.format(settings[slider.key]) }}
          </span>
        </div>
        <RangeInput v-model="settings[slider.key]" :min="slider.min" :max="slider.max" :step="slider.step" />
        <div v-if="'ticks' in slider" class="flex justify-between text-[10px] font-mono text-zinc-600">
          <span v-for="tick in slider.ticks" :key="tick">{{ tick }}</span>
        </div>
      </div>

      <SettingToggleRow
        label="Modo Dual (Espacial + Auditivo)"
        description="Treina ambos os canais em paralelo"
        :on="settings.dual"
        @toggle="toggleDual"
      />

      <SettingToggleRow
        label="Feedback de Acertos e Erros"
        :description="settings.feedback
          ? 'Sinais visuais (verde/vermelho) e sonoros instantâneos após cada clique.'
          : 'Modo teste cego: cliques são registrados sem confirmação imediata de acerto ou erro.'"
        :badge="settings.feedback ? { text: 'Ativado', tone: 'on' } : { text: 'Desligado', tone: 'warning' }"
        :on="settings.feedback"
        :toggle-title="settings.feedback ? 'Desligar feedback de acertos e erros' : 'Ligar feedback de acertos e erros'"
        @toggle="toggleFeedback"
      />

      <SettingToggleRow
        label="Subir Nível com >90% de Acerto"
        :description="settings.autoLevelUp
          ? 'Ao alcançar mais de 90% de acerto na sessão, você sobe automaticamente de nível (N → N+1).'
          : 'Modo manual: o nível de passos N-Back permanece fixo até você ajustá-lo.'"
        :badge="settings.autoLevelUp ? { text: 'Ativado', tone: 'on' } : { text: 'Manual', tone: 'neutral' }"
        :on="settings.autoLevelUp"
        :toggle-title="settings.autoLevelUp ? 'Desativar auto-avanço de nível' : 'Ativar auto-avanço de nível (>90%)'"
        @toggle="toggleAutoLevelUp"
      >
        <template #icon><TrendingUp class="w-4 h-4 text-emerald-400" /></template>
      </SettingToggleRow>
    </div>
  </div>
</template>
