<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div class="w-[min(90vw,28rem)] rounded-md bg-[#d4e8b8] p-8 text-center text-[#14210f] shadow-2xl ring-[3px] ring-[#a67c00]">
      <div class="text-2xl">🏆</div>
      <div class="text-4xl font-black text-[#a67c00]">{{ stats.mode === 'deathmatch' ? t('victory.titleDeathmatch') : t('victory.titleStory') }}</div>
      <div class="mt-1 text-sm text-[#14210f]/70">
        {{ stats.mode === 'deathmatch' ? t('victory.subtitleDeathmatch', { wave: stats.wave }) : t('victory.subtitleStory', { n: stats.bossTotal }) }}
      </div>

      <div class="my-5 grid grid-cols-3 gap-3">
        <div class="rounded-md bg-white/35 p-3">
          <div class="text-xs text-[#14210f]/70">{{ t('victory.clearTime') }}</div>
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
        {{ t('victory.goldBonus', { n: stats.goldEarned }) }}
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 rounded-md bg-white/40 px-4 py-3 text-lg font-black ring-2 ring-[#14210f] transition hover:bg-white/65 active:scale-95"
          @click="emit('menu')"
        >
          {{ t('gameover.menu') }}
        </button>
        <button
          class="flex-1 rounded-md bg-white/40 px-4 py-3 text-lg font-black text-[#a67c00] ring-[3px] ring-[#a67c00] transition hover:bg-white/65 active:scale-95"
          @click="emit('restart')"
        >
          {{ t('gameover.restart') }}
        </button>
      </div>

      <button
        v-if="viverse.state.status !== 'unavailable' && !cheated"
        class="mt-3 block w-full rounded-md border-2 px-4 py-2.5 text-center text-sm font-black transition active:scale-95"
        :class="viverseBtnClass"
        :disabled="viverseSubmitState === 'submitting' || viverseSubmitState === 'done'"
        @click="submitToViverse"
      >
        {{ viverseBtnLabel }}
      </button>

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
import { computed, ref } from 'vue';
import type { GameStats } from '../game/game';
import { useI18n } from '../i18n';
import { useViverse } from '../viverse/useViverse';
import { pickLeaderboard } from '../viverse/leaderboardSubmit';

const { t } = useI18n();
const props = defineProps<{ stats: GameStats; cheated?: boolean }>();
const emit = defineEmits<{ (e: 'restart'): void; (e: 'menu'): void }>();
const viverse = useViverse();

const timeText = computed(() => {
  const total = Math.floor(props.stats.time);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});

/** 送 VIVERSE 排行榜（本結算畫面一律代表成功：破關榜或死鬥榜，見 pickLeaderboard） */
const viverseSubmitState = ref<'idle' | 'submitting' | 'done' | 'error'>('idle');
const viverseBtnLabel = computed(() => {
  if (viverseSubmitState.value === 'submitting') return t('leaderboard.viverseSubmitting');
  if (viverseSubmitState.value === 'done') return t('leaderboard.viverseSubmitted');
  if (viverseSubmitState.value === 'error') return t('leaderboard.viverseSubmitFailed');
  return t('leaderboard.viverseSubmit');
});
const viverseBtnClass = computed(() =>
  viverseSubmitState.value === 'done'
    ? 'border-[#3f7a3a] text-[#3f7a3a] bg-white/30'
    : viverseSubmitState.value === 'error'
      ? 'border-[#8a2020] text-[#8a2020] bg-white/30'
      : 'border-[#a67c00] text-[#a67c00] bg-white/30 hover:bg-white/50',
);
async function submitToViverse() {
  if (viverseSubmitState.value !== 'idle') return;
  viverseSubmitState.value = 'submitting';
  const { name, value } = pickLeaderboard(props.stats, true);
  const ok = await viverse.ensureLoginAndSubmit(name, value, { reason: 'leaderboard', name, value });
  if (ok === null) return;
  viverseSubmitState.value = ok ? 'done' : 'error';
}
</script>
