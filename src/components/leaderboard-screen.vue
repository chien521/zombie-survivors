<template>
  <div class="absolute inset-0 overflow-auto text-white">
    <background-polygons />

    <div class="relative mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <div class="flex items-center gap-3 pt-4">
        <button
          class="rounded-full bg-white/10 px-4 py-2 font-black backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-3xl font-black tracking-wider">{{ t('leaderboard.title') }}</h1>
        <span
          class="rounded-full px-2 py-0.5 text-xs font-black"
          :class="isGlobal ? 'bg-lime-400 text-black' : 'bg-white/15 text-white/70'"
        >
          {{ isGlobal ? t('leaderboard.global') : t('leaderboard.local') }}
        </span>
      </div>

      <!-- 模式切換：劇情 / 死鬥 -->
      <div class="flex gap-2">
        <button
          v-for="g in gameModes"
          :key="g.id"
          class="flex-1 rounded-full px-3 py-2 text-sm font-black backdrop-blur-md transition active:scale-95"
          :class="gameMode === g.id ? 'bg-rose-400 text-black' : 'bg-black/40 text-white/70 hover:bg-black/60'"
          @click="selectGameMode(g.id)"
        >
          {{ g.label }}
        </button>
      </div>

      <!-- 劇情：破關榜 / 生存榜 -->
      <div v-if="gameMode === 'story'" class="flex gap-2">
        <button
          v-for="m in boards"
          :key="m.id"
          class="flex-1 rounded-full px-3 py-2 text-sm font-black backdrop-blur-md transition active:scale-95"
          :class="board === m.id ? 'bg-lime-400 text-black' : 'bg-black/40 text-white/70 hover:bg-black/60'"
          @click="selectBoard(m.id)"
        >
          {{ m.label }}
        </button>
      </div>

      <p class="-mt-1 text-center text-xs text-white/45">{{ hint }}</p>

      <!-- 難度分頁 -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="rounded-full px-3 py-1 text-sm font-black backdrop-blur-md transition active:scale-95"
          :class="selected === t.id ? 'bg-amber-400 text-black' : 'bg-black/40 text-white/70 hover:bg-black/60'"
          @click="selectTab(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <div v-if="records.length === 0" class="rounded-2xl bg-white/5 p-8 text-center text-white/60">
        {{ emptyHint }}
      </div>

      <!-- 死鬥榜 -->
      <div v-else-if="gameMode === 'deathmatch'" class="overflow-hidden rounded-2xl bg-black/40 backdrop-blur-md ring-1 ring-white/10">
        <div class="grid grid-cols-[2.5rem_1fr_3rem_3.5rem_4.5rem] gap-2 border-b border-white/10 px-4 py-2 text-xs font-black text-white/50">
          <span>#</span>
          <span>{{ t('leaderboard.colPlayer') }}</span>
          <span class="text-right">{{ t('leaderboard.colWave') }}</span>
          <span class="text-right">{{ t('leaderboard.colKills') }}</span>
          <span class="text-right">{{ t('leaderboard.colScore') }}</span>
        </div>
        <div
          v-for="(r, i) in records"
          :key="i"
          class="grid grid-cols-[2.5rem_1fr_3rem_3.5rem_4.5rem] items-center gap-2 px-4 py-2 text-sm"
          :class="i % 2 ? 'bg-white/0' : 'bg-white/5'"
        >
          <span class="font-black" :class="rankClass(i)">{{ i + 1 }}</span>
          <span class="min-w-0 truncate font-bold">
            {{ r.name || t('leaderboard.defaultName') }}
            <span class="text-[0.66rem] font-normal text-white/45">{{ r.character }}</span>
            <span v-if="selected === ''" class="ml-1 text-[0.62rem]" :style="{ color: diffColor(r.difficulty) }">
              {{ diffLabel(r.difficulty) }}
            </span>
          </span>
          <span class="text-right font-black text-rose-300">{{ r.wave }}</span>
          <span class="text-right">{{ r.kills }}</span>
          <span class="text-right font-mono text-amber-300">{{ r.score }}</span>
        </div>
      </div>

      <!-- 劇情榜（破關/生存） -->
      <div v-else class="overflow-hidden rounded-2xl bg-black/40 backdrop-blur-md ring-1 ring-white/10">
        <div class="grid grid-cols-[2.5rem_1fr_4.5rem_3.5rem_3rem] gap-2 border-b border-white/10 px-4 py-2 text-xs font-black text-white/50">
          <span>#</span>
          <span>{{ t('leaderboard.colPlayer') }}</span>
          <span class="text-right">{{ board === 'cleared' ? t('leaderboard.colCleared') : t('leaderboard.colSurvived') }}</span>
          <span class="text-right">{{ t('leaderboard.colKills') }}</span>
          <span class="text-right">{{ t('leaderboard.colLevel') }}</span>
        </div>
        <div
          v-for="(r, i) in records"
          :key="i"
          class="grid grid-cols-[2.5rem_1fr_4.5rem_3.5rem_3rem] items-center gap-2 px-4 py-2 text-sm"
          :class="i % 2 ? 'bg-white/0' : 'bg-white/5'"
        >
          <span class="font-black" :class="rankClass(i)">{{ i + 1 }}</span>
          <span class="min-w-0 truncate font-bold">
            {{ r.name || t('leaderboard.defaultName') }}
            <span class="text-[0.66rem] font-normal text-white/45">{{ r.character }}</span>
            <span v-if="selected === ''" class="ml-1 text-[0.62rem]" :style="{ color: diffColor(r.difficulty) }">
              {{ diffLabel(r.difficulty) }}
            </span>
          </span>
          <span class="text-right font-mono" :class="board === 'cleared' ? 'text-amber-300' : ''">{{ timeText(r.time) }}</span>
          <span class="text-right">{{ r.kills }}</span>
          <span class="text-right">{{ r.level }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BackgroundPolygons from './background-polygons.vue';
import { loadRecords, type RunRecord } from '../game/leaderboard';
import { fetchLeaderboard } from '../game/api';
import { DIFFICULTIES, getDifficulty } from '../game/difficulty';
import { useI18n } from '../i18n';

const { t } = useI18n();
const emit = defineEmits<{ (e: 'back'): void }>();

type GameMode = 'story' | 'deathmatch';
type Board = 'cleared' | 'survival';
const gameModes = computed<{ id: GameMode; label: string }[]>(() => [
  { id: 'story', label: t('leaderboard.modeStory') },
  { id: 'deathmatch', label: t('leaderboard.modeDeathmatch') },
]);
const boards = computed<{ id: Board; label: string }[]>(() => [
  { id: 'cleared', label: t('leaderboard.boardCleared') },
  { id: 'survival', label: t('leaderboard.boardSurvival') },
]);
const tabs = computed(() => [
  { id: '', label: t('leaderboard.tabAll') },
  ...DIFFICULTIES.map((d) => ({ id: d.id, label: `${d.emoji} ${t(d.nameKey)}` })),
]);

const gameMode = ref<GameMode>('story');
const board = ref<Board>('cleared');
const selected = ref('');
const records = ref<RunRecord[]>([]);
const isGlobal = ref(false);

const hint = computed(() => {
  if (gameMode.value === 'deathmatch') return t('leaderboard.hintDeathmatch');
  return board.value === 'cleared' ? t('leaderboard.hintCleared') : t('leaderboard.hintSurvival');
});
const emptyHint = computed(() => {
  if (gameMode.value === 'deathmatch') return t('leaderboard.emptyDeathmatch');
  return board.value === 'cleared' ? t('leaderboard.emptyCleared') : t('leaderboard.emptySurvival');
});

async function refresh() {
  const diff = selected.value;
  const gm = gameMode.value;
  /** 本機回退：依模式過濾 + 排序 */
  records.value = loadRecords()
    .filter((r) => {
      if ((r.mode ?? 'story') !== gm) return false;
      if (diff && r.difficulty !== diff) return false;
      if (gm === 'story') return !!r.won === (board.value === 'cleared');
      return true;
    })
    .sort((a, b) =>
      gm === 'deathmatch' ? b.score - a.score : board.value === 'cleared' ? a.time - b.time : b.time - a.time,
    )
    .slice(0, 10);
  isGlobal.value = false;
  const global = await fetchLeaderboard(10, diff || undefined, board.value, gm);
  if (global) {
    records.value = global;
    isGlobal.value = true;
  }
}
function selectGameMode(g: GameMode) {
  gameMode.value = g;
  void refresh();
}
function selectBoard(b: Board) {
  board.value = b;
  void refresh();
}
function selectTab(id: string) {
  selected.value = id;
  void refresh();
}
onMounted(refresh);

function timeText(t: number) {
  const total = Math.floor(t);
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
}
function rankClass(i: number) {
  return ['text-amber-300', 'text-slate-200', 'text-orange-400'][i] ?? 'text-white/50';
}
function diffLabel(id: string) {
  const d = getDifficulty(id || 'easy');
  return `${d.emoji}${t(d.nameKey)}`;
}
function diffColor(id: string) {
  return getDifficulty(id || 'easy').color;
}
</script>
