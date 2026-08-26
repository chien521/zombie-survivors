<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-[#14210f]">
    <background-polygons />

    <div class="relative flex w-full max-w-md flex-col gap-5 px-6">
      <div class="flex items-center gap-3">
        <button
          class="rounded-md bg-white/40 px-4 py-2 font-black ring-[3px] ring-[#14210f] transition hover:bg-white/60 active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-2xl font-black tracking-wider sm:text-3xl">{{ t('mode.title') }}</h1>
      </div>

      <button class="mode-card" @click="emit('select', 'story')">
        <div class="text-3xl font-black">{{ t('mode.story') }}</div>
        <p class="mt-1 text-sm text-[#14210f]/70">{{ t('mode.storyDesc') }}</p>
      </button>

      <button class="mode-card mode-card--dm" @click="emit('select', 'deathmatch')">
        <div class="text-3xl font-black">{{ t('mode.deathmatch') }}</div>
        <p class="mt-1 text-sm text-[#14210f]/80">
          {{ t('mode.deathmatchDesc') }}
        </p>
        <p class="mt-1 text-xs font-bold text-[#8a2020]">
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
  border-radius: 0.5rem;
  padding: 1.25rem 1.5rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.35);
  border: 3px solid #14210f;
  cursor: pointer;
  transition: transform 0.16s, background 0.16s;
}
.mode-card:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.02);
}
.mode-card:active {
  transform: scale(0.98);
}
/** 死鬥模式：同一套卡片語彙，用血紅邊框標示「較硬核」 */
.mode-card--dm {
  border-color: #8a2020;
}
.mode-card--dm:hover {
  background: rgba(255, 255, 255, 0.55);
}
</style>
