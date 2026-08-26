<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/65 backdrop-blur-sm">
    <div class="w-[min(90vw,26rem)] rounded-xl bg-[#1a1d29] p-8 text-center text-white shadow-2xl ring-1 ring-[#2a2f45]">
      <div class="text-4xl font-black text-rose-400">{{ t('gameover.title') }}</div>

      <!-- 死鬥：波數 + 分數 -->
      <div v-if="stats.mode === 'deathmatch'" class="my-4 rounded-xl bg-[#2a2f45] py-3 ring-1 ring-rose-400/40">
        <div class="text-sm text-white/60">{{ t('gameover.wave', { n: stats.wave }) }}</div>
        <div class="text-3xl font-black text-amber-300">{{ t('gameover.score', { n: deathScore }) }}</div>
      </div>

      <div class="my-5 grid grid-cols-3 gap-3">
        <div class="rounded-xl bg-[#2a2f45] p-3">
          <div class="text-xs text-white/60">{{ t('gameover.survived') }}</div>
          <div class="text-2xl font-black">{{ timeText }}</div>
        </div>
        <div class="rounded-xl bg-[#2a2f45] p-3">
          <div class="text-xs text-white/60">{{ t('gameover.kills') }}</div>
          <div class="text-2xl font-black">{{ stats.kills }}</div>
        </div>
        <div class="rounded-xl bg-[#2a2f45] p-3">
          <div class="text-xs text-white/60">{{ t('gameover.level') }}</div>
          <div class="text-2xl font-black">{{ stats.level }}</div>
        </div>
      </div>

      <div class="mb-6 rounded-xl bg-[#2a2f45] py-2 text-xl font-black text-[#ffe066] ring-2 ring-[#ffe066]/60">
        {{ t('gameover.gold', { n: stats.goldEarned }) }}
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 rounded-xl bg-[#2a2f45] px-4 py-3 text-lg font-black ring-2 ring-[#5a6cad] transition hover:bg-[#394162] active:scale-95"
          @click="emit('menu')"
        >
          {{ t('gameover.menu') }}
        </button>
        <button
          class="flex-1 rounded-xl bg-[#2a2f45] px-4 py-3 text-lg font-black text-[#ffe066] ring-2 ring-[#ffe066] transition hover:bg-[#394162] active:scale-95"
          @click="emit('restart')"
        >
          {{ t('gameover.restart') }}
        </button>
      </div>

      <a
        href="https://www.facebook.com/people/Book-Ai/61584339789020/"
        target="_blank"
        rel="noopener"
        class="mt-3 block rounded-xl bg-[#1877f2] px-4 py-2.5 text-center text-sm font-black text-white transition hover:bg-[#3b8bf5] active:scale-95"
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
