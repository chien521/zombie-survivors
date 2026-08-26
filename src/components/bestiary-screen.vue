<template>
  <div class="absolute inset-0 overflow-auto text-[#14210f]">
    <background-polygons />

    <div class="relative mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div class="flex items-center gap-3 pt-4">
        <button
          class="rounded-md bg-white/40 px-4 py-2 font-black ring-[3px] ring-[#14210f] transition hover:bg-white/60 active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-3xl font-black tracking-wider">{{ t('bestiary.title') }}</h1>
      </div>

      <!-- 怪物 -->
      <div>
        <div class="mb-2 text-lg font-black">{{ t('bestiary.zombiesHeading') }}</div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="z in zombieInfo"
            :key="z.name"
            class="flex flex-col items-center gap-1 rounded-md bg-white/35 p-3 text-center ring-2 ring-[#14210f]"
          >
            <img v-if="modelThumbs[z.model]" :src="modelThumbs[z.model]" class="h-24 w-24 rounded-md" :alt="t(z.nameKey)" />
            <span v-else class="flex h-24 w-24 items-center justify-center text-5xl">🧟</span>
            <div class="font-black">{{ t(z.nameKey) }}</div>
            <div class="text-[0.72rem] font-bold text-[#4a7a2e]">{{ t(z.roleKey) }}</div>
            <div class="text-[0.68rem] leading-snug text-[#14210f]/65">{{ t(z.descKey) }}</div>
          </div>
        </div>
      </div>

      <!-- 王 -->
      <div>
        <div class="mb-2 text-lg font-black">{{ t('bestiary.bossesHeading') }}</div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="(b, i) in bossInfo"
            :key="b.name"
            class="flex items-center gap-3 rounded-md bg-white/35 p-3 ring-2 ring-[#14210f]"
          >
            <img v-if="modelThumbs[b.model]" :src="modelThumbs[b.model]" class="h-20 w-20 shrink-0 rounded-md" :alt="t(b.nameKey)" />
            <span v-else class="flex h-20 w-20 shrink-0 items-center justify-center text-4xl">🧟‍♂️</span>
            <div class="min-w-0">
              <div class="font-black">{{ i + 1 }}. {{ t(b.nameKey) }}</div>
              <div class="text-xs font-bold text-[#8a2020]">{{ t('bestiary.skillLabel') }}{{ t(b.skillKey) }}</div>
              <div class="text-[0.7rem] leading-snug text-[#14210f]/65">{{ t(b.descKey) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 組合羈絆 -->
      <div>
        <div class="mb-2 text-lg font-black">{{ t('bestiary.synergyHeading') }}</div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="c in comboInfo"
            :key="c.id"
            class="rounded-md bg-white/35 p-3 ring-2 ring-[#14210f]"
          >
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ c.emoji }}</span>
              <div class="font-black">{{ t(c.nameKey) }}</div>
              <span
                v-if="hasLegacy(c.id)"
                class="ml-auto shrink-0 rounded-full bg-amber-400/30 px-2 py-0.5 text-[0.65rem] font-bold text-[#a67c00]"
              >
                {{ t('bestiary.legacyBadge') }}
              </span>
            </div>
            <div class="mt-1 text-[0.72rem] leading-snug text-[#14210f]/65">{{ t(c.descKey) }}</div>
            <div v-if="c.requires" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="rid in c.requires"
                :key="rid"
                class="rounded-full bg-[#14210f]/10 px-2 py-0.5 text-[0.65rem] text-[#14210f]/80"
              >
                {{ upgradeChip(rid) }}
              </span>
            </div>
            <div v-else class="mt-2 text-[0.65rem] text-[#14210f]/45">
              {{ t('bestiary.tagSpreadHint', { n: c.tagSpreadCount ?? 0 }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BackgroundPolygons from './background-polygons.vue';
import { ZOMBIE_INFO } from '../game/zombie-horde';
import { BOSS_INFO } from '../game/boss';
import { COMBO_SYNERGIES, UPGRADES } from '../game/upgrades';
import { LEGACY } from '../game/meta';
import { renderModelThumbnails } from '../game/model-thumbs';
import { useI18n } from '../i18n';

const { t } = useI18n();
const emit = defineEmits<{ (e: 'back'): void }>();

const zombieInfo = ZOMBIE_INFO;
const bossInfo = BOSS_INFO;
const comboInfo = COMBO_SYNERGIES;
const modelThumbs = ref<Record<string, string>>({});

function upgradeChip(id: string): string {
  const u = UPGRADES.find((x) => x.id === id);
  if (!u) return id;
  return `${u.emoji} ${u.nameKey ? t(u.nameKey) : u.name}`;
}
function hasLegacy(comboId: string): boolean {
  return LEGACY.some((l) => l.comboId === comboId);
}

onMounted(() => {
  const models = [...ZOMBIE_INFO.map((z) => z.model), ...BOSS_INFO.map((b) => b.model)];
  void renderModelThumbnails(models, (model, url) => {
    modelThumbs.value = { ...modelThumbs.value, [model]: url };
  });
});
</script>
