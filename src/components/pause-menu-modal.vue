<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="w-[min(90vw,22rem)] rounded-md bg-[#d4e8b8] p-8 text-center text-[#14210f] shadow-2xl ring-[3px] ring-[#14210f]">
      <div class="mb-6 text-3xl font-black">{{ t('pause.title') }}</div>
      <div class="flex flex-col gap-3">
        <button
          class="rounded-md bg-white/40 py-3 text-lg font-black text-[#8a2020] ring-[3px] ring-[#8a2020] transition hover:bg-white/65 active:scale-95"
          @click="emit('resume')"
        >
          {{ t('pause.resume') }}
        </button>
        <button
          class="rounded-md bg-white/40 py-3 text-lg font-black ring-2 ring-[#14210f] transition hover:bg-white/65 active:scale-95"
          @click="emit('restart')"
        >
          {{ t('pause.restart') }}
        </button>
        <button
          class="rounded-md bg-white/40 py-3 text-lg font-black ring-2 ring-[#14210f] transition hover:bg-white/65 active:scale-95"
          @click="emit('menu')"
        >
          {{ t('pause.menu') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../i18n';

const { t } = useI18n();
const emit = defineEmits<{
  (e: 'resume'): void;
  (e: 'restart'): void;
  (e: 'menu'): void;
}>();
</script>
