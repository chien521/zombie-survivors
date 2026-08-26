<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center overflow-auto text-white">
    <background-polygons />

    <div class="relative flex w-full max-w-3xl flex-col gap-5 p-6">
      <div class="flex items-center gap-3">
        <button
          class="rounded-xl bg-[#2a2f45] px-4 py-2 font-black ring-2 ring-[#5a6cad] transition hover:bg-[#394162] active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-3xl font-black tracking-wider">{{ t('difficulty.title') }}</h1>
      </div>

      <div class="flex flex-col gap-3">
        <button
          v-for="d in difficulties"
          :key="d.id"
          class="flex items-center gap-4 rounded-xl bg-[#2a2f45] p-4 text-left transition hover:scale-[1.02] hover:bg-[#394162]"
          :style="{ border: `2px solid ${d.color}` }"
          @click="emit('select', d.id)"
        >
          <span class="text-4xl">{{ d.emoji }}</span>
          <div class="flex-1">
            <div class="text-xl font-black" :style="{ color: d.color }">{{ t(d.nameKey) }}</div>
            <div class="text-sm text-white/60">{{ t(d.descKey) }}</div>
          </div>
          <div class="text-right text-xs text-white/55">
            <div>{{ t('difficulty.enemyHp', { mul: d.enemyHp }) }}</div>
            <div>{{ t('difficulty.goldReward', { mul: d.goldReward }) }}</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackgroundPolygons from './background-polygons.vue';
import { DIFFICULTIES } from '../game/difficulty';
import { useI18n } from '../i18n';

const { t } = useI18n();
const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'back'): void;
}>();

const difficulties = DIFFICULTIES;
</script>
