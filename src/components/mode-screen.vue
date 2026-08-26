<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-white">
    <background-polygons />

    <div class="relative flex w-full max-w-md flex-col gap-5 px-6">
      <div class="flex items-center gap-3">
        <button
          class="rounded-xl bg-[#2a2f45] px-4 py-2 font-black ring-2 ring-[#5a6cad] transition hover:bg-[#394162] active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-2xl font-black tracking-wider sm:text-3xl">{{ t('mode.title') }}</h1>
      </div>

      <button class="mode-card" @click="emit('select', 'story')">
        <div class="text-3xl font-black">{{ t('mode.story') }}</div>
        <p class="mt-1 text-sm text-white/70">{{ t('mode.storyDesc') }}</p>
      </button>

      <button class="mode-card mode-card--dm" @click="emit('select', 'deathmatch')">
        <div class="text-3xl font-black">{{ t('mode.deathmatch') }}</div>
        <p class="mt-1 text-sm text-white/80">
          {{ t('mode.deathmatchDesc') }}
        </p>
        <p class="mt-1 text-xs text-amber-300/90">
          {{ t('mode.deathmatchNote', { levelCap: DEATHMATCH.levelCap, clearWave: DEATHMATCH.clearWave }) }}
        </p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackgroundPolygons from './background-polygons.vue';
import type { GameMode } from '../game/game';
import { DEATHMATCH } from '../game/deathmatch';
import { useI18n } from '../i18n';

const { t } = useI18n();
const emit = defineEmits<{ (e: 'select', mode: GameMode): void; (e: 'back'): void }>();
</script>

<style scoped>
.mode-card {
  border-radius: 0.875rem;
  padding: 1.25rem 1.5rem;
  text-align: left;
  background: #2a2f45;
  border: 2px solid #5a6cad;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.16s, background 0.16s;
}
.mode-card:hover {
  background: #394162;
  transform: scale(1.02);
}
.mode-card:active {
  transform: scale(0.98);
}
/** 死鬥模式：同一套卡片語彙，用紅色邊框標示「較硬核」 */
.mode-card--dm {
  border-color: #ff6b6b;
}
.mode-card--dm:hover {
  background: #3a2f38;
}
</style>
