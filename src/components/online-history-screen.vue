<template>
  <div class="absolute inset-0 overflow-auto text-white">
    <background-polygons />

    <div class="relative mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <div class="flex items-center gap-3 pt-4">
        <button
          class="rounded-xl bg-[#2a2f45] px-4 py-2 font-black ring-2 ring-[#5a6cad] transition hover:bg-[#394162] active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-2xl font-black tracking-wider sm:text-3xl">{{ t('onlinehistory.title') }}</h1>
      </div>

      <!-- 區間切換 -->
      <div class="flex gap-2">
        <button
          v-for="r in ranges"
          :key="r.id"
          class="flex-1 rounded-xl px-3 py-2 text-sm font-black transition active:scale-95"
          :class="range === r.id ? 'bg-[#2a2f45] text-lime-300 ring-2 ring-lime-400' : 'bg-[#1a1d29] text-white/60 ring-1 ring-[#2a2f45] hover:bg-[#2a2f45]'"
          @click="selectRange(r.id)"
        >
          {{ r.label }}
        </button>
      </div>

      <div class="rounded-xl bg-[#1a1d29] p-4 ring-1 ring-[#2a2f45]">
        <div class="mb-2 flex items-baseline justify-between">
          <span class="text-sm text-white/60">{{ t('onlinehistory.hourlyPeak') }}</span>
          <span class="text-sm font-black text-lime-300">{{ t('onlinehistory.rangePeak', { n: maxPeak }) }}</span>
        </div>

        <div v-if="loading" class="py-16 text-center text-white/50">{{ t('onlinehistory.loading') }}</div>
        <div v-else-if="!hasData" class="py-16 text-center text-white/55">
          {{ t('onlinehistory.noData') }}
        </div>
        <svg v-else viewBox="0 0 720 260" class="w-full" preserveAspectRatio="none" style="height: 260px">
          <!-- Y 軸格線與標籤 -->
          <g v-for="t in yTicks" :key="'y' + t.v">
            <line :x1="padL" :y1="t.y" :x2="720 - padR" :y2="t.y" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <text :x="padL - 4" :y="t.y + 4" text-anchor="end" fill="rgba(255,255,255,0.45)" font-size="11">{{ t.v }}</text>
          </g>
          <!-- 長條 -->
          <rect
            v-for="(b, i) in bars"
            :key="i"
            :x="b.x"
            :y="b.y"
            :width="b.w"
            :height="b.h"
            :fill="b.peak > 0 ? '#a3e635' : 'transparent'"
            rx="0.5"
          />
          <!-- X 軸標籤 -->
          <text
            v-for="(l, i) in xLabels"
            :key="'x' + i"
            :x="l.x"
            :y="258"
            text-anchor="middle"
            fill="rgba(255,255,255,0.45)"
            font-size="11"
          >
            {{ l.text }}
          </text>
        </svg>
      </div>

      <p class="text-center text-xs text-white/35">{{ t('onlinehistory.footer') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BackgroundPolygons from './background-polygons.vue';
import { fetchOnlineHistory, type OnlineHourPoint } from '../game/api';
import { useI18n } from '../i18n';

const { t } = useI18n();
const emit = defineEmits<{ (e: 'back'): void }>();

type RangeId = '24h' | '7d' | '30d';
const RANGE_CONFIG: { id: RangeId; labelKey: string; days: number; hours: number }[] = [
  { id: '24h', labelKey: 'onlinehistory.range24h', days: 1, hours: 24 },
  { id: '7d', labelKey: 'onlinehistory.range7d', days: 7, hours: 168 },
  { id: '30d', labelKey: 'onlinehistory.range30d', days: 30, hours: 720 },
];
const ranges = computed(() => RANGE_CONFIG.map((r) => ({ ...r, label: t(r.labelKey) })));

const range = ref<RangeId>('7d');
const points = ref<OnlineHourPoint[]>([]);
const loading = ref(true);

const padL = 28;
const padR = 8;
const padT = 12;
const padB = 26;

async function refresh() {
  loading.value = true;
  const cfg = RANGE_CONFIG.find((r) => r.id === range.value)!;
  const data = await fetchOnlineHistory(cfg.days);
  if (data) points.value = data;
  loading.value = false;
}
function selectRange(id: RangeId) {
  range.value = id;
  void refresh();
}
onMounted(refresh);

/** 把稀疏資料補成連續的整點 bucket（缺的小時補 0） */
const buckets = computed(() => {
  const cfg = RANGE_CONFIG.find((r) => r.id === range.value)!;
  const nowHour = Math.floor(Date.now() / 3600000);
  const start = nowHour - (cfg.hours - 1);
  const map = new Map(points.value.map((p) => [p.hour, p.peak]));
  const out: { hour: number; peak: number }[] = [];
  for (let h = start; h <= nowHour; h++) out.push({ hour: h, peak: map.get(h) ?? 0 });
  return out;
});

const maxPeak = computed(() => Math.max(1, ...buckets.value.map((b) => b.peak)));
const hasData = computed(() => buckets.value.some((b) => b.peak > 0));

const innerW = 720 - padL - padR;
const innerH = 260 - padT - padB;

const bars = computed(() => {
  const arr = buckets.value;
  const bw = innerW / arr.length;
  const gap = bw > 6 ? bw * 0.2 : 0;
  return arr.map((b, i) => {
    const h = (b.peak / maxPeak.value) * innerH;
    return { x: padL + i * bw + gap / 2, y: padT + innerH - h, w: Math.max(0.6, bw - gap), h, peak: b.peak };
  });
});

const yTicks = computed(() => {
  const m = maxPeak.value;
  const vals = m <= 4 ? Array.from({ length: m + 1 }, (_, i) => i) : [0, Math.round(m / 2), m];
  return [...new Set(vals)].map((v) => ({ v, y: padT + innerH - (v / m) * innerH }));
});

/** X 軸標籤：24h 顯示整點，跨天顯示日期（當地午夜） */
const xLabels = computed(() => {
  const arr = buckets.value;
  const bw = innerW / arr.length;
  const is24 = range.value === '24h';
  const out: { x: number; text: string }[] = [];
  arr.forEach((b, i) => {
    const d = new Date(b.hour * 3600000);
    const x = padL + (i + 0.5) * bw;
    if (is24) {
      if (d.getHours() % 6 === 0) out.push({ x, text: `${d.getHours()}:00` });
    } else if (d.getHours() === 0) {
      out.push({ x, text: `${d.getMonth() + 1}/${d.getDate()}` });
    }
  });
  return out;
});
</script>
