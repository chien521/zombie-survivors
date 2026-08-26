<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-sm">
    <div class="w-[min(92vw,40rem)] rounded-xl bg-[#1a1d29] p-6 text-white shadow-2xl ring-1 ring-[#2a2f45]">
      <div class="mb-4 text-center">
        <div class="text-sm font-bold tracking-widest" :class="isChoice ? 'text-fuchsia-300' : 'text-amber-300'">
          {{ isChoice ? t('levelup.blessingTitle') : t('levelup.levelTitle', { level }) }}
        </div>
        <div class="text-2xl font-black">{{ isChoice ? t('levelup.blessingSubtitle') : t('levelup.chooseOne') }}</div>
      </div>

      <div class="grid gap-3" :class="isChoice ? 'sm:grid-cols-2' : 'sm:grid-cols-3'">
        <button
          v-for="(c, i) in choices"
          :key="c.id"
          class="flex flex-col items-center gap-2 rounded-xl bg-[#2a2f45] p-5 text-center ring-2 ring-[#5a6cad] transition hover:scale-[1.03] hover:bg-[#394162] hover:ring-[#ffe066] active:scale-95"
          @click="emit('choose', i)"
        >
          <span class="text-5xl">{{ c.emoji }}</span>
          <span class="text-lg font-black">{{ c.nameKey ? t(c.nameKey) : c.name }}</span>
          <span class="text-sm text-white">{{ c.descKey ? t(c.descKey) : c.desc }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChoiceView } from '../game/game';
import { useI18n } from '../i18n';

const { t } = useI18n();
const props = defineProps<{ level: number; choices: ChoiceView[] }>();
const emit = defineEmits<{ (e: 'choose', index: number): void }>();

/** 祝福/詛咒選項 id 以 bc_ 開頭，用以切換彈窗標題 */
const isChoice = computed(() => props.choices.some((c) => c.id.startsWith('bc_')));
</script>
