<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/65 backdrop-blur-sm">
    <div class="w-[min(90vw,26rem)] rounded-md bg-[#d4e8b8] p-8 text-center text-[#14210f] shadow-2xl ring-[3px] ring-[#14210f]">
      <div class="text-4xl font-black text-[#8a2020]">{{ t('gameover.title') }}</div>

      <!-- 死鬥：波數 + 分數 -->
      <div v-if="stats.mode === 'deathmatch'" class="my-4 rounded-md bg-white/35 py-3 ring-2 ring-[#8a2020]">
        <div class="text-sm text-[#14210f]/70">{{ t('gameover.wave', { n: stats.wave }) }}</div>
        <div class="text-3xl font-black text-[#a67c00]">{{ t('gameover.score', { n: deathScore }) }}</div>
      </div>

      <div class="my-5 grid grid-cols-3 gap-3">
        <div class="rounded-md bg-white/35 p-3">
          <div class="text-xs text-[#14210f]/70">{{ t('gameover.survived') }}</div>
          <div class="text-2xl font-black">{{ timeText }}</div>
        </div>
        <div class="rounded-md bg-white/35 p-3">
          <div class="text-xs text-[#14210f]/70">{{ t('gameover.kills') }}</div>
          <div class="text-2xl font-black">{{ stats.kills }}</div>
        </div>
        <div class="rounded-md bg-white/35 p-3">
          <div class="text-xs text-[#14210f]/70">{{ t('gameover.level') }}</div>
          <div class="text-2xl font-black">{{ stats.level }}</div>
        </div>
      </div>

      <div class="mb-6 rounded-md bg-white/35 py-2 text-xl font-black text-[#a67c00] ring-2 ring-[#a67c00]">
        {{ t('gameover.gold', { n: stats.goldEarned }) }}
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 rounded-md bg-white/40 px-4 py-3 text-lg font-black ring-2 ring-[#14210f] transition hover:bg-white/65 active:scale-95"
          @click="emit('menu')"
        >
          {{ t('gameover.menu') }}
        </button>
        <button
          class="flex-1 rounded-md bg-white/40 px-4 py-3 text-lg font-black text-[#8a2020] ring-[3px] ring-[#8a2020] transition hover:bg-white/65 active:scale-95"
          @click="emit('restart')"
        >
          {{ t('gameover.restart') }}
        </button>
      </div>

      <a
        href="https://www.facebook.com/people/Book-Ai/61584339789020/"
        target="_blank"
        rel="noopener"
        class="mt-3 block rounded-md bg-[#1877f2] px-4 py-2.5 text-center text-sm font-black text-white transition hover:bg-[#3b8bf5] active:scale-95"
      >
        {{ t('gameover.facebook') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameStats } from '../game/game';
import { useI18n } from '../i18n';

const { t } = useI18n();
const props = defineProps<{ stats: GameStats }>();
const emit = defineEmits<{ (e: 'restart'): void; (e: 'menu'): void }>();

const timeText = computed(() => {
  const total = Math.floor(props.stats.time);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});
/** 死鬥分數：波數×1000 + 擊殺 + 秒數（與後端 deathmatchScore 一致） */
const deathScore = computed(() => props.stats.wave * 1000 + props.stats.kills + Math.floor(props.stats.time));
</script>
