<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-white">
    <background-polygons />
    <whats-new-modal v-if="showWhatsNew" :release="latestRelease" @close="closeWhatsNew" />

    <div class="relative flex w-full max-w-xs flex-col items-center gap-4 px-6 sm:max-w-none sm:gap-5">
      <!-- 標題 -->
      <div class="text-center">
        <h1
          class="text-5xl font-black tracking-widest sm:text-7xl"
          style="color: #c6ff7a; paint-order: stroke fill; -webkit-text-stroke: 6px #14210f; text-shadow: 0 6px 0 rgba(0,0,0,0.35)"
        >
          {{ t('landing.title') }}
        </h1>
        <p class="mt-2 text-xs font-bold tracking-wide text-white/70 sm:mt-3 sm:text-lg">
          {{ t('landing.subtitle') }}
        </p>
        <!-- 即時在線人數 -->
        <div
          v-if="online !== null"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1a1d29] px-4 py-1.5 text-sm font-bold ring-1 ring-[#2a2f45]"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75"></span>
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400"></span>
          </span>
          <span class="text-lime-300">{{ online }}</span>
          <span class="text-white/60">{{ t('landing.onlineSuffix') }}</span>
        </div>
      </div>

      <!-- VIVERSE 連線狀態（附加功能，不影響原本匿名排行榜流程） -->
      <button
        v-if="viverse.state.status === 'unavailable'"
        class="viverse-chip"
        disabled
        :title="t('landing.viverseUnavailable')"
      >
        {{ t('landing.viverseUnavailable') }}
      </button>
      <button
        v-else-if="viverse.state.status === 'logged_in'"
        class="viverse-chip viverse-chip--connected"
        disabled
      >
        {{ t('landing.viverseConnected', { name: viverse.state.user?.displayName ?? '' }) }}
      </button>
      <button
        v-else
        class="viverse-chip"
        :disabled="viverse.state.status === 'logging_in'"
        @click="viverse.connect"
      >
        {{ viverse.state.status === 'logging_in' ? t('landing.viverseConnecting') : t('landing.viverseConnect') }}
      </button>

      <!-- 暱稱（必填才能開始） -->
      <div class="w-full max-w-xs">
        <input
          v-model="name"
          maxlength="16"
          :placeholder="t('landing.namePlaceholder')"
          class="w-full rounded-xl bg-[#1a1d29] px-5 py-2 text-center font-bold text-white outline-none ring-1 placeholder:text-white/40"
          :class="canStart ? 'ring-[#2a2f45]' : 'ring-rose-400/50'"
          @change="saveName"
          @blur="saveName"
        />
        <p v-if="!canStart" class="mt-1 text-center text-xs text-rose-300/80">{{ t('landing.nameRequired') }}</p>
      </div>

      <!-- 按鈕：主 CTA 整排，其餘 2 顆手機並排、桌機回堆疊 -->
      <div class="flex w-full max-w-xs flex-col gap-3">
        <button
          class="portal-btn portal-btn--play"
          :class="{ 'portal-btn--disabled': !canStart }"
          :disabled="!canStart"
          @click="onStart"
        >
          {{ t('landing.play') }}
        </button>
        <!-- 語言選擇 -->
        <select
          v-model="localeModel"
          class="portal-btn portal-btn--sub w-full text-center"
        >
          <option v-for="l in localeList" :key="l" :value="l" class="bg-zinc-900 text-white">{{ localeNames[l] }}</option>
        </select>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-1">
          <button class="portal-btn portal-btn--sub" @click="emit('leaderboard')">{{ t('landing.leaderboard') }}</button>
          <button class="portal-btn portal-btn--sub" @click="emit('bestiary')">{{ t('landing.bestiary') }}</button>
        </div>
      </div>

      <!-- 累積統計：手機 2×2、桌機橫排 -->
      <div class="grid w-full max-w-xs grid-cols-2 gap-2 sm:flex sm:w-auto sm:max-w-none sm:gap-6">
        <div class="rounded-xl bg-[#1a1d29] px-3 py-2 text-center ring-1 ring-[#2a2f45] sm:px-6">
          <div class="text-xl font-black text-lime-300 sm:text-3xl">{{ stats.plays }}</div>
          <div class="text-xs text-white/55">{{ t('landing.statsPlays') }}</div>
        </div>
        <div class="rounded-xl bg-[#1a1d29] px-3 py-2 text-center ring-1 ring-[#2a2f45] sm:px-6">
          <div class="text-xl font-black text-lime-300 sm:text-3xl">{{ timeText }}</div>
          <div class="text-xs text-white/55">{{ t('landing.statsTime') }}</div>
        </div>
        <div class="rounded-xl bg-[#1a1d29] px-3 py-2 text-center ring-1 ring-[#2a2f45] sm:px-6">
          <div class="text-xl font-black text-lime-300 sm:text-3xl">{{ stats.totalKills }}</div>
          <div class="text-xs text-white/55">{{ t('landing.statsKills') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import BackgroundPolygons from './background-polygons.vue';
import WhatsNewModal from './whats-new-modal.vue';
import { loadStats, getPlayerName, setPlayerName, type GlobalStats } from '../game/leaderboard';
import { fetchStats, enterOnline } from '../game/api';
import { CHANGELOG, LATEST_VERSION } from '../changelog';
import { useViverse } from '../viverse/useViverse';
import { useI18n, type Locale } from '../i18n';

const viverse = useViverse();
const { t, locale, setLocale, localeList, localeNames } = useI18n();
const localeModel = computed<Locale>({
  get: () => locale.value,
  set: (v) => setLocale(v),
});

/** 更新紀錄彈窗：首次（或版本更新後）自動跳一次，看過即記住 */
const CHANGELOG_KEY = 'animal-survivors:changelogSeen';
const showWhatsNew = ref(false);
const latestRelease = CHANGELOG[0];
function closeWhatsNew() {
  showWhatsNew.value = false;
  try {
    localStorage.setItem(CHANGELOG_KEY, LATEST_VERSION);
  } catch {
    /* 忽略寫入失敗 */
  }
}

const emit = defineEmits<{
  (e: 'start'): void;
  (e: 'leaderboard'): void;
  (e: 'bestiary'): void;
}>();

const name = ref(getPlayerName());
const canStart = computed(() => name.value.trim().length > 0);
function saveName() {
  setPlayerName(name.value);
  name.value = getPlayerName();
}
function onStart() {
  if (!canStart.value) return;
  saveName();
  emit('start');
}

/** 先顯示本機統計，抓到全球就覆蓋 */
const stats = reactive<GlobalStats>(loadStats());

/** 目前遊玩人數（近 3 小時活躍；進場記錄一次，不再輪詢） */
const online = ref<number | null>(null);
async function applyOnline(data: { online: number; peak: number } | null) {
  if (data !== null) online.value = data.online;
}

onMounted(async () => {
  /** 沒看過這個版本的更新紀錄 → 自動跳一次 */
  if (localStorage.getItem(CHANGELOG_KEY) !== LATEST_VERSION) showWhatsNew.value = true;
  void enterOnline().then(applyOnline);   // 進場記錄 + 取人數（僅一次）
  const global = await fetchStats();
  if (global) Object.assign(stats, global);
});

const timeText = computed(() => {
  const total = Math.floor(stats.totalTime);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}h${m}m`;
  return `${m}m`;
});
</script>

<style scoped>
.portal-btn {
  padding: 1rem 1.5rem;
  border-radius: 0.875rem;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: #eaf3ee;
  background: #2a2f45;
  border: 2px solid #5a6cad;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.16s, background 0.16s, border-color 0.16s;
}
.portal-btn:hover {
  background: #394162;
  transform: scale(1.03);
}
.portal-btn:active {
  transform: scale(0.97);
}
/** 次要按鈕（排行榜/圖鑑/語言選擇）：手機縮小並排，桌機回到原本大小堆疊 */
.portal-btn--sub {
  padding: 0.6rem 0.5rem;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
}
@media (min-width: 640px) {
  .portal-btn--sub {
    padding: 0.7rem 1.5rem;
    font-size: 1.35rem;
    letter-spacing: 0.06em;
  }
}
/** 主 CTA：沿用同一套卡片語彙，用金色邊框/文字強調（同 match-three 稀有/強調色） */
.portal-btn--play {
  border-color: #ffe066;
  color: #ffe066;
}
.portal-btn--play:hover {
  background: #394162;
}
.portal-btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(0.5);
}
.portal-btn--disabled:hover {
  transform: none;
  background: #2a2f45;
}
.viverse-chip {
  margin-top: 0.25rem;
  padding: 0.4rem 1rem;
  border-radius: 0.875rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #eaf3ee;
  background: #1a1d29;
  border: 1px solid #2a2f45;
  cursor: pointer;
}
.viverse-chip:disabled {
  cursor: default;
  opacity: 0.6;
}
.viverse-chip--connected {
  color: #ffe066;
  border-color: rgba(255, 224, 102, 0.4);
  opacity: 1;
}
</style>
