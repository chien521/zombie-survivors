<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-white">
    <background-polygons />

    <div class="relative flex w-full max-w-md flex-col gap-5 px-6">
      <div class="flex items-center gap-3">
        <button
          class="rounded-full bg-white/10 px-4 py-2 font-black backdrop-blur-md transition hover:bg-white/20 active:scale-95"
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
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.16s, background 0.16s;
}
.mode-card:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: scale(1.03);
}
.mode-card:active {
  transform: scale(0.98);
}
.mode-card--dm {
  background: linear-gradient(180deg, rgba(220, 60, 60, 0.28), rgba(120, 20, 20, 0.28));
  border-color: rgba(255, 120, 120, 0.5);
}
.mode-card--dm:hover {
  background: linear-gradient(180deg, rgba(240, 80, 80, 0.4), rgba(140, 30, 30, 0.4));
}
</style>
