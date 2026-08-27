<template>
  <landing-screen
    v-if="screen === 'landing'"
    @start="screen = 'mode'"
    @leaderboard="screen = 'leaderboard'"
    @bestiary="screen = 'bestiary'"
  />
  <mode-screen v-else-if="screen === 'mode'" @select="onSelectMode" @back="screen = 'landing'" />
  <difficulty-screen v-else-if="screen === 'difficulty'" @select="onSelectDifficulty" @back="screen = 'mode'" />
  <leaderboard-screen v-else-if="screen === 'leaderboard'" @back="screen = 'landing'" />
  <bestiary-screen v-else-if="screen === 'bestiary'" @back="screen = 'landing'" />
  <menu-screen
    v-else-if="screen === 'menu'"
    :meta="meta"
    @start="onStart"
    @buy="onBuy"
    @buy-legacy="onBuyLegacy"
    @unlock="onUnlock"
    @add-gold="onAddGold"
    @home="screen = 'landing'"
  />
  <game-view
    v-else
    :character-color="characterColor"
    :character-model="characterModel"
    :character-model-scale="characterModelScale"
    :start-run-state="startRun"
    :gold-multiplier="goldMul"
    :difficulty="difficulty"
    :mode="gameMode"
    @gameover="onGameOver"
    @menu="screen = 'landing'"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref, shallowRef } from 'vue';
import LandingScreen from './components/landing-screen.vue';
import LeaderboardScreen from './components/leaderboard-screen.vue';
import DifficultyScreen from './components/difficulty-screen.vue';
import ModeScreen from './components/mode-screen.vue';
/** 這三個畫面會用到 Babylon.js（角色預覽／圖鑑縮圖／遊戲本體），改用動態 import
 *  拆成獨立 chunk，讓 Babylon.js 不擋在首屏（landing）的載入路徑上。 */
const MenuScreen = defineAsyncComponent(() => import('./components/menu-screen.vue'));
const GameView = defineAsyncComponent(() => import('./components/game-view.vue'));
const BestiaryScreen = defineAsyncComponent(() => import('./components/bestiary-screen.vue'));
import { loadMeta, saveMeta, computeStartRunState, goldMultiplier, PERMA, permaCost, LEGACY } from './game/meta';
import type { MasteryProgress } from './game/meta';
import { getCharacter } from './game/characters';
import { addRecord, recordStats, getPlayerName } from './game/leaderboard';
import { getDifficulty, type Difficulty } from './game/difficulty';
import { reportStats } from './game/api';
import { viverseSession } from './viverse/ViverseSession';
import type { RunState } from './game/upgrades';
import type { RunResult, GameMode } from './game/game';

const meta = reactive(loadMeta());
const screen = ref<
  'landing' | 'mode' | 'difficulty' | 'menu' | 'game' | 'leaderboard' | 'bestiary'
>('landing');

const gameMode = ref<GameMode>('story');
function onSelectMode(m: GameMode) {
  gameMode.value = m;
  screen.value = 'difficulty';
}

const startRun = shallowRef<RunState>();
const characterColor = ref<[number, number, number]>([1, 1, 1]);
const characterModel = ref<string>();
const characterModelScale = ref<number>();
const goldMul = ref(1);
let lastCharId = 'matt';

const DIFF_KEY = 'animal-survivors:difficulty';
const difficulty = shallowRef<Difficulty>(getDifficulty(localStorage.getItem(DIFF_KEY) ?? 'easy'));
function onSelectDifficulty(id: string) {
  difficulty.value = getDifficulty(id);
  localStorage.setItem(DIFF_KEY, id);
  screen.value = 'menu';
}

function onStart(charId: string) {
  const ch = getCharacter(charId);
  lastCharId = charId;
  startRun.value = computeStartRunState(charId, meta.perma, meta.mastery, meta.legacy);
  characterColor.value = ch.bodyColor;
  characterModel.value = ch.model;
  characterModelScale.value = ch.modelScale;
  goldMul.value = goldMultiplier(meta.perma) * difficulty.value.goldReward;
  screen.value = 'game';
}

function onGameOver(result: RunResult) {
  meta.gold += result.gold;
  /** 熟練度：動過 debug 的局不計入（跟本機/全球排行榜同一套判定） */
  if (!result.cheated) {
    const progress: MasteryProgress = meta.mastery[lastCharId] ?? { kills: 0, wins: 0 };
    progress.kills += result.kills;
    if (result.won) progress.wins += 1;
    meta.mastery[lastCharId] = progress;
  }
  saveMeta(meta);
  const playerName = getPlayerName() || '倖存者';
  const character = getCharacter(lastCharId).name;
  const diffId = difficulty.value.id;
  /** 動過 debug 的局：不計本機累計、不進本機排行榜（後端則由 cheated 旗標標記＋排除） */
  if (!result.cheated) {
    recordStats(result.time, result.kills);
    addRecord({
      name: playerName,
      character,
      time: result.time,
      kills: result.kills,
      level: result.level,
      gold: result.gold,
      won: result.won,
      difficulty: diffId,
      mode: result.mode,
      wave: result.wave,
      score: result.score,
      at: Date.now(),
    });
  }
  /** 一律回報全球累計統計（帶 cheated 旗標，後端負責排除、不累加）；失敗則忽略。
   *  排行榜已改用 VIVERSE（見 game-over-modal.vue / victory-modal.vue 的「上傳到 VIVERSE 排行榜」按鈕），
   *  此處不再自動送出名次資料。 */
  void reportStats(result.time, result.kills, result.cheated);
}

/** App 開機時：若上次因 VIVERSE 登入導轉而暫存了排行榜提交，且現在已登入成功，續做該筆提交，
 *  並跳到排行榜頁讓玩家看到結果（重新整理後結算彈窗已不在，這是唯一能給回饋的地方）。 */
onMounted(async () => {
  const pending = await viverseSession.resumePending();
  if (pending?.reason === 'leaderboard' && typeof pending.name === 'string' && typeof pending.value === 'number') {
    await viverseSession.submitScore(pending.name, pending.value);
    screen.value = 'leaderboard';
  }
});

function onBuy(permaId: string) {
  const p = PERMA.find((x) => x.id === permaId);
  if (!p) return;
  const lvl = meta.perma[permaId] ?? 0;
  if (lvl >= p.maxLevel) return;
  const c = permaCost(p, lvl);
  if (meta.gold < c) return;
  meta.gold -= c;
  meta.perma[permaId] = lvl + 1;
  saveMeta(meta);
}

function onBuyLegacy(legacyId: string) {
  const entry = LEGACY.find((x) => x.id === legacyId);
  if (!entry || meta.legacy[legacyId] || meta.gold < entry.cost) return;
  meta.gold -= entry.cost;
  meta.legacy[legacyId] = true;
  saveMeta(meta);
}

function onUnlock(charId: string) {
  const ch = getCharacter(charId);
  if (meta.unlocked.includes(charId) || meta.gold < ch.cost) return;
  meta.gold -= ch.cost;
  meta.unlocked.push(charId);
  saveMeta(meta);
}

function onAddGold(amount: number) {
  meta.gold += amount;
  saveMeta(meta);
}
</script>
