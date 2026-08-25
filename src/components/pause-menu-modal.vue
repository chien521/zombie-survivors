<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="w-[min(90vw,22rem)] rounded-3xl bg-[#1a2236] p-8 text-center text-white shadow-2xl ring-1 ring-white/10">
      <div class="mb-6 text-3xl font-black">{{ t('pause.title') }}</div>
      <div class="flex flex-col gap-3">
        <button
          class="rounded-full bg-amber-400 py-3 text-lg font-black text-black transition hover:bg-amber-300 active:scale-95"
          @click="emit('resume')"
        >
          {{ t('pause.resume') }}
        </button>
        <button
          class="rounded-full bg-white/10 py-3 text-lg font-black transition hover:bg-white/20 active:scale-95"
          @click="emit('restart')"
        >
          {{ t('pause.restart') }}
        </button>
        <button
          class="rounded-full bg-white/10 py-3 text-lg font-black transition hover:bg-white/20 active:scale-95"
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
