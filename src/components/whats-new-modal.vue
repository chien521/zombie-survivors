<template>
  <div class="absolute inset-0 z-30 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
    <div class="w-[min(92vw,28rem)] rounded-md bg-[#d4e8b8] p-6 text-[#14210f] shadow-2xl ring-[3px] ring-[#14210f]">
      <div class="mb-1 text-xs font-black tracking-widest text-[#4a7a2e]">{{ t('whatsnew.heading') }} · {{ release.version }}</div>
      <div class="mb-4 text-2xl font-black">{{ release.titleKey ? t(release.titleKey) : release.title }}</div>
      <ul class="flex max-h-[55vh] flex-col gap-2 overflow-auto text-sm leading-relaxed text-[#14210f]/85">
        <li v-for="(it, i) in release.items" :key="i" class="flex gap-2">
          <span class="shrink-0 text-[#4a7a2e]">▸</span>
          <span>{{ release.itemKeys?.[i] ? t(release.itemKeys[i]) : it }}</span>
        </li>
      </ul>
      <button
        class="mt-6 w-full rounded-md bg-white/40 px-4 py-3 text-lg font-black text-[#4a7a2e] ring-[3px] ring-[#4a7a2e] transition hover:bg-white/65 active:scale-95"
        @click="emit('close')"
      >
        {{ t('whatsnew.close') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Release } from '../changelog';
import { useI18n } from '../i18n';

const { t } = useI18n();
defineProps<{ release: Release }>();
const emit = defineEmits<{ (e: 'close'): void }>();
</script>
