<template>
  <div class="absolute inset-0 overflow-auto bg-gradient-to-b from-[#d4e8b8] to-[#bcd89a] text-[#14210f]">
    <!-- 返回首頁 -->
    <button
      class="absolute left-3 top-3 z-10 rounded-md bg-white/40 px-4 py-1 text-sm font-black ring-[3px] ring-[#14210f] transition hover:bg-white/60 active:scale-95"
      @click="emit('home')"
    >
      {{ t('menu.home') }}
    </button>

    <!-- Debug 開關 -->
    <div class="absolute right-3 top-3 z-10 flex items-center gap-2">
      <button
        class="rounded-md px-3 py-1 text-xs font-black transition"
        :class="debug ? 'bg-[#4a7a2e] text-white' : 'bg-white/40 text-[#14210f]/70 ring-2 ring-[#14210f]'"
        @click="toggleDebug"
      >
        {{ debug ? t('menu.debugOn') : t('menu.debugOff') }}
      </button>
      <button
        v-if="debug"
        class="rounded-md bg-white/40 px-3 py-1 text-xs font-black text-[#a67c00] ring-2 ring-[#a67c00]"
        @click="emit('add-gold', 1000)"
      >
        {{ t('menu.debugGold') }}
      </button>
    </div>

    <div class="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <!-- 標題 -->
      <div class="pt-4 text-center">
        <div class="text-5xl font-black tracking-wider">{{ t('landing.title') }}</div>
        <div class="mt-1 text-sm text-[#14210f]/70">{{ t('landing.subtitle') }}</div>
        <div class="mt-3 inline-block rounded-md bg-white/40 px-5 py-1 text-lg font-black text-[#a67c00] ring-2 ring-[#a67c00]">
          💰 {{ meta.gold }}
        </div>
      </div>

      <!-- 角色 -->
      <div>
        <div class="mb-2 text-lg font-black">{{ t('menu.selectCharacter') }}</div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="c in characters"
            :key="c.id"
            class="flex cursor-pointer flex-col items-center gap-1 rounded-xl p-3 text-center transition"
            :class="cardClass(c.id)"
            @click="onCard(c)"
          >
            <div class="relative h-36 w-36">
              <canvas
                :ref="(el) => setCanvas(c.id, el)"
                class="h-36 w-36 rounded-md ring-2 ring-[#14210f]"
                width="384"
                height="384"
              />
              <span
                v-if="!ready[c.id]"
                class="absolute inset-0 flex items-center justify-center text-5xl"
              >
                {{ c.emoji }}
              </span>
            </div>
            <span class="font-black">{{ t(c.nameKey) }}</span>
            <span class="text-[0.72rem] font-bold leading-tight text-[#a67c00]">{{ t(c.traitKey) }}</span>
            <span class="text-[0.66rem] leading-snug text-[#14210f]/60">{{ t(c.descKey) }}</span>
            <span
              v-if="!isUnlocked(c.id)"
              class="mt-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-black text-black"
              :class="{ 'opacity-40': meta.gold < c.cost }"
            >
              {{ t('menu.unlockCost', { cost: c.cost }) }}
            </span>
            <span
              v-else-if="masteryTier(meta.mastery[c.id]) > 0"
              class="mt-1 rounded-full bg-cyan-400/90 px-2 py-0.5 text-xs font-black text-black"
            >
              {{ t('menu.masteryLevel', { tier: masteryTier(meta.mastery[c.id]) }) }}
            </span>
            <span v-else-if="masteryProgressText(c.id)" class="mt-1 text-[0.6rem] text-[#14210f]/45">
              {{ masteryProgressText(c.id) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 商店 -->
      <div>
        <div class="mb-2 text-lg font-black">{{ t('menu.permaUpgrades') }}</div>
        <div class="flex flex-col gap-2">
          <div
            v-for="p in perma"
            :key="p.id"
            class="flex items-center gap-3 rounded-md bg-white/35 p-3 ring-2 ring-[#14210f]"
          >
            <span class="text-2xl">{{ p.emoji }}</span>
            <div class="flex-1">
              <div class="font-black">{{ t(p.nameKey) }} <span class="text-[#14210f]/50">{{ level(p.id) }}/{{ p.maxLevel }}</span></div>
              <div class="text-xs text-[#14210f]/70">{{ t(p.descKey) }}</div>
            </div>
            <button
              class="rounded-md px-4 py-2 text-sm font-black transition"
              :class="buyClass(p)"
              :disabled="!canBuy(p)"
              @click="emit('buy', p.id)"
            >
              {{ level(p.id) >= p.maxLevel ? t('menu.permaMaxed') : `💰${cost(p)}` }}
            </button>
          </div>
        </div>
      </div>

      <!-- 羈絆傳承 -->
      <div>
        <div class="mb-2 text-lg font-black">{{ t('menu.legacyTitle') }}</div>
        <div class="flex flex-col gap-2">
          <div
            v-for="l in legacy"
            :key="l.id"
            class="flex items-center gap-3 rounded-md bg-white/35 p-3 ring-2 ring-[#14210f]"
          >
            <span class="text-2xl">{{ l.emoji }}</span>
            <div class="flex-1">
              <div class="font-black">{{ t(l.nameKey) }}</div>
              <div class="text-xs text-[#14210f]/70">{{ t(l.descKey) }}</div>
            </div>
            <button
              class="rounded-md px-4 py-2 text-sm font-black transition"
              :class="legacyOwned(l.id) ? 'bg-white/20 text-[#14210f]/40' : buyClassLegacy(l)"
              :disabled="legacyOwned(l.id) || !canBuyLegacy(l)"
              @click="emit('buy-legacy', l.id)"
            >
              {{ legacyOwned(l.id) ? t('menu.permaMaxed') : `💰${l.cost}` }}
            </button>
          </div>
        </div>
      </div>

      <!-- 開始 -->
      <button
        class="sticky bottom-4 mt-2 w-full rounded-md bg-white/50 py-4 text-2xl font-black text-[#8a2020] shadow-lg ring-[3px] ring-[#8a2020] transition hover:bg-white/75 active:scale-95"
        @click="emit('start', selectedId)"
      >
        {{ t('menu.start', { name: selectedName }) }}
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { CHARACTERS, getCharacter, type Character } from '../game/characters';
import { PERMA, permaCost, masteryTier, masteryProgress, LEGACY, type MetaData, type PermaUpgrade, type SynergyLegacy } from '../game/meta';
import { setupCharacterPreview, type PreviewHandle } from '../game/character-previews';
import { useI18n } from '../i18n';

const { t } = useI18n();
const props = defineProps<{ meta: MetaData }>();
const emit = defineEmits<{
  (e: 'start', characterId: string): void;
  (e: 'buy', permaId: string): void;
  (e: 'buy-legacy', legacyId: string): void;
  (e: 'unlock', characterId: string): void;
  (e: 'add-gold', amount: number): void;
  (e: 'home'): void;
}>();

const characters = CHARACTERS;
const perma = PERMA;
const legacy = LEGACY;
const selectedId = ref('matt');

/** 角色即時 3D 預覽：每張卡一個引擎，播 idle 並旋轉；就緒前以 emoji 替代 */
const ready = ref<Record<string, boolean>>({});
const canvases = new Map<string, HTMLCanvasElement>();
const handles: PreviewHandle[] = [];
function setCanvas(id: string, el: unknown) {
  if (el instanceof HTMLCanvasElement) canvases.set(id, el);
}
onMounted(async () => {
  await nextTick();
  for (const c of CHARACTERS) {
    const canvas = canvases.get(c.id);
    if (!canvas || !c.model) continue;
    const h = await setupCharacterPreview(canvas, c.model);
    if (h) {
      handles.push(h);
      ready.value = { ...ready.value, [c.id]: true };
    }
  }
});
onBeforeUnmount(() => {
  for (const h of handles) h.dispose();
});

const DEBUG_KEY = 'animal-survivors:debug';
const debug = ref(localStorage.getItem(DEBUG_KEY) === '1');
function toggleDebug() {
  /** 開啟需通過驗證；關閉不需要 */
  if (!debug.value) {
    const answer = window.prompt('請問作者的全名（三個字）？');
    if (answer === null) return;
    if (answer.trim() !== '黃國書') {
      window.alert('答錯了，無法開啟 Debug');
      return;
    }
  }
  debug.value = !debug.value;
  localStorage.setItem(DEBUG_KEY, debug.value ? '1' : '0');
}

const selectedName = computed(() => t(getCharacter(selectedId.value).nameKey));

function masteryProgressText(charId: string): string | null {
  const p = masteryProgress(props.meta.mastery[charId]);
  return p ? t(p.key, { cur: p.cur, max: p.max }) : null;
}

function isUnlocked(id: string) {
  return debug.value || props.meta.unlocked.includes(id);
}
function level(id: string) {
  return props.meta.perma[id] ?? 0;
}
function cost(p: PermaUpgrade) {
  return permaCost(p, level(p.id));
}
function canBuy(p: PermaUpgrade) {
  return level(p.id) < p.maxLevel && props.meta.gold >= cost(p);
}
function buyClass(p: PermaUpgrade) {
  return canBuy(p) ? 'bg-white/40 text-[#a67c00] ring-2 ring-[#a67c00] hover:bg-white/65' : 'bg-white/20 text-[#14210f]/40';
}
function legacyOwned(id: string) {
  return props.meta.legacy[id] ?? false;
}
function canBuyLegacy(l: SynergyLegacy) {
  return !legacyOwned(l.id) && props.meta.gold >= l.cost;
}
function buyClassLegacy(l: SynergyLegacy) {
  return canBuyLegacy(l) ? 'bg-white/40 text-[#a67c00] ring-2 ring-[#a67c00] hover:bg-white/65' : 'bg-white/20 text-[#14210f]/40';
}
function cardClass(id: string) {
  if (selectedId.value === id) return 'bg-white/45 ring-[3px] ring-[#8a2020]';
  if (isUnlocked(id)) return 'bg-white/35 ring-2 ring-[#14210f] hover:bg-white/55';
  return 'bg-white/15 ring-2 ring-[#14210f]/40 opacity-80';
}
function onCard(c: Character) {
  if (isUnlocked(c.id)) {
    selectedId.value = c.id;
  } else if (props.meta.gold >= c.cost) {
    emit('unlock', c.id);
    selectedId.value = c.id;
  }
}
</script>
