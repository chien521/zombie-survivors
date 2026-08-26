<template>
  <div class="absolute inset-0 overflow-auto text-white">
    <background-polygons />

    <div class="relative mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div class="flex items-center gap-3 pt-4">
        <button
          class="rounded-xl bg-[#2a2f45] px-4 py-2 font-black ring-2 ring-[#5a6cad] transition hover:bg-[#394162] active:scale-95"
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
            class="flex flex-col items-center gap-1 rounded-xl bg-[#2a2f45] p-3 text-center ring-1 ring-[#2a2f45]"
          >
            <img v-if="modelThumbs[z.model]" :src="modelThumbs[z.model]" class="h-24 w-24 rounded-xl" :alt="t(z.nameKey)" />
            <span v-else class="flex h-24 w-24 items-center justify-center text-5xl">🧟</span>
            <div class="font-black">{{ t(z.nameKey) }}</div>
            <div class="text-[0.72rem] font-bold text-emerald-300/80">{{ t(z.roleKey) }}</div>
            <div class="text-[0.68rem] leading-snug text-white/55">{{ t(z.descKey) }}</div>
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
            class="flex items-center gap-3 rounded-xl bg-[#2a2f45] p-3 ring-1 ring-[#2a2f45]"
          >
            <img v-if="modelThumbs[b.model]" :src="modelThumbs[b.model]" class="h-20 w-20 shrink-0 rounded-xl" :alt="t(b.nameKey)" />
            <span v-else class="flex h-20 w-20 shrink-0 items-center justify-center text-4xl">🧟‍♂️</span>
            <div class="min-w-0">
              <div class="font-black">{{ i + 1 }}. {{ t(b.nameKey) }}</div>
              <div class="text-xs font-bold text-rose-300/80">{{ t('bestiary.skillLabel') }}{{ t(b.skillKey) }}</div>
              <div class="text-[0.7rem] leading-snug text-white/55">{{ t(b.descKey) }}</div>
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
            class="rounded-xl bg-[#2a2f45] p-3 ring-1 ring-[#2a2f45]"
          >
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ c.emoji }}</span>
              <div class="font-black">{{ t(c.nameKey) }}</div>
              <span
                v-if="hasLegacy(c.id)"
                class="ml-auto shrink-0 rounded-full bg-amber-400/20 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300"
              >
                {{ t('bestiary.legacyBadge') }}
              </span>
            </div>
            <div class="mt-1 text-[0.72rem] leading-snug text-white/55">{{ t(c.descKey) }}</div>
            <div v-if="c.requires" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="rid in c.requires"
                :key="rid"
                class="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] text-white/80"
              >
                {{ upgradeChip(rid) }}
              </span>
            </div>
            <div v-else class="mt-2 text-[0.65rem] text-white/40">
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
