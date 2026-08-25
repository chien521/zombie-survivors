<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div class="w-[min(90vw,28rem)] rounded-3xl bg-gradient-to-b from-[#241a36] to-[#1a2236] p-8 text-center text-white shadow-2xl ring-1 ring-amber-300/30">
      <div class="text-2xl">🏆</div>
      <div class="text-4xl font-black text-amber-300">{{ stats.mode === 'deathmatch' ? t('victory.titleDeathmatch') : t('victory.titleStory') }}</div>
      <div class="mt-1 text-sm text-white/70">
        {{ stats.mode === 'deathmatch' ? t('victory.subtitleDeathmatch', { wave: stats.wave }) : t('victory.subtitleStory', { n: stats.bossTotal }) }}
      </div>

      <div class="my-5 grid grid-cols-3 gap-3">
        <div class="rounded-2xl bg-white/5 p-3">
          <div class="text-xs text-white/60">{{ t('victory.clearTime') }}</div>
          <div class="text-2xl font-black">{{ timeText }}</div>
        </div>
        <div class="rounded-2xl bg-white/5 p-3">
          <div class="text-xs text-white/60">{{ t('gameover.kills') }}</div>
          <div class="text-2xl font-black">{{ stats.kills }}</div>
        </div>
        <div class="rounded-2xl bg-white/5 p-3">
          <div class="text-xs text-white/60">{{ t('gameover.level') }}</div>
          <div class="text-2xl font-black">{{ stats.level }}</div>
        </div>
      </div>

      <div class="mb-6 rounded-2xl bg-amber-400/15 py-2 text-xl font-black text-amber-300">
        {{ t('victory.goldBonus', { n: stats.goldEarned }) }}
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 rounded-full bg-white/10 px-4 py-3 text-lg font-black transition hover:bg-white/20 active:scale-95"
          @click="emit('menu')"
        >
          {{ t('gameover.menu') }}
        </button>
        <button
          class="flex-1 rounded-full bg-amber-400 px-4 py-3 text-lg font-black text-black transition hover:bg-amber-300 active:scale-95"
          @click="emit('restart')"
        >
          {{ t('gameover.restart') }}
        </button>
      </div>

      <a
        href="https://www.facebook.com/people/Book-Ai/61584339789020/"
        target="_blank"
        rel="noopener"
        class="mt-3 block rounded-full bg-[#1877f2] px-4 py-2.5 text-center text-sm font-black text-white transition hover:bg-[#3b8bf5] active:scale-95"
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
</script>
