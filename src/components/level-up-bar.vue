<template>
  <!-- 不暫停的升級選項列：遊戲繼續跑，玩家隨時點選 -->
  <div class="pointer-events-none absolute inset-x-0 bottom-44 z-20 flex justify-center px-3 sm:bottom-10">
    <div class="pointer-events-auto w-full max-w-md rounded-md bg-[#d4e8b8] p-2 shadow-2xl ring-[3px] ring-[#a67c00]">
      <div class="mb-1 text-center text-xs font-black text-[#a67c00]">
        {{ t('levelup.barTitle') }}<span v-if="pending > 1" class="text-[#14210f]/60">{{ t('levelup.pending', { n: pending }) }}</span>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="(c, i) in choices"
          :key="c.id"
          class="flex touch-manipulation flex-col items-center gap-0.5 rounded-md bg-white/50 p-2 text-center ring-2 ring-[#14210f] transition hover:bg-white/80 hover:ring-[#a67c00] active:scale-95"
          @pointerdown.prevent="emit('choose', i)"
        >
          <span class="text-2xl sm:text-3xl">{{ c.emoji }}</span>
          <span class="text-xs font-black leading-tight text-[#14210f] sm:text-sm">{{ c.nameKey ? t(c.nameKey) : c.name }}</span>
          <span class="text-[0.62rem] leading-tight text-[#14210f]/80">{{ c.descKey ? t(c.descKey) : c.desc }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChoiceView } from '../game/game';
import { useI18n } from '../i18n';

const { t } = useI18n();
defineProps<{ choices: ChoiceView[]; pending: number }>();
const emit = defineEmits<{ (e: 'choose', index: number): void }>();
</script>
