<template>
  <div class="absolute inset-0 overflow-auto text-[#14210f]">
    <background-polygons />

    <div class="relative mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <div class="flex items-center gap-3 pt-4">
        <button
          class="rounded-md bg-white/40 px-4 py-2 font-black ring-[3px] ring-[#14210f] transition hover:bg-white/60 active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-3xl font-black tracking-wider">{{ t('leaderboard.title') }}</h1>
        <span
          class="rounded-full px-2 py-0.5 text-xs font-black"
          :class="isGlobal ? 'bg-[#4a7a2e] text-white' : 'bg-white/30 text-[#14210f]/70'"
        >
          {{ isGlobal ? t('leaderboard.global') : t('leaderboard.local') }}
        </span>
      </div>

      <!-- 模式切換：劇情 / 死鬥 -->
      <div class="flex gap-2">
        <button
          v-for="g in gameModes"
          :key="g.id"
          class="flex-1 rounded-md px-3 py-2 text-sm font-black transition active:scale-95"
          :class="gameMode === g.id ? 'bg-white/45 text-[#8a2020] ring-[3px] ring-[#8a2020]' : 'bg-white/20 text-[#14210f]/60 ring-2 ring-[#14210f] hover:bg-white/35'"
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
          class="flex-1 rounded-md px-3 py-2 text-sm font-black transition active:scale-95"
          :class="board === m.id ? 'bg-white/45 text-[#4a7a2e] ring-[3px] ring-[#4a7a2e]' : 'bg-white/20 text-[#14210f]/60 ring-2 ring-[#14210f] hover:bg-white/35'"
          @click="selectBoard(m.id)"
        >
          {{ m.label }}
        </button>
      </div>

      <p class="-mt-1 text-center text-xs text-[#14210f]/50">{{ hint }}</p>

      <!-- 難度分頁（僅本機回退榜適用；VIVERSE 全球榜無難度分流） -->
      <div v-if="!isGlobal" class="flex flex-wrap gap-2">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="rounded-md px-3 py-1 text-sm font-black transition active:scale-95"
          :class="selected === t.id ? 'bg-white/45 text-[#a67c00] ring-[3px] ring-[#a67c00]' : 'bg-white/20 text-[#14210f]/60 ring-2 ring-[#14210f] hover:bg-white/35'"
          @click="selectTab(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <div v-if="isGlobal ? viverseRecords.length === 0 : records.length === 0" class="rounded-md bg-white/30 p-8 text-center text-[#14210f]/60 ring-2 ring-[#14210f]">
        {{ emptyHint }}
      </div>

      <!-- VIVERSE 全球榜：只有名次／玩家／數值（VIVERSE API 不回傳擊殺/等級/波數等細節） -->
      <div v-else-if="isGlobal" class="overflow-hidden rounded-md bg-white/30 ring-2 ring-[#14210f]">
        <div class="grid grid-cols-[2.5rem_1fr_5rem] gap-2 border-b border-[#14210f]/20 px-4 py-2 text-xs font-black text-[#14210f]/50">
          <span>#</span>
          <span>{{ t('leaderboard.colPlayer') }}</span>
          <span class="text-right">{{ gameMode === 'deathmatch' ? t('leaderboard.colScore') : board === 'cleared' ? t('leaderboard.colCleared') : t('leaderboard.colSurvived') }}</span>
        </div>
        <div
          v-for="r in viverseRecords"
          :key="r.rank"
          class="grid grid-cols-[2.5rem_1fr_5rem] items-center gap-2 px-4 py-2 text-sm"
          :class="r.rank % 2 ? 'bg-white/20' : 'bg-transparent'"
        >
          <span class="font-black" :class="rankClass(r.rank - 1)">{{ r.rank }}</span>
          <span class="min-w-0 truncate font-bold">{{ r.name || t('leaderboard.defaultName') }}</span>
          <span class="text-right font-mono" :class="gameMode === 'deathmatch' ? 'text-[#a67c00]' : ''">
            {{ gameMode === 'deathmatch' ? r.value : timeText(r.value) }}
          </span>
        </div>
      </div>

      <!-- 死鬥榜（本機） -->
      <div v-else-if="gameMode === 'deathmatch'" class="overflow-hidden rounded-md bg-white/30 ring-2 ring-[#14210f]">
        <div class="grid grid-cols-[2.5rem_1fr_3rem_3.5rem_4.5rem] gap-2 border-b border-[#14210f]/20 px-4 py-2 text-xs font-black text-[#14210f]/50">
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
          :class="i % 2 ? 'bg-transparent' : 'bg-white/20'"
        >
          <span class="font-black" :class="rankClass(i)">{{ i + 1 }}</span>
          <span class="min-w-0 truncate font-bold">
            {{ r.name || t('leaderboard.defaultName') }}
            <span class="text-[0.66rem] font-normal text-[#14210f]/45">{{ r.character }}</span>
            <span v-if="selected === ''" class="ml-1 text-[0.62rem]" :style="{ color: diffColor(r.difficulty) }">
              {{ diffLabel(r.difficulty) }}
            </span>
          </span>
          <span class="text-right font-black text-[#8a2020]">{{ r.wave }}</span>
          <span class="text-right">{{ r.kills }}</span>
          <span class="text-right font-mono text-[#a67c00]">{{ r.score }}</span>
        </div>
      </div>

      <!-- 劇情榜（本機，破關/生存） -->
      <div v-else class="overflow-hidden rounded-md bg-white/30 ring-2 ring-[#14210f]">
        <div class="grid grid-cols-[2.5rem_1fr_4.5rem_3.5rem_3rem] gap-2 border-b border-[#14210f]/20 px-4 py-2 text-xs font-black text-[#14210f]/50">
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
          :class="i % 2 ? 'bg-transparent' : 'bg-white/20'"
        >
          <span class="font-black" :class="rankClass(i)">{{ i + 1 }}</span>
          <span class="min-w-0 truncate font-bold">
            {{ r.name || t('leaderboard.defaultName') }}
            <span class="text-[0.66rem] font-normal text-[#14210f]/45">{{ r.character }}</span>
            <span v-if="selected === ''" class="ml-1 text-[0.62rem]" :style="{ color: diffColor(r.difficulty) }">
              {{ diffLabel(r.difficulty) }}
            </span>
          </span>
          <span class="text-right font-mono" :class="board === 'cleared' ? 'text-[#a67c00]' : ''">{{ timeText(r.time) }}</span>
          <span class="text-right">{{ r.kills }}</span>
          <span class="text-right">{{ r.level }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import BackgroundPolygons from './background-polygons.vue';
import { loadRecords, type RunRecord } from '../game/leaderboard';
import { DIFFICULTIES, getDifficulty } from '../game/difficulty';
import { useI18n } from '../i18n';
import { useViverse } from '../viverse/useViverse';
import { LEADERBOARD_CLEARED, LEADERBOARD_SURVIVAL, LEADERBOARD_DEATHMATCH } from '../viverse/leaderboardSubmit';
import type { LeaderboardRow } from '../viverse/ViverseSession';

const { t } = useI18n();
const emit = defineEmits<{ (e: 'back'): void }>();
const viverse = useViverse();

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
/** 本機回退榜（VIVERSE 不可用時顯示；VIVERSE 沒有難度分頁概念，此列表仍受難度分頁過濾） */
const records = ref<RunRecord[]>([]);
/** VIVERSE 全球榜（可用時優先顯示，取代本機列表） */
const viverseRecords = ref<LeaderboardRow[]>([]);
const isGlobal = computed(() => viverse.state.status !== 'unavailable');

const hint = computed(() => {
  if (gameMode.value === 'deathmatch') return t('leaderboard.hintDeathmatch');
  return board.value === 'cleared' ? t('leaderboard.hintCleared') : t('leaderboard.hintSurvival');
});
const emptyHint = computed(() => {
  if (gameMode.value === 'deathmatch') return t('leaderboard.emptyDeathmatch');
  return board.value === 'cleared' ? t('leaderboard.emptyCleared') : t('leaderboard.emptySurvival');
});

function leaderboardName(): string {
  if (gameMode.value === 'deathmatch') return LEADERBOARD_DEATHMATCH;
  return board.value === 'cleared' ? LEADERBOARD_CLEARED : LEADERBOARD_SURVIVAL;
}

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
  if (isGlobal.value) {
    viverseRecords.value = await viverse.fetchLeaderboard(leaderboardName(), 10);
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
/** VIVERSE 狀態初次解析（bootstrap 為非同步）或登入/登出後，重新抓一次榜單 */
watch(() => viverse.state.status, () => void refresh());

function timeText(t: number) {
  const total = Math.floor(t);
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
}
function rankClass(i: number) {
  return ['text-[#a67c00]', 'text-[#5a6a72]', 'text-[#c2571b]'][i] ?? 'text-[#14210f]/50';
}
function diffLabel(id: string) {
  const d = getDifficulty(id || 'easy');
  return `${d.emoji}${t(d.nameKey)}`;
}
function diffColor(id: string) {
  return getDifficulty(id || 'easy').color;
}
</script>
