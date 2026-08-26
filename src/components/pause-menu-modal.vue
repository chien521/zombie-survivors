<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="w-[min(90vw,22rem)] rounded-xl bg-[#1a1d29] p-8 text-center text-white shadow-2xl ring-1 ring-[#2a2f45]">
      <div class="mb-6 text-3xl font-black">{{ t('pause.title') }}</div>
      <div class="flex flex-col gap-3">
        <button
          class="rounded-xl bg-[#2a2f45] py-3 text-lg font-black text-[#ffe066] ring-2 ring-[#ffe066] transition hover:bg-[#394162] active:scale-95"
          @click="emit('resume')"
        >
          {{ t('pause.resume') }}
        </button>
        <button
          class="rounded-xl bg-[#2a2f45] py-3 text-lg font-black ring-2 ring-[#5a6cad] transition hover:bg-[#394162] active:scale-95"
          @click="emit('restart')"
        >
          {{ t('pause.restart') }}
        </button>
        <button
          class="rounded-xl bg-[#2a2f45] py-3 text-lg font-black ring-2 ring-[#5a6cad] transition hover:bg-[#394162] active:scale-95"
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
